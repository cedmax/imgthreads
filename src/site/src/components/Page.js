import React, { Fragment, useState, memo, useEffect, useCallback } from 'react'
import AddImage from './AddImage'
import ImgThread from './ImgThread'

export default memo(({ id, browserId }) => {
  const [parentId, setParentId] = useState(id)
  const [isUploading, setIsUploading] = useState(!id)
  const [sendingId, setSendingId] = useState(null)

  useEffect(() => setParentId(id), [id])

  const onUploadSuccessful = useCallback(
    id => {
      setSendingId(id)

      if (!parentId) {
        setParentId(id)
        window.history.pushState(null, null, `/${id}`)
      }
    },
    [parentId]
  )

  const onUpload = useCallback(() => setIsUploading(true), [])
  const onLoad = useCallback(() => {
    if (parentId) {
      setIsUploading(false)
      setSendingId(null)
    }
  }, [parentId])

  return (
    <Fragment>
      {parentId && (
        <ImgThread
          isUploading={isUploading}
          onUpload={onUpload}
          id={parentId}
          browserId={browserId}
          onLoad={onLoad}
          sendingId={sendingId}
        />
      )}
      {isUploading && (
        <AddImage
          onCancel={onLoad}
          browserId={browserId}
          parent={parentId}
          onUploadSuccessful={onUploadSuccessful}
        />
      )}
    </Fragment>
  )
})
