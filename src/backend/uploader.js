'use strict'
const AWS = require('aws-sdk')
const uuid = require('uuid').v4
const { uploadBucket: Bucket } = require('./config.json')

var s3 = new AWS.S3({
  signatureVersion: 'v4',
})

module.exports.handler = (event, context, callback) => {
  const { name, type: ContentType, parent } = JSON.parse(event.body)

  const id = uuid()
  const Key = `${parent || id}/${id}.${name.split('.').pop()}`

  var s3Params = {
    Bucket,
    Key,
    ContentType,
    ACL: 'bucket-owner-full-control',
  }

  s3.getSignedUrl('putObject', s3Params, (err, uploadURL) => {
    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://imgthreads.com',
      },
      body: JSON.stringify({
        uploadURL,
        id,
      }),
    })
  })
}
