const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/User')

module.exports = app => {
  // middleware
  app.use(passport.initialize())
  app.use(passport.session())

  // strategy
  // local strategy
  passport.use(new LocalStrategy(
    { usernameField: 'email', passReqToCallback: true },
    (req, email, password, done) => {
      User.findOne({ email })
        .then(user => {
          if (!user) return done(null, false, req.flash('warning_msg', '這個email還沒有註冊過喔'))
          return bcrypt.compare(password, user.password)
            .then(isMatched => {
              if (!isMatched) return done(null, false, req.flash('warning_msg', '帳號或密碼錯誤'))
              return done(null, user)
            })
        })
        .catch(err => done(err))
    }
  ))
  // google strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CLIENT_CALLBACK
  }, (accessToken, refreshToken, profile, done) => {
    const { email, name } = profile._json
    User.findOne({ email })
      .then(user => {
        if (user) return done(null, user)
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt
          .genSalt(5)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({ name, email, password: hash }))
          .then(user => done(null, user))
          .catch(err => done(err))
      })
  }))

  // session
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err))
  })
}