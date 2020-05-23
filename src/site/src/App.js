import React, { Fragment } from 'react'
import { useRoutes } from 'hookrouter'
import ImgThread from './ImgThread'
import Home from './pages/Home'

const routes = {
  '/': () => browserId => <Home browserId={browserId} />,
  '/:id': ({ id }) => browserId => <ImgThread browserId={browserId} id={id} />,
}

function App({ browserId }) {
  const routeResult = useRoutes(routes)

  return (
    <Fragment>
      <header>
        <a style={{ textDecoration: 'none' }} href="/">
          &lt;Img /&gt;Threads
        </a>
      </header>
      <main>{(routeResult && routeResult(browserId)) || <div>404</div>}</main>
    </Fragment>
  )
}

export default App
