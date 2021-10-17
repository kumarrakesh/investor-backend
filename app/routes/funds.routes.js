const controller = require('../controller/funds.controller')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    )
    next()
  })

  //read

  app.get('/api/funds', controller.getFunds)

  //create
  app.post('/api/admin/add/fund', controller.addFund)

  //delete

  app.post('/api/admin/remove/fund', controller.removeFund)

  //update

  app.post('/api/admin/update/fund', controller.updateFund)
}
