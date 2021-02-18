import React, { ComponentClass, FunctionComponent, useCallback, useState, useRef, ReactElement, useEffect } from 'react'
import ReactDOM from 'react-dom'

export interface Overlay {
  setPosition: (position: [number, number]) => void,
  renderOverlay: (element: ReactElement | null) => void
}

export interface OverlayProp {
  overlay: Overlay
}

export const withOverlay = () =>
  <TOriginalProps extends {}>(
    WrappedComponent: (ComponentClass<TOriginalProps & OverlayProp> | FunctionComponent<TOriginalProps & OverlayProp>)
  ) => (props: TOriginalProps) => {
    
    const overlayRef = useRef<HTMLDivElement>(null)

    const [position, setPosition] = useState([0, 0])

    const setPositionHandler = useCallback((pos: [number, number]) => {
      setPosition(pos)
    }, [])

    const renderOverlay = useCallback((element: ReactElement | null) => {
      if (overlayRef.current) {
        ReactDOM.render(element || <div />, overlayRef.current)
      }
    }, [])

    // clean up the overlay on unmount.
    useEffect(() => () => {
      if (overlayRef.current) {
        ReactDOM.unmountComponentAtNode(overlayRef.current)
      }
    }, [])

    return (
      <div 
        style={{
          position: 'relative'
        }}
      >
        <WrappedComponent 
          {...props}
          overlay={{
            setPosition: setPositionHandler,
            renderOverlay
          }}
        />
        <div
          ref={overlayRef}
          style={{
            position: 'absolute',
            zIndex: 1000,
            left: `${position[0]}px`,
            top: `${position[1]}px`
          }}
        />
      </div>
    )
  }