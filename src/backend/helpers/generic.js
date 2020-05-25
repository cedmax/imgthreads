const { readMeta, encrypt, decrypt } = require('./aws')
const { corsDomain } = require(`../config.${process.env.ENV}.json`)

module.exports.dynamicCors = origin => {
  if (corsDomain) return corsDomain

  if (
    origin.endsWith(`imgthreads.netlify.app`) ||
    origin.startsWith('http://localhost:')
  ) {
    return origin
  }

  return null
}

module.exports.getOwnerCode = async (kmsClient, { parent, browserId, id }) => {
  if (parent) {
    const { ownerCode: parentOwnerCode } = await readMeta(parent)
    return parentOwnerCode
  } else {
    return await encrypt(kmsClient, `${browserId}/${id}`)
  }
}

module.exports.getDbPath = async (kmsClient, { ownerCode, id, browserId }) => {
  const data = await readMeta(id)

  if (ownerCode !== data.ownerCode) {
    return
  }

  const parts = await decrypt(kmsClient, ownerCode)
  const [browserIdStr, parentId] = parts.split('/')

  if (browserIdStr === `${browserId}`) {
    return `${parentId}/${id}/disabled`
  }
}
