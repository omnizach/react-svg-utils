import React, { Component } from 'react'
import { withFluid, FluidProp } from 'react-svg-utils'

interface Props {

}

/**
 * This example shows how withFluid will scale the SVG to fit its parent container.
 * The svg is hard-coded to be 400x200, but will scale up or down proportionally.
 * This is useful when making dynamic charts where you don't have to worry about
 * scaling. Just make it the dimensions you want and withFluid will handle the rest.
 *
 * The sizes snap to some common values to minimize aliasing issues and make graph
 * elements render nicely (e.g. axis ticks, bar heights, etc). The default sizes
 * match the layout widths in bootstrap.
 */
class FluidSvgExample extends Component<Props & FluidProp> {
  render() {
    return (
      <svg {...this.props.fluid.svg}>
        <rect fill="#99f" stroke="#000" strokeWidth="5" width="400" height="200" />
        <text 
          textAnchor="middle" 
          x="200" 
          y="100"
        >
          {this.props.fluid.size[0]} x {this.props.fluid.size[1]}
        </text>
      </svg>
    )
  }
}

const WithFluidExample = withFluid({ size: [400, 200] })(FluidSvgExample),
      WithFluidSnappingDisabledExample = withFluid({ size: [400, 200], snap: false })(FluidSvgExample)

interface State {
  width: number
}

/**
 * This class is just a way to show how the SVG above can be resized by changing
 * the parent container's size. The Resize method is called explicitly in this
 * example to trigger the redraw, but in practice the SVG will respond to the
 * browser being resized on its own.
 */
export class WithFluidExampleContainer extends Component<{}, State> {
  constructor(props: {}) {
    super(props)

    this.ref = React.createRef()
    this.ref2 = React.createRef()

    this.state = {
      width: 400
    }
  }

  ref: any
  ref2: any

  onChangeSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      width: +e.target.value
    })

    // manually trigger the window resized function. This is really only
    // for this example to work without having to resize the window to see it.
    if (this.ref.current) {
      this.ref.current.onResize()
      this.ref2.current.onResize()
    }
  }

  render() {
    return (
      <div>
        <input type="range" step="10" min="100" max="1000" defaultValue={this.state.width} onChange={this.onChangeSize} />
        <span>The container's width is: {this.state.width}</span>
        <div style={({width: this.state.width})}>
          <span>Example with snapping enabled:</span>
          <WithFluidExample ref={this.ref} />
          <span>Example with snapping disabled:</span>
          <WithFluidSnappingDisabledExample ref={this.ref2} />
        </div>
      </div>
    )
  }
}