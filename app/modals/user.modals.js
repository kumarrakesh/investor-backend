var mongoose = require('mongoose')
require('@mongoosejs/double')
var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  userId: {
    type: String,
    default: '1',
    required: true,
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
  role: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Roles',
    required: true,
  },
  amountInvested: {
    type: mongoose.Schema.Types.Double,
    default: 0,
  },
  currentInvestedValue: {
    type: mongoose.Schema.Types.Double,
    default: 0,
  },
})

const Users = mongoose.model('Users', userSchema)
module.exports = Users
