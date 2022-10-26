const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const records = require('./modules/records')
const users = require('./modules/users')
const authenticate = require('../middleware/auth')

router.use('/users', users)
router.use('/records', authenticate, records)
router.use('/', authenticate, home)

module.exports = router