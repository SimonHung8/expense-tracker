if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')
const Category = require('../Category')
const SEED_CATEGORY = require('./SEED_DATA/category').results

db.once('open', () => {
  Category.insertMany(SEED_CATEGORY)
    .then(() => {
      console.log('seed category constructed')
      process.exit()
    })
    .catch(err => console.log(err))
})