import Holmes from 'holmes-js'
import { lambdaURL } from './config'

const readFileBuffer = async file =>
  new Promise(resolve => {
    const reader = new FileReader()
    reader.addEventListener('loadend', function (e) {
      resolve(reader.result)
    })
    reader.readAsArrayBuffer(file)
  })

const readDataURL = async file =>
  new Promise(resolve => {
    const reader = new FileReader()
    reader.addEventListener('loadend', function (e) {
      resolve(reader.result)
    })
    reader.readAsDataURL(file)
  })

export const getUploadUrl = async ({ file, caption, parent, browserId }) =>
  fetch(lambdaURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: file.name,
      type: file.type,
      caption,
      browserId,
      parent,
    }),
  }).then(response => response.json())

export const fileReader = async file => {
  const [buffer, dataUrl] = await Promise.all([
    readFileBuffer(file),
    readDataURL(file),
  ])

  return {
    buffer,
    dataUrl,
  }
}

export const uploader = async (url, { file, buffer }) =>
  fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: new Blob([buffer], { type: file.type }),
  })

export const getBrowserId = async () => {
  const holmes = new Holmes()
  const browserId = await holmes.get()
  return browserId
}
