'use strict'

const admin = require('firebase-admin')
const serviceAccount = require('../serviceAccountKey.json')
const {
  databaseURL,
  databasePath,
} = require(`../config.${process.env.ENV}.json`)

module.exports.initializeDb = () =>
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL,
  })

module.exports.fileToDbPath = file => {
  const fileParts = file.split(/[./]/g)
  const isParent = fileParts.length < 4

  return `/${databasePath}/${fileParts[1]}/${
    isParent ? fileParts[1] : fileParts[2]
  }`
}

module.exports.getPath = path => `/${databasePath}/${path}`

module.exports.fileToId = file => {
  const fileParts = file.split(/[./]/g)
  const isParent = fileParts.length < 4

  return isParent ? fileParts[1] : fileParts[2]
}

module.exports.setAysnc = (ref, payload) =>
  new Promise(resolve => {
    ref.set(payload, resolve)
  })
