'use strict'

const { readMeta } = require('../helpers/aws/dynamo')
const { set } = require('../helpers/firebase')

module.exports = async (file, parent, id) => {
  const { caption, browserId, timestamp } = await readMeta(id)

  await set(`/${parent}/${id}`, {
    id,
    file,
    caption,
    browserId,
    timestamp,
  })
}
