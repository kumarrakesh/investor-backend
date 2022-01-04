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
    required: [true, 'Trnsaction Type is required'],
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
    default: null,
  },
  status: {
    type: String,
    default: 'VALID',
    uppercase: true,
    validate: {
      validator: function (status) {
        var avaliableStatus = ['VALID', 'INVALID']

        if (avaliableStatus.includes(status)) return true
        return false
      },
      message: 'Not a Valid status',
    },
  },
  editHistory: [
    {
      type: {
        type: String,
      },
      amount: {
        type: Number,
      },
      narration: {
        type: String,
      },
      date: {
        type: Date,
      },
      sno: { type: Number },
    },
  ],
})

const FolioTransactions = mongoose.model('FolioTransactions', transactionSchema)
module.exports = FolioTransactions
