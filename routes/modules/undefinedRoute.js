const express = require('express')
const router = express.Router()

router.get('*', (req, res) => {
  const url = req.url
  res.render('err', { url })
})

module.exports = router