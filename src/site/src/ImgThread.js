import React, { memo, useState, useEffect } from 'react'
import { useList } from 'react-firebase-hooks/database'
import firebase from 'firebase/app'
import { databaseURL, databasePath, imgBaseURL } from './config'
import Block from './components/Block'
import 'firebase/database'

import AddImage from './components/AddImage'

firebase.initializeApp({
  databaseURL,
})

let sendingId = null

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
        <div className="block">
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
          <div className="block block--borderless">
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
