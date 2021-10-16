const controller = require('../controller/query.controllers')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    )
    next()
  })

  app.get(
    '/api/query/all',
    [verifyToken, AccessTo(['ADMIN'])],
    controller.getQuery
  )
  app.post(
    '/api/query/update',
    [verifyToken, AccessTo(['ADMIN'])],
    controller.updateQuery
  )
}
