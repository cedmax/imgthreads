const AWS = require('aws-sdk')

const kmsClient = new AWS.KMS({ region: 'eu-west-1' })

module.exports.decrypt = async encoded => {
  const paramsDecrypt = {
    CiphertextBlob: Buffer.from(encoded, 'base64'),
  }

  const decryptResult = await kmsClient.decrypt(paramsDecrypt).promise()
  return Buffer.from(decryptResult.Plaintext).toString()
}

module.exports.encrypt = async text => {
  const paramsEncrypt = {
    KeyId: process.env.KMSKeyId,
    Plaintext: `${text}`,
  }

  const encryptResult = await kmsClient.encrypt(paramsEncrypt).promise()
  return Buffer.from(encryptResult.CiphertextBlob).toString('base64')
}
