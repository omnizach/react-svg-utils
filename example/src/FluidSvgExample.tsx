import React, { useState } from 'react'
import { FluidSvg } from 'react-svg-utils'

/**
 * This is an example of a basic SVG that scales up and down to fit its container.
 * The size state hook is only necessary to display the size. In practice, setting
 * the width and height properties does all the work you generally need.
 */
export const FluidSvgExample = () => {
  const [size, setSize] = useState([400, 200])

  return (
    <FluidSvg width="400" height="200" onResize={setSize}>
      <rect fill="#99f" stroke="#000" strokeWidth="5" width="100%" height="100%" />
      <text 
        textAnchor="middle" 
        x="200" 
        y="100"
      >
        {size[0]} x {size[1]}
      </text>
    </FluidSvg>
  )
}