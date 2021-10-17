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

exports.removeFund = async (req, res) => {
  const { fundId } = req.body

  if (!fundId) {
    return res.status(400).json({ status: false, error: 'FUND ID is required' })
  }

  const removeFund = Funds.remove({ _id: fundId })

  return res
    .status(200)
    .json({ status: true, message: 'Fund deleted Succesfully' })
}

exports.updateFund = async (req, res) => {
  const { fundname, nav, date } = req.body

  const fund = await Funds.findOne({ fundname: fundname })

  if (!fund) {
    return res.status(400).json({
      status: false,
      error: `No fund exists with name ${fundname} is required`,
    })
  }

  fund.nav = nav

  var index = -1

  for (var i = 0; i < fund.history.length; i++) {
    if (fund.history.date == new Date(date).toDateString()) {
      index = i
      break
    }
  }
  if (index == -1) {
    fund.history.push({ date: new Date(date).toDateString(), nav: nav })
  } else {
    fund.history[index].nav = nav
  }

  await fund.save()

  return res.status(200).json({
    status: true,
    message: 'Updated Succesfully',
    data: fund,
  })
}

exports.getFunds = async (req, res) => {
  const funds = await Funds.find({})

  return res.status(200).json({ status: true, data: funds })
}
