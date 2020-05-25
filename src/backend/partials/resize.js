const gm = require('gm')
const { readFile, writeFile } = require('../helpers/aws/s3')

const size = [1536, 1536]

function resize(data, size) {
  return new Promise((resolve, reject) => {
    gm(data)
      .resize(...size, '>')
      .toBuffer((err, buffer) => {
        if (err) return reject(err)
        resolve(buffer)
      })
  })
}

module.exports = async file => {
  const { Body, ContentType } = await readFile(file)
  const resizedBody = await resize(Body, size)

  await writeFile({
    ACL: 'public-read',
    Key: file.replace('o/', 'r/'),
    Body: resizedBody,
    ContentType,
  })

  return null
}
