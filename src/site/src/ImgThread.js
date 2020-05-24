import React, { memo, useState, useEffect } from 'react'
import { useList } from 'react-firebase-hooks/database'
import firebase from 'firebase/app'
import { databaseURL, databasePath, imgBaseURL } from './config'
import 'firebase/database'

import AddImage from './components/AddImage'

firebase.initializeApp({
  databaseURL,
})

const H = ({ level, children }) => {
  const H = `h${level}`
  return <H>{children}</H>
}

let sendingId = null

const blockStyle = {
  border: '1px dashed var(--nc-bg-3)',
  padding: '2rem',
  margin: '0 auto 1rem',
  display: 'table',
}

const parentOverrides = {
  border: '',
  padding: '',
  margin: '0 0 1rem',
}

const Block = memo(
  ({ v, isParent, browserId }) =>
    !v.disabled && (
      <div
        style={{
          ...blockStyle,
          ...(isParent ? parentOverrides : {}),
          ...(browserId === v.browserId ? { background: '#f5faff' } : {}),
        }}
      >
        <img
          style={{
            width: isParent ? 'auto' : '400px',
            maxWidth: '100%',
          }}
          alt={v.caption}
          key={v.key}
          src={`${imgBaseURL}${v.file}`}
        />
        <H level={isParent ? 2 : 4}>{v.caption}</H>
      </div>
    )
)

export default memo(({ id, browserId }) => {
  const [values, loading, error] = useList(
    firebase.database().ref(`/${databasePath}/${id}`).orderByChild('timestamp')
  )

  useEffect(() => {
    if (!loading && values.length === 0) {
      window.location.href = '/'
    }
  }, [values, loading])

  useEffect(() => {
    if (values.find(v => v.val().id === sendingId)) {
      setIsUploading(false)
      sendingId = null
    }
  }, [values])

  const [isUploading, setIsUploading] = useState(false)
  return (
    <>
      {error && <strong>Error: {error}</strong>}
      {loading && <span>Loading...</span>}
      {values.length > 0 &&
        values.map((v, i) => (
          <Block
            browserId={browserId}
            isParent={i === 0}
            key={v.val().timestamp}
            v={v.val()}
          />
        ))}
      {isUploading ? (
        <div style={blockStyle}>
          <AddImage
            browserId={browserId}
            removeForm={false}
            parent={id}
            onUploadSuccessful={id => (sendingId = id)}
          />
        </div>
      ) : (
        !loading &&
        values.length > 0 && (
          <div style={{ ...blockStyle, border: '' }}>
            <input
              type="button"
              value="reply"
              onClick={() => setIsUploading(true)}
            />
          </div>
        )
      )}
    </>
  )
})
