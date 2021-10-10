const controller = require('../controller/admin.controllers')
const { RouteGuard } = require('../middleware/routeGaurd')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    )
    next()
  })
  app.post('/api/admin/user/register', controller.addUser)

  app.get('/api/users', controller.allUsers)

  app.delete('/api/user/:id', controller.deleteUser)
}
