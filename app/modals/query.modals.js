var mongoose = require('mongoose')

var querySchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Users',
  },
  subject: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  isResolved: {
    type: Boolean,
    default: false,
  },
})

const Querys = mongoose.model('Querys', querySchema)
module.exports = Querys
