'use strict'
const AWS = require('aws-sdk')
const uuid = require('uuid').v4
const { bucket } = require('./config.json')
const { writeComment } = require('./helpers')

const s3 = new AWS.S3({
  signatureVersion: 'v4',
})

const dynamodb = new AWS.DynamoDB()

module.exports.handler = async event => {
  const { name, type: ContentType, parent, comment } = JSON.parse(event.body)

  const id = uuid()

  if (comment) {
    await writeComment(dynamodb, id, comment)
  }

  const uploadUrl = await s3.getSignedUrl('putObject', {
    Bucket: `${bucket}-uploads`,
    ContentType,
    Key: `${parent || id}/${id}.${name.split('.').pop()}`,
    ACL: 'bucket-owner-full-control',
  })

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://imgthreads.com',
    },
    body: JSON.stringify({
      uploadUrl,
      id,
    }),
  }
}
