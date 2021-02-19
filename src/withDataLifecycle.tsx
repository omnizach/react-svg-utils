import * as React from 'react'

export interface DataProp<T = any> {
  data?: T
}

interface ExternalProps<T = any> {
  data: T
}

interface DataLifecycleComponent<P, D> extends React.ComponentClass<P> {
  init?: () => void
  draw?: (data: D) => void
  clear?: () => void
  shouldRender?: () => boolean
}

interface State {
  didInit?: boolean
}

/**
 * withDataLifeCycle is used to create lifecycle events that are more useful for
 * getting data and drawing with D3. A component will still have the regular
 * React lifecycle events (componentDidMount, componentDidUpdate, etc), but they
 * don't need to be used. The advantage to this lifecycle system is that it only
 * triggers changes when data is changed, and won't trigger without the data
 * property. When using D3, this provides a way to avoid needing to do a bunch
 * of data validation with each draw.
 *
 * render(): Just like a React Component.render. Generally, the root element is
 * an SVG for usage here.
 *
 * init(): Called whenever the data property is initially defined. If data is
 * removed and readded, the component will be cleared and init called again. 
 * Generally, init is used to set up a chart but not rendering the data.
 *
 * draw(): Called whenever the data property changes. This is the main flow
 * for D3 updates.
 *
 * clear(): Called whenever the component unmounts or data is removed (or set
 * to a falsey value). This sets the component back to an uninitialized state.
 *
 * shouldRender(): controls whether the component should render, and defaults
 * to only rendering if the data property is set. If this is defined in the
 * component, it overrides this behavior.
 */
export const withDataLifecycle = () => <TOriginalProps extends {}, TData>(
    Component: React.ComponentClass<TOriginalProps & DataProp<TData>> | React.FunctionComponent<TOriginalProps & DataProp<TData>>
  ) => {
  type ResultProps = TOriginalProps & ExternalProps<TData>

  const result = class WithDataLifeCycle extends React.Component<ResultProps, State> {
    static displayName = `ClickCounted(${Component.displayName || Component.name || 'Component'})`

    constructor(props: ResultProps) {
      super(props)

      this.ref = React.createRef()

      this.state = {
        didInit: false
      }
    }

    ref: React.RefObject<DataLifecycleComponent<TOriginalProps, TData>>

    dataIsValid = () => !!this.props.data || (this.props.data as unknown) === 0

    init = () => {
      if (!this.dataIsValid() || this.state.didInit) {
        return
      }

      this?.ref?.current?.init?.()
      this.setState({ didInit: true })
    }

    draw = () => {
      this.init()
      this.shouldRender() && this?.ref?.current?.draw?.(this.props.data)
    }

    clear = () => {
      // TODO: either fix it so this gets called before the component is removed
      // or remove this event.
      this?.ref?.current?.clear?.()

      this.setState({ didInit: false })
    }

    shouldRender = () => {
      if (this.ref.current && this.ref.current.shouldRender) {
        return this.ref.current.shouldRender()
      }
      
      return this.dataIsValid()
    }

    componentDidMount() {
      if (super.componentDidMount) {
        super.componentDidMount()
      }
      this.draw()
    }

    componentDidUpdate(prevProps: ResultProps) {
      if (!this.dataIsValid() && this.state.didInit) {
        this.clear()
      } else if (prevProps.data !== this.props.data) {
        this.draw()
      }
    }

    componentWillUnmount() {
      this.clear()
    }

    render() {
      if (this.shouldRender()) {
        return (
          <Component
            ref={this.ref }
            {...this.props}
          />
        )
      }
      return null
    }
  }

  return result
}