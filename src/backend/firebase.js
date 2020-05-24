'use strict'

const AWS = require('aws-sdk')
const admin = require('firebase-admin')
const { parseEvent, readMeta } = require('./helpers')
const serviceAccount = require('./serviceAccountKey.json')
const {
  databaseURL,
  databasePath,
} = require(`./config.${process.env.ENV}.json`)

const dynamodb = new AWS.DynamoDB()

const initializeDb = () =>
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL,
  })

const fileToDbPath = file => {
  const fileParts = file.split(/[./]/g)
  const isParent = fileParts.length < 4

  return `/${databasePath}/${fileParts[1]}/${
    isParent ? fileParts[1] : fileParts[2]
  }`
}
const fileToId = file => {
  const fileParts = file.split(/[./]/g)
  const isParent = fileParts.length < 4

  return isParent ? fileParts[1] : fileParts[2]
}

const setAysnc = (ref, payload) =>
  new Promise(resolve => {
    ref.set(payload, resolve)
  })

module.exports.handler = async (event, context, callback) => {
  const { file } = parseEvent(event)

  const firebase = initializeDb()
  const db = firebase.database()

  const ref = db.ref(fileToDbPath(file))

  const id = fileToId(file)
  const { caption, browserId } = await readMeta(dynamodb, id)

  await setAysnc(ref, {
    file,
    caption,
    browserId,
    id,
    timestamp: Date.now(),
  })

  firebase.delete()
  return null
}
