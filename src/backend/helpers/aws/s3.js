const AWS = require('aws-sdk')
const { bucket: Bucket } = require(`../../config/${process.env.ENV}.json`)

const s3 = new AWS.S3({
  signatureVersion: 'v4',
})

module.exports.readFile = Key =>
  s3
    .getObject({
      Bucket,
      Key,
    })
    .promise()

module.exports.writeFile = config =>
  s3
    .putObject({
      ...config,
      Bucket,
    })
    .promise()

module.exports.getSignedUrl = (Key, ContentType) =>
  s3.getSignedUrl('putObject', {
    Bucket,
    ContentType,
    Key,
    ACL: 'public-read',
  })
