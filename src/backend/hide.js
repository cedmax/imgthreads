'use strict'
const { set } = require('./helpers/firebase')
const { parseOwnerCode } = require('./helpers/ownerCode')
const { buildResponse } = require('./helpers/response')

module.exports.handler = async event => {
  const { origin } = event.headers
  const { id, ownerCode, browserId } = JSON.parse(event.body)

  const { parentId } = await parseOwnerCode(ownerCode, { id, browserId })

  if (parentId) {
    await set(`/${parentId}/${id}/disabled`, true)
  }

  return buildResponse(origin, {
    status: 'ok',
  })
}
