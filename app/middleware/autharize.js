const Roles = require('../modals/roles.modals')

exports.authorize = (...roles) => {
  return async (req, res, next) => {
    // console.log(req.user.role.role)
    if (!roles.includes(req.user.role.role)) {
      return res
        .status(500)
        .json({ status: false, error: 'You are not allowed to access this' })
    }
    next()
  }
}
