import React, { useRef, useLayoutEffect, useCallback, useState } from 'react'
import { throttle, max } from 'lodash'

export interface FluidSvgProps {
  width?: number | string,
  height?: number | string,
  viewBox?: string,
  snapWidths?: number[] | false | null,
  setHeight?: (newSize: [number, number]) => number,
  onResize?: (newSize: [number, number]) => void,
  children?: React.ReactNode
}

/**
 * An enhanced SVG that scales to fit its container using a viewBox.
 * The default behavior scales the SVG up and down proportionally.
 * 
 * The height can be adjusted independenty using the setHeight property.
 * 
 * Pro-tip: If you want different scaling behavior than the default, use
 * the preserveAspectRatio property: 
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/preserveAspectRatio
 *
 */
export const FluidSvg = 
  <TOriginalProps extends FluidSvgProps>({ 
    width = 300, 
    height = 150, 
    viewBox, // removed if supplied
    snapWidths = [180, 360, 540, 720, 960, 1140, 1540, 1860, 2500],
    setHeight,
    onResize,
    children,
    ...rest 
  }: TOriginalProps) => {

    const svgRef = useRef<SVGSVGElement>(null),
          [size, setSize] = useState<[number, number]>([+width, +height])

    const onResizeHandler = useCallback(throttle(() => {
      console.log('resize', Date.now())

      const boundedWidth = svgRef?.current?.parentElement?.getBoundingClientRect()?.width || size[0]

      let newSize: [number, number]
      if (!snapWidths) {
        newSize = [boundedWidth, boundedWidth / (size[0] / size[1])]
      } else {
        const snappedWidth = max(snapWidths.filter(d => d <= boundedWidth)) || snapWidths[0] || +width
        newSize = [snappedWidth, snappedWidth / (size[0] / size[1])]
      }

      if (setHeight) {
        newSize = [newSize[0], setHeight(newSize)]
      }

      setSize(newSize)
      if (onResize) {
        onResize(newSize)
      }
    }, 250), [])

    useLayoutEffect(() => {
      window.addEventListener('resize', onResizeHandler)
      onResizeHandler()
      return () => window.removeEventListener('resize', onResizeHandler)
    }, [])

    return (
      <svg 
        ref={svgRef}
        width={size[0]}
        height={size[1]}
        viewBox={`0 0 ${width} ${height}`}
        {...rest}
      >
        {children}
      </svg>
    )
}