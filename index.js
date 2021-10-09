const express = require('express')
const app = express()

const cors = require('cors')
//port
const port = process.env.PORT || 8000

//DB connection

require('./app/config/mongoose')

app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
  res.json({ message: 'INVESTOR  BACKEND WORKING' })
})

/* App listning */

app.listen(port, () => {
  console.log('Server is up on port on ' + port)
})
