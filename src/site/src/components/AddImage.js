import React, { memo, Fragment, useState, useCallback } from 'react'
import Form from '../components/Form'
import Uploader from '../components/Uploader'

import { fileReader, uploader, handleImage } from '../handler'

const scrollTo = id => {
  const yourElement = document.getElementsByName(id)
  const y = yourElement[0].getBoundingClientRect().top + window.pageYOffset

  window.scrollTo({ top: y, behavior: 'smooth' })
}

export default memo(
  ({ onUploadSuccessful, parent, removeForm = true, keepOpen }) => {
    const [imgData, setImgData] = useState({})
    const [comment, setComment] = useState(null)

    const onImageUpload = useCallback(async file => {
      if (file) {
        const imgData = await fileReader(file)
        setImgData({ ...imgData, file })
        setTimeout(() => {
          scrollTo('title')
        }, 200)
      }
    }, [])

    const onSubmit = useCallback(
      async comment => {
        const { buffer, file } = imgData
        const { uploadUrl, id } = await handleImage({
          file,
          comment,
          parent,
        })
        await uploader(uploadUrl, { file, buffer })
        setComment(comment)
        onUploadSuccessful(id)
      },
      [imgData, parent, onUploadSuccessful]
    )

    return (
      <Fragment>
        {imgData.dataUrl ? (
          <Fragment>
            <img alt={comment} src={imgData.dataUrl} />
            {removeForm ? (
              comment === null ? (
                <Form onSubmit={onSubmit} />
              ) : (
                <h2>{comment}</h2>
              )
            ) : (
              <Form onSubmit={onSubmit} />
            )}
          </Fragment>
        ) : (
          <Uploader keepOpen={keepOpen} onImageUpload={onImageUpload} />
        )}
      </Fragment>
    )
  }
)
