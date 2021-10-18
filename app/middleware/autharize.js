const Roles = require('../modals/roles.modals')

exports.authorize = (...roles) => {
  return async (req, res, next) => {
    const roleId = req.user.role

    console.log('roles', roles)

    const role = await Roles.findById(roleId)

    if (!roles.includes(role.role)) {
      return res
        .status(500)
        .json({ status: false, error: 'You are not allowed to access this' })
    }
    next()
  }
}
