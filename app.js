// require packages and modules
const express = require('express')
const routes = require('./routes/index')

const app = express()
const PORT = 3000

// setting routes
app.use(routes)

// listening on server
app.listen(PORT, () => {
  console.log(`Express Tracker is running on http://localhost:${PORT}`)
})