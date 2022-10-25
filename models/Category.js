const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  icon: {
    type: String,
    required: true,
    unique: true
  }
})

module.exports = mongoose.Schema('Category', categorySchema)