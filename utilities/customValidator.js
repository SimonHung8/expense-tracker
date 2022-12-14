const User = require('../models/User')
const Category = require('../models/Category')

const customValidator = {
  isRegistered(email) {
    return new Promise((resolve, reject) => {
      User.findOne({ email })
        .then(user => {
          return user ? reject('這個Email已經註冊過了') : resolve(true)
        })
        .catch(() => {
          reject('請選擇支出類別')
        })
    })
  },
  isPasswordMatched(value, req) {
    if (value !== req.body.password) throw new Error('請輸入相同密碼')
    return true
  },
  isInCategoryList(category) {
    return new Promise((resolve, reject) => {
      Category.findById(category)
        .then(category => {
          return category ? resolve(true) : reject('請選擇支出類別')
        })
        .catch(() => {
          reject('請選擇支出類別')
        })
    })
  },
  hasNoSpace(value) {
    if(/\s/.test(value))  throw new Error('')
    return true
  }
}

module.exports = customValidator