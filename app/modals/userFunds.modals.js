var mongoose = require('mongoose')
require('@mongoosejs/double')
var userFundsSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Users',
  },
  fundname: {
    type: String,
    required: true,
  },
  totalInvested: {
    type: mongoose.Schema.Types.Double,
    default: 0,
  },
  currentValue: {
    type: mongoose.Schema.Types.Double,
    default: 0,
  },
  totalGain: {
    type: mongoose.Schema.Types.Double,
    default: 0,
  },
  totalUnits: {
    type: mongoose.Schema.Types.Double,
    default: 0,
  },
  averageNav: {
    type: mongoose.Schema.Types.Double,
    default: 0,
  },
})

const UserFunds = mongoose.model('UserFunds', userFundsSchema)
module.exports = UserFunds
