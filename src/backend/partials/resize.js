const AWS = require('aws-sdk')
const gm = require('gm')
const { readFile, writeFile } = require('../helpers/aws')

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

module.exports = async ({ bucket, file }) => {
  const s3 = new AWS.S3()

  const { Body, ContentType } = await readFile(s3, bucket, file)
  const resizedBody = await resize(Body, size)

  await writeFile(s3, bucket, {
    ACL: 'public-read',
    Key: file.replace('o/', 'r/'),
    Body: resizedBody,
    ContentType,
  })

  return null
}
