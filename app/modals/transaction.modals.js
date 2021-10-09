var mongoose = require('mongoose')
require('@mongoosejs/double')
var transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    required: [true, 'User DOC_ID is required in transactiion'],
  },
  fundname: {
    type: String,
    required: [true, 'Fund Name is required in transactiion'],
  },
  date: {
    type: Date,
    required: [true, 'Date is required in transactiion'],
  },
  narration: {
    type: String,
    default: 'Not Provided by admin',
  },
  investment: {
    type: mongoose.Schema.Types.Double,
  },
  withDraw: {
    type: mongoose.Schema.Types.Double,
  },
  gainBalance: {
    type: mongoose.Schema.Types.Double,
  },
  totalBalance: {
    type: mongoose.Schema.Types.Double,
  },
})

const Transactions = mongoose.model('Transactions', transactionSchema)
module.exports = Transactions
