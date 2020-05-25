'use strict'

const associate = require('./partials/associate')
const resize = require('./partials/resize')

const getFileFromEvent = event => {
  const Record = event.Records[0]
  const {
    s3: {
      object: { key: file },
    },
  } = Record
  return file
}

module.exports.handler = async event => {
  const file = getFileFromEvent(event)
  const [size, parent, id] = file.split(/[./]/g)

  await associate(file, parent, id)

  if (size === 'o') {
    await resize(file)
  }

  return null
}
