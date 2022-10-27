const express = require('express')
const { body, validationResult } = require('express-validator')
const router = express.Router()
const Category = require('../../models/Category')
const Record = require('../../models/Record')

router.get('/new', (req, res) => {
  Category.find()
    .lean()
    .then(categories => {
      res.render('new', { categories })
    })
    .catch(err => {
      console.log(err)
      res.render('err')
    })
})

router.post('/',
  body('date').isDate({ format: 'yyyy-mm-dd', strictMode: true }),
  body('amount').isNumeric(),
  (req, res) => {
    // 錯誤處理
    const errors = validationResult(req).errors
    const { name, date, category, amount } = req.body
    const errorMsg = []
    if (!name) {
      errorMsg.push('請輸入支出項目')
    }
    if (!category) {
      errorMsg.push('請選擇支出類別')
    }
    if (errors.length) {
      if (errors.some(error => error.param === 'date')) {
        errorMsg.push('請輸入有效日期 yyyy-mm-dd')
      }
      if (errors.some(error => error.param === 'amount')) {
        errorMsg.push('金額請輸入阿拉伯數字')
      }
    }
    if (errorMsg.length) {
      return Category.find()
        .lean()
        .then(categories => {
          categories.forEach(data => {
            if (data._id.toString() === category) {
              data.selected = true
            }
          })
          res.render('new', { categories, name, date, amount, errorMsg })
        })
        .catch(err => {
          console.log(err)
          res.render('err')
        })
    }
    // 創建資料
    const userID = req.user._id
    Record.create({ name, date, categoryID: category, amount, userID })
      .then(res.redirect('/'))
      .catch(err => {
        console.log(err)
        res.render('err')
      })
  })

router.get('/id/edit', (req, res) => {
  res.render('edit')
})

module.exports = router