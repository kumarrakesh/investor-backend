var mongoose = require('mongoose')
require('@mongoosejs/double')

var folioSchema = new mongoose.Schema({
  folioName: {
    type: String,
    default: '',
  },
  folioId: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Users',
  },
  commitment: {
    type: mongoose.Schema.Types.Double,
  },
  contribution: {
    type: mongoose.Schema.Types.Double,
  },
  yield: {
    type: mongoose.Schema.Types.Double,
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
