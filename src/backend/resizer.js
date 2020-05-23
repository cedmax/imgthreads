'use strict'

const AWS = require('aws-sdk')
const gm = require('gm')
const { parseEvent, readFile, writeFile } = require('./helpers')
const { bucket } = require(`./config.${process.env.ENV}.json`)
const size = [1536, 1536]

const s3 = new AWS.S3()

function resize(data, size) {
  return new Promise((resolve, reject) => {
    gm(data)
      .resize(...size, '>')
      .toBuffer((err, buffer) => {
        if (err) return reject(err)
        resolve(buffer)
      })
  })
}

module.exports.handler = async function (event) {
  const { bucket: srcBucket, file } = parseEvent(event)
  const { Body, ContentType } = await readFile(s3, srcBucket, file)
  const resizedBody = await resize(Body, size)

  await writeFile(s3, bucket, {
    ACL: 'public-read',
    Key: `r/${file}`,
    Body: resizedBody,
    ContentType,
  })

  return null
}
