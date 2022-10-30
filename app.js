// require packages and modules
const express = require('express')
const { engine } = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const routes = require('./routes/index')
const usePassport = require('./config/passport')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const PORT = process.env.PORT

// connect mongodb
require('./config/mongoose')

// setting template engine and css
app.engine('hbs', engine({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')
app.use(express.static('public'))

// setting body parser
app.use(express.urlencoded({ extended: true }))

// setting session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}))

// setting passport
usePassport(app)

// setting connect-flash
app.use(flash())

// setting res locals
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

// setting method override
app.use(methodOverride('_method'))

// setting routes
app.use(routes)

// listening on server
app.listen(PORT, () => {
  console.log(`Express Tracker is running on http://localhost:${PORT}`)
})