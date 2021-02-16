import React, { Component } from 'react'
import { withOverlay, OverlayProp } from 'react-svg-utils'

interface Props {

}

class WithOverlayExampleComponent extends Component<Props & OverlayProp> {

  svg: Element | null = null

  onClick = (e: React.MouseEvent<SVGElement>) => {
    if (!this.svg) {
      return
    }

    const { x, y } = this.svg.getBoundingClientRect(),
          position: [number, number] = [e.clientX - x, e.clientY - y]

    this.props.overlay.setPosition(position)

    this.props.overlay.renderOverlay(
      <div
        style={{
          backgroundColor: '#fff',
          border: '2px solid #000',
          borderRadius: '5px',
          padding: '3px'
        }}
        onClick={() => this.props.overlay.clearOverlay()}
      >
        You clicked at ({position[0]},{position[1]})
      </div>
    )
  }

  render() {
    return (
      <svg width="400" height="400" onClick={this.onClick} ref={el => this.svg = el}>
        <rect fill="#f99" stroke="#000" strokeWidth="5" width="400" height="400" />
        <text 
          textAnchor="middle" 
          x="200" 
          y="200"
        >
          Click Me!
        </text>
      </svg>
    )
  }
}

export const WithOverlayExample = withOverlay()(WithOverlayExampleComponent)