import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { getBrowserId } from './helpers/identity'
import 'typeface-inter'
import '@exampledev/new.css/new.css'
import './index.css'
;(async () => {
  const browserId = await getBrowserId()

  ReactDOM.render(
    <StrictMode>
      <App browserId={browserId} />
    </StrictMode>,
    document.getElementById('root')
  )
})()
