var mongoose = require('mongoose')
var roleSchema = new mongoose.Schema({
  role: {
    type: String,
    uppercase: true,
    unique: true,
  },
})

const Roles = mongoose.model('Roles', roleSchema)
module.exports = Roles
