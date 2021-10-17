const controller = require('../controller/user.controllers')
const { verifyToken } = require('../middleware/verifyToken')
const { AccessTo } = require('../middleware/accessTo')
const uploadImage = require('../config/multer')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    )
    next()
  })

  app.post(
    '/api/admin/user/register',
    uploadImage.single('profilePic'),
    controller.addUser
  )

  app.get('/api/users', controller.allUsers)

  app.delete('/api/user/:id', controller.deleteUser)

  app.post('/api/user/signin', controller.getSignIn)

  app.get('/api/profilePic/:key', controller.getProfilePic)

  app.get('/api/profile', controller.getProfile)
}
