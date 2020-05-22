'use strict'

const AWS = require('aws-sdk')
const gm = require('gm')
const { parseEvent, readFile, writeFile } = require('./helpers')
const { destBucket } = require('./config.json')
const size = [2048, 2048]
const thumbsize = [400, 400]

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

  const [resizedBody, thumbBody] = await Promise.all([
    resize(Body, size),
    resize(Body, thumbsize),
  ])

  const variants = {
    o: Body,
    r: resizedBody,
    t: thumbBody,
  }

  await Promise.all(
    Object.keys(variants).map(k =>
      writeFile(s3, destBucket, {
        ACL: 'public-read',
        Key: `${k}/${file}`,
        Body: variants[k],
        ContentType,
      })
    )
  )

  return null
}
