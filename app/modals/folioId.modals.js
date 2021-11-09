var mongoose = require('mongoose')
require('@mongoosejs/double')

var folioIdSchema = new mongoose.Schema({
  folioId: {
    type: Number,
    default: 0,
  },
})

const FolioNewId = mongoose.model('FolioNewId', folioIdSchema)
module.exports = FolioNewId
