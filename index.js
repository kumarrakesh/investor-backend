const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const morgan = require('morgan')
const cors = require('cors')
//Do not comment this out, try fixing the issue instead or seek help
const dbChangeSet = require('./app/db-changesets/initialize-db')

//port
const port = process.env.PORT || 8000

//DB connection

require('./app/config/mongoose')
require('./app/config/create-config')
console.log('hello')
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.json({ message: 'INVESTOR  BACKEND WORKING' })
})

require('./app/routes/user.routes')(app)
require('./app/routes/transaction.routes')(app)
require('./app/routes/funds.routes')(app)
require('./app/routes/userFunds.routes.js')(app)
require('./app/routes/roles.routes.js')(app)
require('./app/routes/query.routes.js')(app)
require('./app/routes/folioTransaction.routes')(app)
require('./app/routes/folio.routes')(app)

/* App listning */

app.listen(port, () => {
  console.log('Server is up on port on ' + port)
})
