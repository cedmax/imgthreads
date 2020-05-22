import React from 'react'
import { useRoutes } from 'hookrouter'
import ImgThread from './ImgThread'

const routes = {
  '/': () => () => (
    <header className="App-header">
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </header>
  ),
  '/:id': ({ id }) => <ImgThread id={id} />,
}

function App() {
  const routeResult = useRoutes(routes)

  return routeResult || <div>404</div>
}

export default App
