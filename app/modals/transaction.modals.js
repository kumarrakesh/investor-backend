var mongoose = require('mongoose')
require('@mongoosejs/double')
var transactionSchema = new mongoose.Schema({
  sno: {
    type: Number,
    default: 1,
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Users',
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
  nav: {
    type: mongoose.Schema.Types.Double,
  },
  investedAmount: {
    type: mongoose.Schema.Types.Double,
  },
  withdrawalAmount: {
    type: mongoose.Schema.Types.Double,
  },
  units: {
    type: mongoose.Schema.Types.Double,
  },
  totalUnits: {
    type: mongoose.Schema.Types.Double,
  },
  averageNav: {
    type: mongoose.Schema.Types.Double,
  },
  currentValue: {
    type: mongoose.Schema.Types.Double,
  },
  totalInvested: {
    type: mongoose.Schema.Types.Double,
  },
  gain: {
    type: mongoose.Schema.Types.Double,
  },
  totalGain: {
    type: mongoose.Schema.Types.Double,
  },
})

const Transactions = mongoose.model('Transactions', transactionSchema)
module.exports = Transactions
