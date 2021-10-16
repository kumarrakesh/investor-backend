const Roles = require('../modals/roles.modals')

exports.addRole = async (req, res) => {
  try {
    var { rolename } = req.body

    rolename = rolename.toLowerCase()

    const role = await Roles.findOne({ role: rolename })

    if (role) {
      return res.status(404).json({
        success: false,
        data: 'This role alreay is already present',
      })
    }
    const newrole = await Roles.create({ role: rolename })
    return res.status(404).json({
      success: true,
      data: 'New role Added succesfully',
    })
  } catch (error) {
    console.log(error)

    return res.status(404).json({
      success: false,
      data: 'Something went wrong',
    })
  }
}

exports.getRoles = async (req, res) => {
  try {
    const roles = await Roles.find({})
    return res.status(200).json({
      success: true,
      data: roles,
    })
  } catch (error) {
    console.log(error)
    return res.status(404).json({
      success: false,
      data: 'Something went wrong',
    })
  }
}
