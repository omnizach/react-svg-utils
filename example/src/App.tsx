import React from 'react'
import 'react-svg-utils/dist/index.css'

import { WithFluidExampleContainer } from './WithFluidExample'
import { WithDataLifecycleContainer } from './WithDataLifecycleExample'
import { WithOverlayExample } from './WithOverlayExample'
import { D3Example } from './D3Example'

const App = () => {
  return (
    <div>
      <WithFluidExampleContainer />
      <WithOverlayExample />
      <WithDataLifecycleContainer />
      
      <D3Example />
    </div>
  )
}

export default App
