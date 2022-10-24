// require packages and modules
const express = require('express')
const { engine } = require('express-handlebars')
const routes = require('./routes/index')

const app = express()
const PORT = 3000

// setting template engine and css
app.engine('hbs', engine({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')
app.use(express.static('public'))

// setting routes
app.use(routes)

// listening on server
app.listen(PORT, () => {
  console.log(`Express Tracker is running on http://localhost:${PORT}`)
})