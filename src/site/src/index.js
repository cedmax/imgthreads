import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { getBrowserId } from './handler'

import './index.css'
;(async () => {
  const browserId = await getBrowserId()

  ReactDOM.render(
    <React.StrictMode>
      <App browserId={`${browserId || ''}`} />
    </React.StrictMode>,
    document.getElementById('root')
  )
})()
