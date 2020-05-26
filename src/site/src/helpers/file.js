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
