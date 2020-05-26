import React, { Fragment, memo } from 'react'
import { useRoutes } from 'hookrouter'
import Page from './components/Page'

const routes = {
  '/:id?': ({ id }) =>
    memo(({ browserId }) => <Page id={id} browserId={browserId} />),
}

export default memo(({ browserId }) => {
  const RouteResult = useRoutes(routes)

  return (
    <Fragment>
      <header>
        <a href="/">&lt;Img /&gt;Threads</a>
      </header>
      <main>
        {RouteResult ? <RouteResult browserId={browserId} /> : <div>404</div>}
      </main>
    </Fragment>
  )
})
