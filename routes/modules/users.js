const express = require('express')
const passport = require('passport')
const router = express.Router()

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

module.exports = router