var mongoose = require('mongoose')
require('@mongoosejs/double')

var folioSchema = new mongoose.Schema({
  folioNumber: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Users',
  },
  commitment: {
    type: mongoose.Schema.Types.Double,
    default: 0,
  },
  contribution: {
    type: mongoose.Schema.Types.Double,
    default: 0,
  },
  yield: {
    type: mongoose.Schema.Types.Double,
  },
  yieldAmount: {
    type: mongoose.Schema.Types.Double,
    default: 0,
  },
  date: {
    type: Date,
    required: true,
  },
  lastTransactionDate: {
    type: Date,
  },
})

const Folios = mongoose.model('Folios', folioSchema)
module.exports = Folios
