import React, { useState } from 'react'
import { useDataLifecycle } from 'react-svg-utils'

export const UseDataLifecycleExample = (props: { data: { counter: number | null } }) => {
  useDataLifecycle(props.data.counter,
    data => console.log('init', data),
    data => console.log('draw', data),
    () => console.log('clear'))
  
  return (
    <svg width="400" height="200">
      <rect fill="#ff9" stroke="#000" strokeWidth="5" width="400" height="200" />
      <text 
        textAnchor="middle" 
        x="200" 
        y="100"
      >
        Counter = {props.data.counter}
      </text>
    </svg>
  )
}

export const UseDataLifecycleContainer = () => {
  const [counter, setCounter] = useState<number | null>(0)
  return (
    <div>
      <div>
        <input type="button" value="Reset Counter" onClick={() => setCounter(0)} />
        <input type="button" value="Increment Counter" onClick={() => setCounter((counter || 0) + 1)} />
        <input type="button" value="Set counter=null" onClick={() => setCounter(null)} />
      </div>
      <UseDataLifecycleExample 
        data={ { counter } } />
    </div>
  )
}