const controller = require('../controller/transaction.controllers')
const { authorize } = require('../middleware/autharize')
const { verifyToken } = require('../middleware/verifyToken')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    )
    next()
  })
  app.get(
    '/api/transactions',
    [verifyToken, authorize('USER', 'ADMIN')],
    controller.getTransactions
  )

  app.post(
    '/api/add/transaction',
    [verifyToken, authorize('ADMIN')],
    controller.addTransaction
  )
}
