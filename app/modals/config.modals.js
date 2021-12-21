var mongoose = require('mongoose')
require('@mongoosejs/double')
var configSchema = new mongoose.Schema({
  companyName: {
    type: String,
    default: 'FOCUS INDE GLOBAL FIXED INCOME SERIES 2021',
  },
  addressline1: {
    type: String,
    default: 'C/O Apex Fund & Corporate Ser vices (Mauritius) Ltd.',
  },
  addressline2: {
    type: String,
    default: 'Lot 15 A3, 1 Floor, Cybercity, Ebene 72201, Mauritius',
  },
  currency: {
    type: Array,
    default: ['USD', 'GBP'],
  },
})

const Configs = mongoose.model('Configs', configSchema)
module.exports = Configs
