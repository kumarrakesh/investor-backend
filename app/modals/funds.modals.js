var mongoose = require('mongoose')
require('@mongoosejs/double')
var fundSchema = new mongoose.Schema({
  fundname: {
    type: String,
    unique: true,
    required: [true, 'Fund name is required'],
  },
  nav: {
    type: Number,
    required: [true, 'NAV is required'],
  },
  units: {
    type: Number,
    required: [true, 'Units is required'],
  },
})

const Funds = mongoose.model('Funds', fundSchema)
module.exports = Funds
