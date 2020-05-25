'use strict'

const { readMeta } = require('../helpers/aws')
const {
  initializeDb,
  fileToDbPath,
  fileToId,
  setAysnc,
} = require('../helpers/firebase')

module.exports = async file => {
  const firebase = initializeDb()
  const db = firebase.database()

  const ref = db.ref(fileToDbPath(file))

  const id = fileToId(file)
  const { caption, browserId, timestamp } = await readMeta(id)

  await setAysnc(ref, {
    file,
    caption,
    browserId,
    id,
    timestamp,
  })

  firebase.delete()
}
