'use strict'
const AWS = require('aws-sdk')
const uuid = require('uuid').v4
const { bucket: Bucket } = require(`./config.${process.env.ENV}.json`)
const { writeMeta } = require('./helpers/aws')
const { dynamicCors, getOwnerCode } = require('./helpers/generic')
const s3 = new AWS.S3({
  signatureVersion: 'v4',
})
const kmsClient = new AWS.KMS({ region: 'eu-west-1' })

module.exports.handler = async event => {
  const { origin } = event.headers
  const { name, type: ContentType, parent, caption, browserId } = JSON.parse(
    event.body
  )

  const id = uuid()

  const ownerCode = await getOwnerCode(kmsClient, { parent, browserId, id })

  await writeMeta({
    id,
    caption: caption || '',
    browserId,
    ownerCode,
  })

  const uploadUrl = await s3.getSignedUrl('putObject', {
    Bucket,
    ContentType,
    Key: `o/${parent || id}/${id}.${name.split('.').pop()}`,
    ACL: 'public-read',
  })

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': dynamicCors(origin),
    },
    body: JSON.stringify({
      uploadUrl,
      ownerCode: !parent ? ownerCode : null,
      id,
    }),
  }
}
