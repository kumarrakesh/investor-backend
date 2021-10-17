const controller = require('../controller/transaction.controllers')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    )
    next()
  })
  app.get('/api/transactions', controller.getTransactions)

  app.post('/api/add/transaction', controller.addTransaction)
}
