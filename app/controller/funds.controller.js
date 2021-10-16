const Funds = require('../modals/funds.modals')

exports.addFund = async (req, res) => {
  req.body.fundname = req.body.fundname.toUpperCase()

  const searchFund = await Funds.findOne({ fundname: req.body.fundname })

  if (searchFund) {
    return res.status(404).json({
      success: true,
      data: 'Fund Exists',
    })
  }

  const fund = await Funds.create(req.body)

  return res.status(200).json({
    success: true,
    data: fund,
  })
}
