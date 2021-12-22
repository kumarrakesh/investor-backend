const controller = require('../controller/folio.controller')
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
    '/api/add/folio',
    [verifyToken, authorize('USER', 'ADMIN')],
    controller.addFolio
  )

  app.post(
    '/api/edit/folio',
    [verifyToken, authorize('USER', 'ADMIN')],
    controller.editFolio
  )

  app.get(
    '/api/user/folio',
    [verifyToken, authorize('USER', 'ADMIN')],
    controller.getUserFolio
  )

  app.post(
    '/api/all/folio',
    [verifyToken, authorize('USER', 'ADMIN')],
    controller.getAllFolio
  )

  app.post(
    '/api/get/folio',
    [verifyToken, authorize('USER', 'ADMIN')],
    controller.getFolioInfo
  )

  app.get(
    '/api/folio/newid',
    [verifyToken, authorize('USER', 'ADMIN')],
    controller.getNewFolioID
  )

  app.delete(
    '/api/folio/delete',
    [verifyToken, authorize('USER', 'ADMIN')],
    controller.deleteFolio
  )
  app.get('/api/avaliable/currency', controller.avaliableCurrency)
}
