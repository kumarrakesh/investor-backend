const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

mongoose.connect(
  process.env.MONGODB_URL,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err) => {
    if (err) console.log('Error in Connecting DB')
    else console.log('Database Connected Succesfully')
  }
)
