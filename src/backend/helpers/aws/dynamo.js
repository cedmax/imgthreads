const AWS = require('aws-sdk')

const {
  dynamoTable: TableName,
} = require(`../../config/${process.env.ENV}.json`)

const dynamodb = new AWS.DynamoDB.DocumentClient()

const getProp = (data, prop) => data && data.Item && data.Item[prop]

module.exports.writeMeta = ({
  id: Id,
  caption: Caption = '',
  browserId: BrowserId,
  ownerCode: OwnerCode,
}) =>
  dynamodb
    .put({
      Item: {
        TimeStamp: Date.now(),
        Id,
        Caption,
        BrowserId,
        OwnerCode,
      },
      TableName,
    })
    .promise()

module.exports.readMeta = async Id => {
  const data = await dynamodb
    .get({
      Key: {
        Id,
      },
      TableName,
    })
    .promise()

  return {
    caption: getProp(data, 'Caption'),
    browserId: getProp(data, 'BrowserId'),
    timestamp: getProp(data, 'TimeStamp'),
    ownerCode: getProp(data, 'OwnerCode'),
  }
}
