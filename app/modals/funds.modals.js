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
  lastUpdate: {
    type: Date,
  },
  history: [
    {
      date: {
        type: String,
        required: true,
      },
      nav: {
        type: mongoose.Schema.Types.Double,
        required: true,
      },
    },
  ],
})

const Funds = mongoose.model('Funds', fundSchema)
module.exports = Funds
