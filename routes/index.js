const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const expenses = require('./modules/expenses')

router.use('/expenses', expenses)
router.use('/', home)

module.exports = router