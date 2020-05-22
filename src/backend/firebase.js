'use strict'
const admin = require('firebase-admin')
const { databaseURL } = require('./config.json')
const { parseEvent } = require('./helpers')
var serviceAccount = require('./serviceAccountKey.json')

const initializeDb = () =>
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL,
  })

const fileToDbPath = file => {
  const fileParts = file.split(/[./]/g)
  const isParent = fileParts.length < 4

  return `/${fileParts[1]}/${isParent ? fileParts[1] : fileParts[2]}/files`
}

module.exports.handler = (event, context, callback) => {
  const { file } = parseEvent(event)

  const firebase = initializeDb()
  const db = firebase.database()

  const ref = db.ref(fileToDbPath(file))

  ref.set(
    {
      file,
      timestamp: Date.now(),
    },
    () => {
      firebase.delete()
      callback(null, {
        statusCode: 200,
      })
    }
  )
}
