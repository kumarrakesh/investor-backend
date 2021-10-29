const controller = require('../controller/user.controllers')
const { verifyToken } = require('../middleware/verifyToken')
const { authorize } = require('../middleware/autharize')
const uploadImage = require('../config/multer')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    )
    next()
  })

  // --------------------------- API ----------------------------

  app.post(
    '/api/admin/user/register',
    uploadImage.single('profilePic'),
    controller.addUser
  )

  app.get('/api/users', [verifyToken, authorize('ADMIN')], controller.allUsers)

  app.delete(
    '/api/user/:id',
    [verifyToken, authorize('ADMIN')],
    controller.deleteUser
  )

  app.post('/api/user/signin', controller.getSignIn)

  app.get('/api/profilePic/:key', controller.getProfilePic)

  app.get(
    '/api/profile',
    [verifyToken, authorize('ADMIN', 'USER')],
    controller.getProfile
  )

  app.post(
    '/api/update/profile',
    [verifyToken, authorize('USER', 'ADMIN'), uploadImage.single('profilePic')],
    controller.updateProfile
  )

  app.get('/api/user/newid', controller.newUserId)

  app.post(
    '/api/user/dashboard',
    [verifyToken, authorize('USER', 'ADMIN')],
    controller.getDashboard
  )
  app.post(
    '/api/update/profile/admin',
    [verifyToken, authorize('USER', 'ADMIN'), uploadImage.single('profilePic')],
    controller.updateProfileAdmin
  )
}
