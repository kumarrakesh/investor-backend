var mongoose = require('mongoose')
require('@mongoosejs/double')
var userSchema = new mongoose.Schema({
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
  profilePic: {
    type: String,
    default: '',
  },
  passport: {
    type: String,
    required: [true, 'Passport Number is Required'],
  },
  amountInvested: {
    type: mongoose.Schema.Types.Double,
  },
  investmentDate: {
    type: Date,
  },
  maturity: {
    type: Date,
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

const Users = mongoose.model('Users', userSchema)
module.exports = Users
