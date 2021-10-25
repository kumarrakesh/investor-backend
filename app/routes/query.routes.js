const controller = require('../controller/query.controllers')
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
    '/api/query/all',
    [verifyToken, authorize('ADMIN')],
    controller.getQuery
  )

  app.get(
    '/api/query',
    [verifyToken, authorize('USER', 'ADMIN')],
    controller.getQueryofUser
  )

  app.post(
    '/api/add/query',
    [verifyToken, authorize('USER')],
    controller.addQuery
  )

  app.get('/api/query/newid', controller.newQueryID)

  app.post(
    '/api/query/update',
    [verifyToken, authorize('USER', 'ADMIN')],
    controller.updateQuery
  )

  app.delete(
    '/api/query/:id',
    [verifyToken, authorize('ADMIN')],
    controller.deleteQuery
  )
}
