const User = require('../models/User')

function isRegistered(email) {
  return new Promise((resolve, reject) => {
    User.findOne({ email })
      .then(user => {
        return user ? reject('這個Email已經註冊過了') : resolve(true)
      })
  })
}

module.exports = isRegistered