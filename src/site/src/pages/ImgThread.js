import React, { memo, useState, useEffect } from 'react'
import { useList } from 'react-firebase-hooks/database'
import firebase from 'firebase/app'
import { databaseURL, databasePath } from '../config'
import 'firebase/database'
import Block from '../components/Block'

import AddImage from '../components/AddImage'

firebase.initializeApp({
  databaseURL,
})

export default memo(({ id, browserId }) => {
  const [sendingId, setSendingId] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
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
      setSendingId(null)
    }
  }, [values, sendingId])

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
            onUploadSuccessful={id => setSendingId(id)}
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
