const Transactions = require('../modals/transaction.modals')
const userFunds = require('../modals/userFunds.modals')
const Funds = require('../modals/funds.modals')

exports.getTransactions = async (req, res) => {
  const userId = req.user._id

  var { fundname } = req.body

  var transaction
  var user_Fund_Info

  if (!fundname) {
    const user_Funds = await userFunds
      .find({ user: userId })
      .select('totalInvested currentValue totalUnits fundname')

    var totalInvested = 0
    var currentValue = 0
    var totalUnits = 0

    for (var i = 0; i < user_Funds.length; i++) {
      var fund = await Funds.findOne({ fundname: user_Funds[i].fundname })
      // console.log(fund)
      currentValue += fund.nav * user_Funds[i].totalUnits
      totalInvested += user_Funds[i].totalInvested
      totalUnits += user_Funds[i].totalUnits
    }

    user_Fund_Info = {}
    user_Fund_Info.totalInvested = totalInvested
    user_Fund_Info.currentValue = currentValue
    user_Fund_Info.totalUnits = totalUnits

    transaction = await Transactions.find({
      user: userId,
    })
  } else {
    fundname = fundname.toUpperCase()

    user_Fund_Info = await userFunds
      .findOne({ user: userId, fundname: fundname })
      .select('totalInvested currentValue totalUnits fundname')

    user_Fund_Info = JSON.parse(JSON.stringify(user_Fund_Info))

    var fund = await Funds.findOne({ fundname: fundname })

    //  console.log(fund)

    user_Fund_Info.currentValue = fund.nav * user_Fund_Info.totalUnits

    transaction = await Transactions.find({
      user: userId,
      fundname: fundname,
    })
  }

  transaction.sort(function (a, b) {
    var keyA = new Date(a.date),
      keyB = new Date(b.date)
    if (keyA < keyB) return 1
    if (keyA > keyB) return -1
    else {
      if (a.sno < b.sno) {
        return 1
      } else {
        return -1
      }
    }
    return 0
  })

  return res
    .status(200)
    .json({ satus: true, data: transaction, header: user_Fund_Info })
}

exports.addTransaction = async (req, res) => {
  var { userId, fundname, date, narration, nav, investedAmount, units } =
    req.body

  fundname = fundname.toUpperCase()

  const fund = await Funds.findOne({ fundname: fundname })

  if (!fund) {
    return res.status(400).json({ status: false, error: 'Fund not exists' })
  }

  var timestamp = fund._id.toString().substring(0, 8)

  var fundStartDate = new Date(parseInt(timestamp, 16) * 1000).getTime()

  if (new Date(date).getTime() < fundStartDate) {
    return res.status(400).json({
      status: false,
      error: `Trx MUst be after fund start date ${new Date(
        parseInt(timestamp, 16) * 1000
      )}`,
    })
  }

  if (new Date(date).getTime() > new Date().getTime()) {
    return res.status(400).json({
      status: false,
      error: 'Cannat add future transaction',
    })
  }

  const userFund = await userFunds.findOne({ user: userId, fundname: fundname })

  if (!userFund) {
    // FIRST TRANSACTION OF THIS USER IN THE GIVEN FUND

    // console.log('FIRST TNX')

    if (units < 0) {
      return res
        .status(400)
        .json({ status: false, error: 'Withdrawl not Allowed' })
    }

    const adduserFund = await userFunds.create({
      user: userId,
      fundname: fundname,
      totalInvested: investedAmount,
      currentValue: investedAmount,
      totalGain: 0,
      totalUnits: investedAmount / nav,
      averageNav: nav,
    })

    const addFirstTransaction = await Transactions.create({
      sno: 1,
      user: userId,
      fundname: fundname,
      date: new Date(date),
      narration: narration,
      nav: nav,
      investedAmount: investedAmount,
      withdrawalAmount: 0,
      units: investedAmount / nav,
      totalUnits: investedAmount / nav,
      averageNav: nav,
      currentValue: investedAmount,
      totalInvested: investedAmount,
      gain: 0,
      totalGain: 0,
    })

    // Storing Last Transaction ID to Fetch quickly Next Time

    adduserFund.lastTransaction = addFirstTransaction._id

    await adduserFund.save()

    return res.status(200).json({ status: true, data: addFirstTransaction })
  } else {
    const lastTransactionId = userFund.lastTransaction
    const lastTransaction = await Transactions.findById(lastTransactionId)

    if (new Date(lastTransaction.date).getTime() > new Date(date).getTime()) {
      return res.status(400).json({
        status: false,
        error: 'No past Transaction can be added',
      })
    }

    if (units < 0) {
      //console.log(lastTransaction)
      if (lastTransaction.totalUnits < units) {
        return res
          .status(400)
          .json({ status: false, error: 'Not having units to withdraw' })
      }

      var sno = lastTransaction.sno + 1
      var totalUnits = lastTransaction.totalUnits - Math.abs(units)
      var currentValue = nav * totalUnits
      var totalInvested =
        lastTransaction.totalInvested -
        lastTransaction.averageNav * Math.abs(units)

      var withdrawalAmount = Math.abs(units) * nav
      var gain =
        currentValue -
        totalInvested +
        (withdrawalAmount - lastTransaction.averageNav * Math.abs(units))
      var totalGain = lastTransaction.totalGain + gain
      var averageNav = totalInvested == 0 ? 0 : totalInvested / totalUnits

      const addTransaction = await Transactions.create({
        sno: sno,
        user: userId,
        fundname: fundname,
        date: new Date(date),
        narration: narration,
        nav: nav,
        investedAmount: -1 * lastTransaction.averageNav * Math.abs(units),
        units: units,
        totalUnits: totalUnits,
        withdrawalAmount: withdrawalAmount,
        averageNav: averageNav,
        currentValue: currentValue,
        totalInvested: totalInvested,
        gain: gain,
        totalGain: totalGain,
      })

      userFund.totalInvested = totalInvested
      userFund.currentValue = currentValue
      userFund.totalGain = totalGain
      userFund.totalUnits = totalUnits
      userFund.averageNav = averageNav
      userFund.lastTransaction = addTransaction._id

      await userFund.save()

      return res.status(200).json({ status: true, data: addTransaction })
    } else {
      var sno = lastTransaction.sno + 1
      var newunits = investedAmount / nav
      var totalUnits = lastTransaction.totalUnits + newunits
      var currentValue = nav * totalUnits
      var totalInvested = lastTransaction.totalInvested + investedAmount
      var gain = currentValue - totalInvested
      var totalGain = lastTransaction.totalGain + gain
      var averageNav = totalInvested / totalUnits

      const addTransaction = await Transactions.create({
        sno: sno,
        user: userId,
        fundname: fundname,
        date: new Date(date),
        narration: narration,
        nav: nav,
        investedAmount: investedAmount,
        withdrawalAmount: 0,
        units: newunits,
        totalUnits: totalUnits,
        averageNav: averageNav,
        currentValue: currentValue,
        totalInvested: totalInvested,
        gain: gain,
        totalGain: totalGain,
      })

      userFund.totalInvested = totalInvested
      userFund.currentValue = currentValue
      userFund.totalGain = totalGain
      userFund.totalUnits = totalUnits
      userFund.averageNav = averageNav
      userFund.lastTransaction = addTransaction._id

      await userFund.save()

      return res.status(200).json({ status: true, data: addTransaction })
    }
  }
}
