const controller = require('../controller/roles.controllers')
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

  app.post(
    '/api/add/role',
    [verifyToken, authorize('ADMIN')],
    controller.addRole
  )
  app.get('/api/roles', [verifyToken, authorize('ADMIN')], controller.getRoles)
}
