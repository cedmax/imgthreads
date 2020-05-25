const AWS = require('aws-sdk')
const { dynamoTable: TableName } = require(`../config.${process.env.ENV}.json`)

const dynamodb = new AWS.DynamoDB.DocumentClient()

module.exports.parseEvent = event => {
  const Record = event.Records[0]
  const {
    s3: {
      bucket: { name: bucket },
      object: { key: file },
    },
  } = Record
  return { file, bucket }
}

module.exports.readFile = (s3, Bucket, Key) =>
  s3
    .getObject({
      Bucket,
      Key,
    })
    .promise()

module.exports.writeFile = (s3, Bucket, config) =>
  s3
    .putObject({
      ...config,
      Bucket,
    })
    .promise()

module.exports.writeMeta = ({ id, caption, browserId, ownerCode }) =>
  dynamodb
    .put({
      Item: {
        Id: id,
        Caption: caption,
        BrowserId: browserId,
        TimeStamp: Date.now(),
        OwnerCode: ownerCode,
      },
      TableName,
    })
    .promise()

module.exports.decrypt = async (kmsClient, encoded) => {
  const paramsDecrypt = {
    CiphertextBlob: Buffer.from(encoded, 'base64'),
  }

  const decryptResult = await kmsClient.decrypt(paramsDecrypt).promise()
  return Buffer.from(decryptResult.Plaintext).toString()
}

module.exports.readMeta = async id => {
  const data = await dynamodb
    .get({
      Key: {
        Id: id,
      },
      TableName,
    })
    .promise()

  return {
    caption: (data && data.Item && data.Item.Caption) || '',
    browserId: data && data.Item && data.Item.BrowserId,
    timestamp: data && data.Item && data.Item.TimeStamp,
    ownerCode: data && data.Item && data.Item.OwnerCode,
  }
}

module.exports.encrypt = async (kmsClient, text) => {
  const paramsEncrypt = {
    KeyId: process.env.KMSKeyId,
    Plaintext: `${text}`,
  }

  const encryptResult = await kmsClient.encrypt(paramsEncrypt).promise()
  return Buffer.from(encryptResult.CiphertextBlob).toString('base64')
}
