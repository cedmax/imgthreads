import { useRef, useEffect } from 'react'
import {
  Rotate,
  Flip,
  Brightness,
  Contrast,
  Uppload,
  en,
  Local,
  Crop,
} from 'uppload'
import 'uppload/dist/uppload.css'
import 'uppload/dist/themes/light.css'

export default ({ onImageUpload, keepOpen }) => {
  const uppload = useRef()
  useEffect(() => {
    uppload.current = new Uppload({
      lang: en,
      uploader: onImageUpload,
      disableModalClickClose: true,
    })

    uppload.current.use([
      new Local(),
      new Crop({ hideAspectRatioSettings: true }),
      new Rotate(),
      new Flip(),
      new Brightness(),
      new Contrast(),
    ])
    if (keepOpen) {
      uppload.current.on('close', () => {
        uppload.current.open()
      })
    }
    uppload.current.open()
  }, [onImageUpload, keepOpen])

  return null
}
