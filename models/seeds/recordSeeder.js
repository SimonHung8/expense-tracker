if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const bcrypt = require('bcryptjs')
const db = require('../../config/mongoose')
const Category = require('../Category')
const User = require('../User')
const Record = require('../Record')
const SEED_USERS = require('./SEED_DATA/user.json').results
const SEED_RECORDS = require('./SEED_DATA/record.json').results

db.once('open', () => {
  Category.find()
    .then(categories => {
      SEED_RECORDS.forEach(seed => {
        seed.categoryID = categories.find(category => category.name === seed.categoryID)._id
      })
    })
    .then(() => {
      Promise.all(SEED_USERS.map(seed => {
        return User.create({
          name: seed.name,
          email: seed.email,
          password: bcrypt.hashSync(seed.password, 5)
        })
          .then(user => {
            const records = []
            SEED_RECORDS.forEach(record => {
              if ((SEED_USERS.indexOf(seed) + 1) * 5 > SEED_RECORDS.indexOf(record) &&
                SEED_USERS.indexOf(seed) * 5 <= SEED_RECORDS.indexOf(record)) {
                record.userID = user._id
                records.push(record)
              }
            })
            return Record.insertMany(records)
          })
      }))
        .then(() => {
          console.log('seed record constructed')
          process.exit()
        })
    })
    .catch(err => console.log(err))
})
