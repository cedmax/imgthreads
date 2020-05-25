const { dynamoTable: TableName } = require(`../config.${process.env.ENV}.json`)

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

module.exports.writeMeta = (db, { id, caption, browserId, owner }) =>
  db
    .put({
      Item: {
        Id: id,
        Caption: caption,
        BrowserId: browserId,
        TimeStamp: Date.now(),
        owner,
      },
      TableName,
    })
    .promise()

module.exports.readMeta = async (db, id) => {
  const data = await db
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
  }
}

module.exports.encrypt = async (kmsClient, text) => {
  const paramsEncrypt = {
    KeyId: process.env.KMSKeyId,
    Plaintext: new Buffer(`${text}`),
  }

  const encryptResult = await kmsClient.encrypt(paramsEncrypt).promise()
  // The encrypted plaintext. When you use the HTTP API or the AWS CLI, the value is Base64-encoded. Otherwise, it is not encoded.
  if (Buffer.isBuffer(encryptResult.CiphertextBlob)) {
    return Buffer.from(encryptResult.CiphertextBlob).toString('base64')
  } else {
    throw new Error('Mayday Mayday')
  }
}

module.exports.decrypt = async (kmsClient, encoded) => {
  const paramsDecrypt = {
    CiphertextBlob: Buffer.from(encoded, 'base64'),
  }

  const decryptResult = await kmsClient.decrypt(paramsDecrypt).promise()
  if (Buffer.isBuffer(decryptResult.Plaintext)) {
    return Buffer.from(decryptResult.Plaintext).toString()
  } else {
    throw new Error('We have a problem')
  }
}
