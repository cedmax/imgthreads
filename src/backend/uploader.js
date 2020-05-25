'use strict'

const uuid = require('uuid').v4
const { writeMeta } = require('./helpers/aws/dynamo')
const { getSignedUrl } = require('./helpers/aws/s3')
const { getOwnerCode } = require('./helpers/ownerCode')
const { buildResponse } = require('./helpers/response')

module.exports.handler = async event => {
  const { origin } = event.headers

  const { name, type: ContentType, parent, caption, browserId } = JSON.parse(
    event.body
  )

  const id = uuid()
  const ownerCode = await getOwnerCode({ parent, browserId, id })

  await writeMeta({
    id,
    caption,
    browserId,
    ownerCode,
  })

  const uploadUrl = await getSignedUrl(
    `o/${parent || id}/${id}.${name.split('.').pop()}`,
    ContentType
  )

  const body = {
    id,
    uploadUrl,
    ...(!parent ? { ownerCode } : {}),
  }

  return buildResponse(origin, body)
}
