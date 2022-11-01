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
  // 將SEED_RECORDS內的類別名稱調整為category collection內各類別的id
  Category.find()
    .then(categories => {
      SEED_RECORDS.forEach(seedRecord => {
        seedRecord.categoryID = categories.find(category => category.name === seedRecord.categoryID)._id
      })
    })
    // 創建使用者與對應的record
    .then(() => {
      Promise.all(SEED_USERS.map(seedUser => {
        return User.create({
          name: seedUser.name,
          email: seedUser.email,
          password: bcrypt.hashSync(seedUser.password, 5)
        })
          .then(user => {
            const records = []
            // 前五筆seed record對應到第一個user，後五筆對應到第二個user
            SEED_RECORDS.forEach(seedRecord => {
              if ((SEED_USERS.indexOf(seedUser) + 1) * 5 > SEED_RECORDS.indexOf(seedRecord) &&
                SEED_USERS.indexOf(seedUser) * 5 <= SEED_RECORDS.indexOf(seedRecord)) {
                seedRecord.userID = user._id
                records.push(seedRecord)
              }
            })
            return Record.insertMany(records)
              .catch(err => console.log(err))
          })
          .catch(err => console.log(err))
      }))
        .then(() => {
          console.log('seed record constructed')
          process.exit()
        })
    })
    .catch(err => console.log(err))
})
