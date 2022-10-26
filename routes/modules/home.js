const express = require('express')
const router = express.Router()
const Record = require('../../models/Record')
const Category = require('../../models/Category')

router.get('/', (req, res) => {
  const categories = []
  const filter = req.query.filter
  // 找出所有分類，如果只從記帳記錄找，使用者可能沒有建立過該種分類的資料
  Category.find()
    .lean()
    .then(category => categories.push(...category))
    .then(() => {
      Record.find(categories.some(category => category._id.toString() === filter) ? { categoryID: filter } : {})
        // 與category collection關聯
        .populate('categoryID')
        .lean()
        .sort({ date: 'desc' })
        .then(records => {
          // 總金額
          let totalAmount = 0
          // 讓使用者可以看到自己選了哪一種分類
          categories.forEach(category => {
            if (category._id.toString() === filter) {
              category.selected = true
            }
          })
          // 調整日期格式與加總支出金額
          records.forEach(record => {
            record.date = record.date.toLocaleDateString('ja-JP',
              { year: 'numeric', month: '2-digit', day: '2-digit' })
            totalAmount += record.amount
          })
          res.render('index', { records, categories, totalAmount })
        })
    })
    .catch(err => {
      console.log(err)
      res.render('err')
    })
})

module.exports = router