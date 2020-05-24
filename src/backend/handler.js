'use strict'

const { parseEvent } = require('./helpers/aws')
const associate = require('./partials/associate')
const resize = require('./partials/resize')

module.exports.handler = async event => {
  const { bucket, file } = parseEvent(event)

  await associate(file)

  if (file.startsWith('o/')) {
    await resize({ bucket, file })
  }

  return null
}
