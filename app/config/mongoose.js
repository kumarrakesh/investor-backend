const mongoose = require('mongoose')

mongoose.connect(
  process.env.MONGODB_URL,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err) => {
    if (err) console.log('Error in Connecting DB')
    else console.log('Database Connected Succesfully')
  }
)
