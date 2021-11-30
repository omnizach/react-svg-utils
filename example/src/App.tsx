import React from 'react'
import 'react-svg-utils/dist/index.css'

//import { WithFluidExampleContainer } from './WithFluidExample'
//import { WithDataLifecycleContainer } from './WithDataLifecycleExample'
import { WithOverlayExample } from './WithOverlayExample'
//import { D3Example } from './D3Example'
//import { MonteCarloPi } from './MonteCarloPi'
import { MonteCarloPi } from './HookExperiment'
import { FluidSvgExample } from './FluidSvgExample'
import { UseDataLifecycleContainer } from './UseDataLifecycleExample'

const App = () => {
  return (
    <div>
      {/*
      <WithFluidExampleContainer />
      <WithDataLifecycleContainer />
      <D3Example />
      
      <FluidSvgExample />
      <WithOverlayExample />

      <MonteCarloPi />
      */}
      <UseDataLifecycleContainer />
    </div>
  )
}

export default App
