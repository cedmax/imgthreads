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
