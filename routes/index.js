const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const records = require('./modules/records')
const users = require('./modules/users')
const auth = require('./modules/auth')
const authenticate = require('../middleware/auth')
const undefinedRoute = require('./modules/undefinedRoute')

router.use('/auth', auth)
router.use('/users', users)
router.use('/records', authenticate, records)
router.use('/', authenticate, home)
router.use('/', undefinedRoute)

module.exports = router