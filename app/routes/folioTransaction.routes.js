const controller = require('../controller/folioTransactions.controller')
const { authorize } = require('../middleware/autharize')
const { verifyToken } = require('../middleware/verifyToken')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept,application/pdf'
    )
    next()
  })

  app.post(
    '/api/add/folio/transaction',
    [verifyToken, authorize('USER', 'ADMIN')],
    controller.addTransaction
  )

  app.post(
    '/api/edit/folio/transaction',
    [verifyToken, authorize('USER', 'ADMIN')],
    controller.editTransaction
  )

  app.post(
    '/api/get/folio/transaction',
    [verifyToken, authorize('USER', 'ADMIN')],
    controller.getTransactions
  )

  app.post(
    '/api/download/folio/transaction',
    [verifyToken, authorize('USER', 'ADMIN')],
    controller.getTransactionsPDF
  )
}
