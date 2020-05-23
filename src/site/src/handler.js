import Holmes from 'holmes-js'

const apiBaseURL = 'https://2ma8kd6n34.execute-api.eu-west-1.amazonaws.com/dev'

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

const getUploadUrl = async ({ file, comment, parent }) =>
  fetch(apiBaseURL + '/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: file.name,
      type: file.type,
      comment,
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

export const handleImage = async ({ file, comment, parent }) => {
  const { uploadUrl, id } = await getUploadUrl({
    file,
    comment,
    parent,
  })

  return {
    uploadUrl,
    id,
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
