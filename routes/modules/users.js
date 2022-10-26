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
    if (!errors.isEmpty()) {
      console.log('invalid email')
    }
    if (!name) {
      console.log('invalid name')
    }
    if (!password) {
      console.log('invalid password')
    }
    if (confirmPassword !== password) {
      console.log('confirm password again')
    }
    User.findOne({ email })
      .then(user => {
        if (user) {
          console.log('registered email')
          return res.render('register', { name, email, password, confirmPassword })
        }
        bcrypt.genSalt(5)
          .then(salt => bcrypt.hash(password, salt))
          .then(hash => User.create({ name, email, password: hash }))
          .then(res.redirect('/users/login'))
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