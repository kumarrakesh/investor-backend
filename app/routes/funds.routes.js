const controller = require('../controller/funds.controller')
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

  //read

  app.get(
    '/api/funds',
    [verifyToken, authorize('USER', 'ADMIN')],
    controller.getFunds
  )

  //create
  app.post(
    '/api/add/fund',
    [verifyToken, authorize('ADMIN')],
    controller.addFund
  )

  //delete

  app.delete(
    '/api/remove/fund/:id',
    [verifyToken, authorize('ADMIN')],
    controller.removeFund
  )

  app.get('/api/fund/newid', controller.newFundID)

  //update

  app.post(
    '/api/update/fund',
    [verifyToken, authorize('USER', 'ADMIN')],
    controller.updateFund
  )
}
