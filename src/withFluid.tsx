import * as React from 'react'
import { throttle, max } from 'lodash'

interface State {
  size: [number, number],
  scale: number
}

interface ExternalProps {

}

export interface FluidProp {
  fluid: {
    size: [number, number],
    scale: number,
    svg: {
      width: number,
      height: number,
      viewBox: string
    },
    aspectRatio: number,
    originalSize: [number, number],
    setHeight: (newHeight: number) => void
  }
}

interface Options {
  size?: [number, number],
  snap?: boolean,
  snapWidths?: number[]
}

/**
 * Resizes an SVG-based component to fit its container, using a viewBox on the SVG
 * to scale. The default behavior scales the SVG up and down proportionally.
 *
 * Usage: Apply {...fluid.svg} to an SVG to make it fluid. The other properties are useful for
 * making other calculations. 'setHeight' is useful for when the typical scaling isn't desired.
 */
export const withFluid = ({ 
                            size = [300, 150],
                            snap = true,
                            snapWidths = [180, 360, 540, 720, 960, 1140, 1540, 1860, 2500]
                          }: Options = {}) =>
  <TOriginalProps extends {}>(
    Component: (React.ComponentClass<TOriginalProps & FluidProp> | React.StatelessComponent<TOriginalProps & FluidProp>)
  ) => {

    type ResultProps = TOriginalProps & ExternalProps
    
    const result = class WithFluid extends React.Component<ResultProps, State> {
      
      static displayName = `withFluid(${Component.displayName || Component.name || 'Component'})`

      constructor(props: ResultProps) {
        super(props)

        this.onResize = throttle(this.onResize, 250).bind(this)

        this.ref = React.createRef<HTMLDivElement>()

        this.state = {
          size: size,
          scale: 1
        }
      }

      ref: React.RefObject<HTMLDivElement>

      componentDidMount() {
        window.addEventListener('resize', this.onResize)
        process.nextTick(this.onResize)
      }

      componentWillUnmount() {
        window.removeEventListener('resize', this.onResize)
      }

      resize = (newSize: [number, number]) => {
        this.setState({
          size: newSize,
          scale: newSize[0] / size[0]
        })
      }

      onResize() {
        const boundedWidth = this?.ref?.current?.parentElement?.getBoundingClientRect()?.width || size[0]

        if (!snap) {
          this.resize([boundedWidth, boundedWidth / (size[0] / size[1])])
        } else {
          const snappedWidth = max(snapWidths.filter(d => d <= boundedWidth)) || snapWidths[0] || size[0]
          this.resize([snappedWidth, snappedWidth / (size[0] / size[1])])
        }
      }

      // useful for when proportional height scaling isn't desired
      setHeight(newHeight: number) {
        this.resize([this.state.size[0], newHeight])
      }

      render(): JSX.Element {
        const fluid = {
          size: this.state.size,
          scale: this.state.scale,
          svg: {
            width: this.state.size[0],
            height: this.state.size[1],
            viewBox: `0 0 ${size[0]} ${size[1]}`
          },
          aspectRatio: this.state.size[0] / this.state.size[1],
          originalSize: size,
          setHeight: this.setHeight
        }

        return (
          <div ref={this.ref}>
            <Component
              {...this.props}
              fluid={fluid}
            />
          </div>
        )
      }
    }

    return result

    // TODO: figure out how to forward ref this so that the underlying component gets exposed as expected
    //return React.forwardRef<WithFluid, ResultProps>((props, ref) => (
    //  <WithFluid {...props} forwardedRef={ref} />
    //))
  }
