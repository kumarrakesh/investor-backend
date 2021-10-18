const controller = require('../controller/userFunds.controllers')
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
    '/api/user/funds',
    [verifyToken, authorize('USER', 'ADMIN')],
    controller.getuserFunds
  )
}
