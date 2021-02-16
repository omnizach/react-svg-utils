import React, { Component } from 'react'
import { withDataLifecycle, DataProp } from 'react-svg-utils'

interface Props {

}

class DataLifecycleExampleComponent extends Component<Props & DataProp> {
  render() {
    return (
      <svg width="400" height="200">
        <rect fill="#ff9" stroke="#000" strokeWidth="5" width="400" height="200" />
        <text 
          textAnchor="middle" 
          x="200" 
          y="100"
        >
          Counter = {this.props.data}
        </text>
      </svg>
    )
  }

  init() {
    console.log('init called')
  }

  draw(/*data: number | null*/) {
    console.log('draw called')
  }

  clear() {
    console.log('clear called')
  }
}

const WithDataLifecycleExample = withDataLifecycle()(DataLifecycleExampleComponent)

interface State {
  counter: number | null
}

export class WithDataLifecycleContainer extends Component<{}, State> {
  constructor(props: any) {
    super(props)

    this.ref = React.createRef()

    this.state = {
      counter: null
    }
  }

  ref: any

  render() {
    return (
      <div>
        <div>
          <input type="button" value="Reset Counter" onClick={() => this.setState({ counter: 0 })} />
          <input type="button" value="Increment Counter" onClick={() => this.setState({ counter: (this.state.counter || 0) + 1 })} />
          <input type="button" value="Set counter=null" onClick={() => this.setState({ counter: null })} />
        </div>
        <WithDataLifecycleExample 
          ref={this.ref}
          data={this.state.counter} />
      </div>
    )
  }
}