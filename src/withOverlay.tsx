import * as React from 'react'
import ReactDOM from 'react-dom'

export interface Overlay {
  setPosition: (position: [number, number]) => void,
  renderOverlay: (component: React.ReactElement) => void,
  clearOverlay: () => void
}

export interface OverlayProp {
  overlay: Overlay
}

interface ExternalProps {
  
}

interface State {
  style: {
    left: string,
    top: string
  },
  prop: Overlay
}

export const withOverlay = () => 
  <TOriginalProps extends {}>(
    WrappedComponent: (React.ComponentClass<TOriginalProps & OverlayProp> | React.StatelessComponent<TOriginalProps & OverlayProp>)
  ) => {

    type ResultProps = TOriginalProps & ExternalProps

    const result = class WithOverlay extends React.Component<ResultProps, State> {

      static displayName = `withOverlay(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

      constructor(props: ResultProps) {
        super(props)

        this.overlayRef = React.createRef()

        this.state = {
          style: {
            left:'0px',
            top: '0px'
          },
          prop: {
            setPosition: this.setPosition,
            renderOverlay: this.renderOverlay,
            clearOverlay: this.clearOverlay
          }
        }
      }

      overlayRef: React.RefObject<HTMLDivElement>

      componentWillUnmount() {
        if (this?.overlayRef?.current) {
          ReactDOM.unmountComponentAtNode(this.overlayRef.current)
        }
      }

      clearOverlay = () => {
        this.renderOverlay(
          <div />
        )
      }

      renderOverlay = (element: React.ReactElement) => {
        if (this?.overlayRef?.current) {
          ReactDOM.render(element, this.overlayRef.current)
        }
      }

      setPosition = (position: [number, number]) => {
        this.setState({
          style: {
            left: `${position[0]+5}px`,
            top:  `${position[1]+5}px`
          }
        })
      }

      render(): JSX.Element {
        return (
          <div 
            style={{
              position: 'relative'
            }}
          >
            <div>
              <WrappedComponent 
                {...this.props}
                overlay={this.state.prop} 
              />
            </div>
            <div
              ref={this.overlayRef}
              style={{
                position: 'absolute',
                zIndex: 1000,
                left: this.state.style.left,
                top: this.state.style.top
              }}
            />
          </div>
        )
      }
    }

    return result

    //const enhanced = React.forwardRef((props, ref) => {
    //  return <WithOverlay {...props} forwardedRef={ref} />
    //})

    //return enhanced
  }