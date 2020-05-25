'use strict'

const admin = require('firebase-admin')
const serviceAccount = require('../serviceAccountKey.json')

const {
  databaseURL,
  databasePath,
} = require(`../config/${process.env.ENV}.json`)

const initializeDb = () =>
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL,
  })

const fixPath = path => `/${databasePath}${path}`

module.exports.set = (path, payload) =>
  new Promise(resolve => {
    const firebase = initializeDb()
    const db = firebase.database()
    const ref = db.ref(fixPath(path))

    ref.set(payload, () => {
      firebase.delete()
      resolve()
    })
  })
