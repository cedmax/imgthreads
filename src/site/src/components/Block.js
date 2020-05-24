import React, { memo } from 'react'
import { imgBaseURL } from '../config'

const H = memo(({ level, children }) => {
  const H = `h${level}`
  return <H>{children}</H>
})

export default memo(
  ({ v, isParent, browserId }) =>
    !v.disabled && (
      <div
        className={`block${isParent ? ' block--borderless' : ''}`}
        style={{
          ...(browserId === v.browserId ? { background: '#f5faff' } : {}),
        }}
      >
        <img alt={v.caption} key={v.key} src={`${imgBaseURL}${v.file}`} />
        {v.caption && <H level={isParent ? 2 : 4}>{v.caption}</H>}
      </div>
    )
)
