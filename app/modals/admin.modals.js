var mongoose = require('mongoose')
require('@mongoosejs/double')
var adminSchema = new mongoose.Schema({
  username: {
    type: mongoose.SchemaTypes.ObjectId,
    required: [true, 'Username is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  name: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  pincode: {
    type: String,
  },
})

const Admins = mongoose.model('Admins', adminSchema)
module.exports = Admins
