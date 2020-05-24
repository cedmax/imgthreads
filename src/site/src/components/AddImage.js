import React, { memo, Fragment, useState, useCallback } from 'react'
import Form from '../components/Form'
import Uploader from '../components/Uploader'

import { fileReader, uploader, getUploadUrl } from '../handler'

const scrollTo = id => {
  const yourElement = document.getElementsByName(id)
  const y = yourElement[0].getBoundingClientRect().top + window.pageYOffset

  window.scrollTo({ top: y, behavior: 'smooth' })
}

export default memo(
  ({ onUploadSuccessful, parent, removeForm = true, browserId }) => {
    const [imgData, setImgData] = useState({})
    const [caption, setCaption] = useState(null)

    const onImageUpload = useCallback(async file => {
      if (file) {
        const imgData = await fileReader(file)
        setImgData({ ...imgData, file })
        setTimeout(() => {
          scrollTo('caption')
        }, 200)
      }
    }, [])

    const onSubmit = useCallback(
      async caption => {
        const { buffer, file } = imgData
        const { uploadUrl, id } = await getUploadUrl({
          browserId,
          file,
          caption,
          parent,
        })
        await uploader(uploadUrl, { file, buffer })
        setCaption(caption)
        onUploadSuccessful(id)
      },
      [imgData, parent, onUploadSuccessful, browserId]
    )

    return (
      <Fragment>
        {imgData.dataUrl ? (
          <Fragment>
            <img alt={caption} src={imgData.dataUrl} />
            {removeForm ? (
              caption === null ? (
                <Form onSubmit={onSubmit} />
              ) : (
                <h2>{caption}</h2>
              )
            ) : (
              <Form onSubmit={onSubmit} />
            )}
          </Fragment>
        ) : (
          <Uploader onImageUpload={onImageUpload} />
        )}
      </Fragment>
    )
  }
)
