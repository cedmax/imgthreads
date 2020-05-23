import React, { memo } from 'react'
import AddImage from '../components/AddImage'

export default memo(({ browserId }) => (
  <AddImage
    keepOpen={true}
    browserId={browserId}
    onUploadSuccessful={id => {
      window.history.replaceState(null, null, `/${id}`)
    }}
  />
))
