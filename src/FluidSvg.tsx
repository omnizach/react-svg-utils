import React, { useRef, useLayoutEffect, useCallback, useState } from 'react'
import { throttle, max } from 'lodash'

export interface FluidSvgProps {
  width?: number | string,
  height?: number | string,
  viewBox?: string,
  preserveNativeCoordinates?: boolean,
  snapWidths?: number[] | false | null,
  setHeight?: ((newSize: [number, number]) => number) | 'proportional' | 'static' | 'container',
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
    preserveNativeCoordinates = false,
    snapWidths = [180, 360, 540, 720, 960, 1140, 1540, 1860, 2500],
    setHeight = 'proportional',
    onResize,
    children,
    ...rest 
  }: TOriginalProps) => {

    const svgRef = useRef<SVGSVGElement>(null),
          [size, setSize] = useState<[number, number]>([+width, +height])

    const onResizeHandler = useCallback(throttle(() => {
      const boundedWidth = svgRef?.current?.parentElement?.getBoundingClientRect()?.width || size[0]

      let newSize: [number, number] = [size[0], size[1]]
      if (!snapWidths) {
        newSize[0] = boundedWidth
      } else {
        const snappedWidth = max(snapWidths.filter(d => d <= boundedWidth)) || snapWidths[0] || +width
        newSize[0] = snappedWidth
      }

      switch(setHeight) {
        case 'static': newSize[1] = size[1]; break
        case 'proportional': newSize[1] = newSize[0] / (size[0] / size[1]); break
        case 'container': newSize[1] = svgRef?.current?.parentElement?.getBoundingClientRect()?.height || size[1]; break
        default:
          if (typeof(setHeight) !== 'function') {
            console.warn('setHeight option is not valid')     
          } else {
            newSize[1] = setHeight([newSize[0], newSize[0] / (size[0] / size[1])])
          }
      }

      setSize(newSize)
      if (onResize) {
        onResize(newSize)
      }
    }, 250), [size, width, snapWidths, setHeight, onResize])

    // Subscribe to the window resize event using a callback that will remain static
    // so that unsubscribe will work properly. The above handler gets regenerated
    // whenever one of the properties changes, and then unsubscribe won't work,
    // resulting in a memory leak.
    const staticResizeHandler = useCallback(() => onResizeHandler(), [])
    useLayoutEffect(() => {
      window.addEventListener('resize', staticResizeHandler)
      staticResizeHandler()
      return () => window.removeEventListener('resize', staticResizeHandler)
    }, [])

    return (
      <svg 
        ref={svgRef}
        width={size[0]}
        height={size[1]}
        viewBox={preserveNativeCoordinates ? undefined : `0 0 ${width} ${height}`}
        {...rest}
      >
        {children}
      </svg>
    )
}