const Roles = require('../modals/roles.modals')

const AccessTo = async (req, res, next, roles) => {
  const roleId = req.user.role

  const role = await Roles.findById(roleId)

  var index = roles.indexOf(role.role)

  if (index == -1) {
    return res
      .status(500)
      .json({ status: false, error: 'You are not allowed to access this' })
  }

  next()
}
module.exports.AccessTo = AccessTo
