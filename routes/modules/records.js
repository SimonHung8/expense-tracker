const express = require('express')
const { body, validationResult } = require('express-validator')
const router = express.Router()
const Category = require('../../models/Category')
const Record = require('../../models/Record')
const { isInCategoryList } = require('../../utilities/customValidator')

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
  body('name').isLength({ min: 1 }).withMessage('請輸入支出項目'),
  // 驗證category的值是不是MongoID，如果是MongoID再驗證是不是建立過的類別
  body('category').isMongoId().withMessage('請選擇支出類別')
    .bail().custom(category => isInCategoryList(category)),
  body('date').isDate({ format: 'yyyy-mm-dd', strictMode: true }).withMessage('請輸入有效日期 yyyy-mm-dd'),
  body('amount').isNumeric().withMessage('金額請輸入阿拉伯數字'),
  (req, res) => {
    const errors = validationResult(req)
    const { name, date, category, amount } = req.body
    // 錯誤處理
    if (!errors.isEmpty()) {
      return Category.find()
        .lean()
        .then(categories => {
          // 讓使用者知道自己選了哪個類別
          categories.forEach(data => {
            if (data._id.toString() === category) {
              data.selected = true
            }
          })
          return res.render('new', { categories, name, date, amount, errorMsg: errors.errors })
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

router.get('/:id/edit', (req, res) => {
  const _id = req.params.id
  const userID = req.user._id
  const categories = []
  Category.find()
    .lean()
    .then(category => {
      categories.push(...category)
    })
    .then(() => {
      Record.findOne({ _id, userID })
        .lean()
        .then(record => {
          categories.forEach(category => {
            if (category._id.toString() === record.categoryID.toString()) {
              category.selected = true
            }
          })
          record.date = record.date.toLocaleDateString('fr-CA',
            { year: 'numeric', month: '2-digit', day: '2-digit' })
          res.render('edit', { record, categories })
        })
        .catch(err => {
          console.log(err)
          res.render('err')
        })
    })
    .catch(err => {
      console.log(err)
      res.render('err')
    })
})

router.put('/:id',
  body('name').isLength({ min: 1 }).withMessage('請輸入支出項目'),
  body('category').isMongoId().withMessage('請選擇支出類別')
    .bail().custom(category => isInCategoryList(category)),
  body('date').isDate({ format: 'yyyy-mm-dd', strictMode: true }).withMessage('請輸入有效日期 yyyy-mm-dd'),
  body('amount').isNumeric().withMessage('金額請輸入阿拉伯數字'),
  (req, res) => {
    const errors = validationResult(req)
    const { name, date, category, amount } = req.body
    // 錯誤處理
    if (!errors.isEmpty()) {
      return Category.find()
        .lean()
        .then(categories => {
          categories.forEach(data => {
            if (data._id.toString() === category) {
              data.selected = true
            }
          })
          req.body._id = req.user._id
          return res.render('edit', { categories, record: req.body, errorMsg: errors.errors })
        })
        .catch(err => {
          console.log(err)
          res.render('err')
        })
    }
    // 修改資料
    const _id = req.params.id
    const userID = req.user._id
    Record.findOneAndUpdate({ _id, userID }, { name, date, categoryID: category, amount })
      .then(() => res.redirect('/'))
      .catch(err => {
        console.log(err)
        res.render('err')
      })
  })

router.delete('/:id', (req, res) => {
  const _id = req.params.id
  const userID = req.user._id
  Record.findOneAndDelete({ _id, userID })
    .then(res.redirect('/'))
    .catch(err => {
      console.log(err)
      res.render('err')
    })
})

module.exports = router