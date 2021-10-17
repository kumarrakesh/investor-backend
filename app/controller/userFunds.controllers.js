const userFunds = require('../modals/userFunds.modals')

exports.userFunds = async (req, res) => {
  const userId = req.user._id

  const userFunds = await userFunds.find({ user: userId })

  return res.status(200).json({ status: true, data: userFunds })
}
