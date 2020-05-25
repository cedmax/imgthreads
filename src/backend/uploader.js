'use strict'
const AWS = require('aws-sdk')
const uuid = require('uuid').v4
const {
  bucket: Bucket,
  corsDomain,
} = require(`./config.${process.env.ENV}.json`)
const { writeMeta } = require('./helpers/aws')

const s3 = new AWS.S3({
  signatureVersion: 'v4',
})

const dynamodb = new AWS.DynamoDB.DocumentClient()

const dynamicCors = origin => {
  if (
    origin.endsWith(`imgthreads.netlify.app`) ||
    origin.startsWith('http://localhost:')
  ) {
    return origin
  }

  return null
}

module.exports.handler = async event => {
  const { origin } = event.headers
  const { name, type: ContentType, parent, caption, browserId } = JSON.parse(
    event.body
  )

  const id = uuid()

  await writeMeta(dynamodb, { id, caption: caption || '', browserId })

  const uploadUrl = await s3.getSignedUrl('putObject', {
    Bucket,
    ContentType,
    Key: `o/${parent || id}/${id}.${name.split('.').pop()}`,
    ACL: 'public-read',
  })

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': corsDomain || dynamicCors(origin),
    },
    body: JSON.stringify({
      uploadUrl,
      id,
    }),
  }
}
