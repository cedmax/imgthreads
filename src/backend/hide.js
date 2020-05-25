'use strict'
const AWS = require('aws-sdk')
const hide = require('./partials/hide')
const { getDbPath } = require('./helpers/generic')
const { dynamicCors } = require('./helpers/generic')

const kmsClient = new AWS.KMS({ region: 'eu-west-1' })

module.exports.handler = async event => {
  const { origin } = event.headers
  const { id, ownerCode, browserId } = JSON.parse(event.body)

  const path = await getDbPath(kmsClient, {
    browserId,
    ownerCode,
    id,
  })

  if (path) {
    await hide(path)
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': dynamicCors(origin),
    },
    body: JSON.stringify({
      status: 'ok',
    }),
  }
}
