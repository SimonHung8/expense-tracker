const express = require('express')
const router = express.Router()
const Record = require('../../models/Record')
const Category = require('../../models/Category')

router.get('/', (req, res, next) => {
  const categories = []
  const filter = req.query.filter
  const userID = req.user._id
  // 找出所有分類，如果只從記帳記錄找，使用者可能沒有建立過該種分類的資料，首頁的下拉分類選單就不會出現該選項
  Category.find()
    .lean()
    .then(category => categories.push(...category))
    .then(() => {
      // 使用者是否有篩選分類，有的話就找該使用者該分類的紀錄，沒有的話就找該使用者的全部紀錄
      Record.find(categories.some(category => category._id.toString() === filter) ?
        { userID, categoryID: filter } : { userID })
        // 與category collection關聯
        .populate('categoryID')
        .lean()
        // 依時間排序，最新的在最上面
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
        .catch(next)
    })
    .catch(next)
})

module.exports = router