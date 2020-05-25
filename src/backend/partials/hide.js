'use strict'

const { initializeDb, setAysnc, getPath } = require('../helpers/firebase')

module.exports = async path => {
  const firebase = initializeDb()
  const db = firebase.database()
  const ref = db.ref(getPath(path))

  await setAysnc(ref, true)

  firebase.delete()
}
