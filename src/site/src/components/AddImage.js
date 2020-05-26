import React, { memo, Fragment, useState, useCallback } from 'react'
import Form from '../components/Form'
import Uploader from '../components/Uploader'

import { upload, getUploadUrl } from '../helpers/upload'
import { fileReader } from '../helpers/file'
import { setOwnerCode } from '../helpers/identity'

const scrollTo = name => {
  let elm
  const int = setInterval(() => {
    elm = document.getElementsByName(name)
    if (elm) {
      clearInterval(int)
      const elm = document.getElementsByName(name)
      const y = elm[0].getBoundingClientRect().top + window.pageYOffset

      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }, 100)
}

export default memo(({ onUploadSuccessful, parent, browserId, onCancel }) => {
  const [imgData, setImgData] = useState({})
  const [caption, setCaption] = useState(null)

  const onImageUpload = useCallback(async file => {
    if (file) {
      const imgData = await fileReader(file)
      setImgData({ ...imgData, file })
      scrollTo('caption')
    }
  }, [])

  const onSubmit = useCallback(
    async caption => {
      const { buffer, file } = imgData
      const { uploadUrl, id, ownerCode } = await getUploadUrl({
        browserId,
        file,
        caption,
        parent,
      })
      await upload(uploadUrl, { file, buffer })
      setCaption(caption)
      onUploadSuccessful(id)
      if (ownerCode) {
        setOwnerCode(id, ownerCode)
      }
    },
    [imgData, parent, onUploadSuccessful, browserId]
  )

  const cancelAction = useCallback(() => {
    setImgData({})
    onCancel()
  }, [onCancel])

  return (
    <Fragment>
      {imgData.dataUrl ? (
        <Fragment>
          <img alt={caption} src={imgData.dataUrl} />
          <Form onCancel={cancelAction} onSubmit={onSubmit} />
        </Fragment>
      ) : (
        <Uploader onImageUpload={onImageUpload} />
      )}
    </Fragment>
  )
})
