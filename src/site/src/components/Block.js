import React, { memo, Fragment, useCallback, useState } from 'react'
import { imgBaseURL } from '../config'
import { hide } from '../helpers/upload'

const H = memo(({ level, children }) => {
  const H = `h${level}`
  return <H>{children}</H>
})

export default memo(({ v, isParent, browserId, ownerCode, onClick }) => {
  const [currentlyHiding, setCurrentlyHiding] = useState(null)
  const onHide = useCallback(
    async e => {
      e.preventDefault()
      const id = e.target.getAttribute('data-id')
      setCurrentlyHiding(id)
      await hide(id, { ownerCode, browserId })
    },
    [ownerCode, browserId]
  )

  const isOwned = browserId === v.browserId
  return (
    <div
      className={`block${isParent ? ' block--borderless' : ''}${
        isOwned ? ' block--owner' : ''
      }`}
    >
      <img
        onClick={onClick}
        alt={v.caption}
        key={v.key}
        src={`${imgBaseURL}${v.file}`}
      />
      {ownerCode && !isParent && (
        <Fragment>
          <br />
          <button
            type="button"
            disabled={currentlyHiding === v.id}
            className="hide"
            data-id={v.id}
            onClick={onHide}
          >
            hide
          </button>
        </Fragment>
      )}
      {v.caption && <H level={isParent ? 2 : 4}>{v.caption}</H>}
    </div>
  )
})
