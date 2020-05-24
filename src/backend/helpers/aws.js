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

module.exports.writeMeta = (db, { id, caption, browserId }) =>
  db
    .putItem({
      Item: {
        Id: {
          S: id,
        },
        Caption: {
          S: caption,
        },
        BrowserId: {
          S: browserId,
        },
      },
      TableName,
    })
    .promise()

module.exports.readMeta = async (db, id) => {
  const data = await db
    .getItem({
      Key: {
        Id: {
          S: id,
        },
      },
      TableName,
    })
    .promise()

  return {
    caption:
      (data && data.Item && data.Item.Caption && data.Item.Caption.S) || '',
    browserId:
      (data && data.Item && data.Item.BrowserId && data.Item.BrowserId.S) || '',
  }
}
