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
    .put({
      Item: {
        Id: id,
        Caption: caption,
        BrowserId: browserId,
        TimeStamp: Date.now(),
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
