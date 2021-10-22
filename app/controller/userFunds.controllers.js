const userFunds = require('../modals/userFunds.modals')

exports.getuserFunds = async (req, res) => {
  const userId = req.user._id

  const user_Funds = await userFunds.find({ user: userId })

  return res.status(200).json({ status: true, data: user_Funds })
}

exports.getuserFundnames = async (req, res) => {
  const userId = req.user._id

  const user_Funds = await userFunds.find({ user: userId }).select('fundname')

  return res.status(200).json({ status: true, data: user_Funds })
}
