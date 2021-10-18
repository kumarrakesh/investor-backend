const Funds = require('../modals/funds.modals')

exports.addFund = async (req, res) => {
  var { fundname, nav, date } = req.body

  req.body.fundname = req.body.fundname.toUpperCase()

  const searchFund = await Funds.findOne({ fundname: req.body.fundname })

  if (searchFund) {
    return res.status(404).json({
      success: true,
      error: 'Fund Exists',
    })
  }

  req.body.history = []

  req.body.history.push({ date: new Date(date).toDateString(), nav: nav })

  req.body.lastUpdate = new Date(date)

  const fund = await Funds.create(req.body)

  return res.status(200).json({
    success: true,
    data: fund,
  })
}

exports.removeFund = async (req, res) => {
  const fundId = req.params.id

  if (!fundId) {
    return res.status(400).json({ status: false, error: 'FUND ID is required' })
  }

  const removeFund = await Funds.remove({ _id: fundId })

  return res
    .status(200)
    .json({ status: true, message: 'Fund deleted Succesfully' })
}

exports.updateFund = async (req, res) => {
  var { fundname, nav, date } = req.body

  fundname = fundname.toUpperCase()

  const fund = await Funds.findOne({ fundname: fundname })

  if (!fund) {
    return res.status(400).json({
      status: false,
      error: `No fund exists with name ${fundname} is required`,
    })
  }

  if (fund.lastUpdate < new Date(date)) {
    fund.nav = nav
    fund.lastUpdate = new Date(date)
  }

  var index = -1

  for (var i = 0; i < fund.history.length; i++) {
    if (fund.history[i].date == new Date(date).toDateString()) {
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
