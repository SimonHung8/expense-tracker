const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator')
const router = express.Router()
const User = require('../../models/User')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/logout', (req, res) => {
  req.logOut(() => {
    req.flash('success_msg', '你已經登出')
    res.redirect('/users/login')
  })
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register',
  body('email').isEmail(),
  (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    const errors = validationResult(req)
    const errorMsg = []
    if (!errors.isEmpty()) {
      errorMsg.push('請輸入有效email')
    }
    if (!name || !email || !password || !confirmPassword) {
      errorMsg.push('請填寫所有欄位')
    }
    if (confirmPassword !== password) {
      errorMsg.push('密碼與確認密碼不相符')
    }
    if (errorMsg.length) {
      return res.render('register', { errorMsg, name, email, password, confirmPassword })
    }
    User.findOne({ email })
      .then(user => {
        if (user) {
          errorMsg.push('這個Email已經註冊過了')
          return res.render('register', { errorMsg, name, email, password, confirmPassword })
        }
        bcrypt.genSalt(5)
          .then(salt => bcrypt.hash(password, salt))
          .then(hash => User.create({ name, email, password: hash }))
          .then(user => req.logIn(user, () => res.redirect('/')))
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

module.exports = router