import * as React from 'react'
import { withDataLifecycle, DataProp, withOverlay, OverlayProp, withFluid, FluidProp } from 'react-svg-utils'
import * as d3 from 'd3'

interface Props {
  updateCount: (countIn: number, countOut: number) => void
}

class MonteCarloGraphic extends React.Component<Props & DataProp & OverlayProp & FluidProp> {

  svg: Element | null = null

  selections: any = {}

  render() {
    return (
      <svg {...this.props.fluid.svg} ref={el => this.svg = el}>
        <circle cx="0" cy="500" r="500" fill="#006" fillOpacity="20%" stroke="none" />
        <rect fill="none" stroke="#000" strokeWidth="5" width="500" height="500" />
        <g className="points" />
      </svg>
    )
  }

  init() {
    this.selections.points = d3.select(this.svg).select('.points')
  }

  pointIsIn = (p: [number, number]) => p[0]**2 + (500-p[1])**2 <= 500*500

  countIn: number = 0
  countOut: number = 0

  draw(data: number) {
    [this.countIn, this.countOut] = [0, 0]
    this.selections.points.selectAll("*").interrupt()
    this.selections.points.selectAll('.point').remove()
    this.selections.points
        .selectAll('.point')
        .data(d3.range(data).map(() => [Math.random()*500,Math.random()*500]))
        .enter()
        .append('circle')
          .attr('class', (d:[number, number]) => this.pointIsIn(d) ? 'point point-in' : 'point point-out')
          .attr('cx', (d:any) => d[0])
          .attr('cy', (d:any) => d[1])
          .attr('r', 1)
          .attr('opacity', 0)
        .transition()
        .delay((_d:any, i:number) => i * 10)
          .attr('opacity', 1)
          .on('end', (d: [number, number]) => {
            if (this.pointIsIn(d)) {
              this.countIn++
            } else {
              this.countOut++
            }
            this.props.updateCount(this.countIn, this.countOut)
          })
  }
}

const MonteCarlo = withOverlay()(withFluid({ size: [500, 500] })(withDataLifecycle()(MonteCarloGraphic)))

interface State {
  iterations: number,
  data: number | null,
  countIn: number,
  countOut: number
}

export class MonteCarloPi extends React.Component<{}, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      iterations: 100,
      data: null,
      countIn: 0,
      countOut: 0
    }
  }

  onChangeIterations = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      iterations: +e.target.value
    })
  }

  onUpdateCount = (countIn: number, countOut: number) => {
    this.setState({
      countIn,
      countOut
    })
  }

  render() {
    return (
      <div>
        <div>
          <input type="range" step="10" min="100" max="10000" defaultValue={this.state.iterations} onChange={this.onChangeIterations} />
          <div>{this.state.iterations} Iterations</div>
          <div>Samples In: {this.state.countIn}</div>
          <div>Samples Out: {this.state.countOut}</div>
          <div>Total: {this.state.countIn+this.state.countOut}</div>
          { this.state.countIn+this.state.countOut > 0 &&
            <div>π ≈ {4 * this.state.countIn / (this.state.countIn+this.state.countOut)}</div>
          }
          <input type="button" value="Go" onClick={() => this.setState({ data: this.state.iterations })} />
        </div>
        <MonteCarlo data={this.state.data} updateCount={this.onUpdateCount} />
      </div>
    )
  }
}