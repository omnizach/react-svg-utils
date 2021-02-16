import React from 'react'
import 'react-svg-utils/dist/index.css'

import { WithFluidExampleContainer } from './WithFluidExample'
import { WithDataLifecycleContainer } from './WithDataLifecycleExample'
import { WithOverlayExample } from './WithOverlayExample'

const App = () => {
  return (
    <div>
      <WithFluidExampleContainer />
      <WithDataLifecycleContainer />
      <WithOverlayExample />
    </div>
  )
}

export default App
