const { dynamoTable: TableName } = require('./config.json')

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

module.exports.writeComment = (db, id, comment) =>
  db
    .putItem({
      Item: {
        Id: {
          S: id,
        },
        Comment: {
          S: comment,
        },
      },
      TableName,
    })
    .promise()

module.exports.readComment = async (db, id) => {
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

  return (data && data.Item && data.Item.Comment && data.Item.Comment.S) || ''
}
