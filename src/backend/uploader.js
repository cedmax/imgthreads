'use strict'
const AWS = require('aws-sdk')
const uuid = require('uuid').v4
const { bucket, corsDomain } = require(`./config.${process.env.ENV}.json`)
const { writeMeta } = require('./helpers')

const s3 = new AWS.S3({
  signatureVersion: 'v4',
})

const dynamodb = new AWS.DynamoDB()

module.exports.handler = async event => {
  const { name, type: ContentType, parent, caption, browserId } = JSON.parse(
    event.body
  )

  const id = uuid()

  await writeMeta(dynamodb, { id, caption: caption || '', browserId })

  const uploadUrl = await s3.getSignedUrl('putObject', {
    Bucket: `${bucket}-uploads`,
    ContentType,
    Key: `${parent || id}/${id}.${name.split('.').pop()}`,
    ACL: 'bucket-owner-full-control',
  })

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': corsDomain,
    },
    body: JSON.stringify({
      uploadUrl,
      id,
    }),
  }
}
