// require packages and modules
const express = require('express')
const { engine } = require('express-handlebars')
const session = require('express-session')
const routes = require('./routes/index')
const usePassport = require('./config/passport')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const PORT = 3000

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
  secret: 'expense-tracker',
  resave: false,
  saveUninitialized: true,
}))

// setting passport
usePassport(app)

// setting routes
app.use(routes)

// listening on server
app.listen(PORT, () => {
  console.log(`Express Tracker is running on http://localhost:${PORT}`)
})