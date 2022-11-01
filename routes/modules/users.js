const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator')
const router = express.Router()
const User = require('../../models/User')
const isRegistered = require('../../utilities/isRegistered')
const isPasswordMatched = require('../../utilities/isPasswordMatched')

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
  body('email').custom(email => isRegistered(email)),
  body('name').isLength({ min: 1 }).withMessage('請輸入使用者名稱'),
  body('email').isEmail().withMessage('請輸入有效Email'),
  body('password').isLength({ min: 1 }).withMessage('請輸入密碼'),
  body('confirmPassword').custom((value, { req }) => isPasswordMatched(value, req)),
  (req, res) => {
    const errors = validationResult(req)
    const { name, email, password, confirmPassword } = req.body
    if (!errors.isEmpty()) {
      return res.render('register', { errorMsg: errors.errors, name, email, password, confirmPassword })
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

module.exports = router