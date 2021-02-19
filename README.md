# react-svg-utils

> Utility functions for creating SVG-based components in ReactJS.

[![NPM](https://img.shields.io/npm/v/react-svg-utils.svg)](https://www.npmjs.com/package/react-svg-utils) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-svg-utils
```

## FluidSvg

An SVG component that scales up to fit its container. This is useful for creating charts at a
static size and have it look readable in all formats. If used in a bootstrap fluid container,
it will resize and act accordingly to the window changing.

The default behavior picks the largest standard size (bootstrap grid widths) possible. When
creating charts, this avoids aliasing and pixel alignment issues.

```tsx
import React, { useState } from 'react'
import { FluidSvg } from 'react-svg-utils'

export const FluidSvgExample = () => {
  // this hook is only necessary to display the size, the resizing functionality
  // works without it.
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
```

## useConditionEffect

A react hook that only executes if a condition is met.

## useToggleEffect

A react hook that only executes when a condition changes.

## withDataLifecycle

A High-order Component that creates lifecycle methods (`init`, `draw`) that execute
when the `data` prop is valid and changes. This is useful for using the general update
pattern in D3.

## withFluid

A High-order Component version of FluidSvg.

## withOverlay

A High-order Component that provides properties for displaying an overlay over the component.
This is useful for charts where there is a mouseover or click behavior. Given that using D3
breaks out of the React managed components, this adds some functionality back in, in a "D3" way.

## License

MIT © [omnizach](https://github.com/omnizach)
