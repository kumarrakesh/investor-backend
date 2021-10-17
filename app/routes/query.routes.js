const controller = require('../controller/query.controllers')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    )
    next()
  })

  app.get('/api/query/all', controller.getQuery)

  app.get('/api/query', controller.getQueryofUser)

  app.post('/api/add/query', controller.addQuery)

  app.post('/api/query/update', controller.updateQuery)

  app.delete('/api/query', deleteQuery)
}
