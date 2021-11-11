var mongoose = require('mongoose')
require('@mongoosejs/double')
var transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Users',
    required: [true, 'User DOC_ID is required in transactiion'],
  },
  folio: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Folios',
    required: [true, 'Folio DOC_ID is required in transactiion'],
  },
  addedBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Users',
    required: [true, 'User DOC_ID is required in transactiion'],
  },
  type: {
    type: Number,
    required: true,
  },
  amount: {
    type: mongoose.Schema.Types.Double,
    required: true,
  },
  date: {
    type: Date,
    required: [true, 'Date is required in transactiion'],
  },
  narration: {
    type: String,
    default: '',
  },
})

const FolioTransactions = mongoose.model('FolioTransactions', transactionSchema)
module.exports = FolioTransactions
