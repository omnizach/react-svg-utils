import * as React from 'react'
import { withDataLifecycle, DataProp } from 'react-svg-utils'
import * as d3 from 'd3'

interface Props {

}

class D3ExampleComponent extends React.Component<Props & DataProp> {
  
  svg: Element | null = null

  selections: any = {}

  render() {
    return (
      <svg width="400" height="400" ref={el => this.svg = el}>
        <rect fill="#9f9" stroke="#000" strokeWidth="5" width="400" height="400" />
        <g className="lines" />
        <g className="points" />
      </svg>
    )
  }

  init() {
    this.selections.points = d3.select(this.svg).select('.points')
    this.selections.lines = d3.select(this.svg).select('.lines')
  }

  draw(data: any) {
    this.selections.points
        .selectAll('.point')
        .data(data)
        .enter()
          .append('circle')
          .attr('cx', (d:any) => d[0])
          .attr('cy', (d:any) => d[1])
          .attr('r', 3)

    this.selections.lines
        .selectAll('.lines')
        .data(d3.pairs(data))
        .enter()
          .append('line')
          .attr('x1', (d:any) => d[0][0])
          .attr('y1', (d:any) => d[0][1])
          .attr('x2', (d:any) => d[1][0])
          .attr('y2', (d:any) => d[1][1])
          .attr('stroke', '#333')
          .attr('stroke-width', 1)
  }
}

const D3ExampleChart = withDataLifecycle()(D3ExampleComponent)

interface State {
  data: [number, number][]
}

export class D3Example extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props)

    this.state = {
      data: []
    }
  }

  onClick = () => {
    console.log(this.state.data)
    this.setState({
      data: this.state.data.concat([[Math.random() * 400, Math.random() * 400]])
    })
  }

  render() {
    return (
      <div>
        <div>
          <input type="button" value="Add Random Point" onClick={this.onClick} />
        </div>
        <D3ExampleChart
          data={this.state.data}
        />
      </div>
    )
  }
}