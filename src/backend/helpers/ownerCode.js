const { readMeta } = require('../helpers/aws/dynamo')
const { encrypt, decrypt } = require('./encrypter')

module.exports.getOwnerCode = async ({ parent, browserId, id }) => {
  if (parent) {
    const { ownerCode } = await readMeta(parent)
    return ownerCode
  } else {
    return encrypt(`${browserId}/${id}`)
  }
}

module.exports.parseOwnerCode = async (ownerCode, { id, browserId }) => {
  const data = await readMeta(id)
  if (ownerCode !== data.ownerCode) {
    return
  }

  const parts = await decrypt(ownerCode)
  const [browserIdStr, parentId] = parts.split('/')

  if (browserIdStr === `${browserId}`) {
    return { parentId }
  }
}
