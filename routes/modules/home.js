const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send('expense tracker project init, this is home page')
})

module.exports = router