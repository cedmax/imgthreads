const Cryptr = require('cryptr')
const secret = require('../encryptKey.json').key
const cryptr = new Cryptr(secret)

module.exports.decrypt = encoded => cryptr.decrypt(encoded)
module.exports.encrypt = text => cryptr.encrypt(text)
