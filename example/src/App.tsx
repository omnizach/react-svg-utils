import React from 'react'
import 'react-svg-utils/dist/index.css'

//import { WithFluidExampleContainer } from './WithFluidExample'
//import { WithDataLifecycleContainer } from './WithDataLifecycleExample'
//import { WithOverlayExample } from './WithOverlayExample'
//import { D3Example } from './D3Example'
import { MonteCarloPi } from './MonteCarloPi'

const App = () => {
  return (
    <div>
      {/*
      <WithFluidExampleContainer />
      <WithOverlayExample />
      <WithDataLifecycleContainer />
      <D3Example />
      */}
      <MonteCarloPi />
    </div>
  )
}

export default App
