const Transactions = require('../modals/transaction.modals')
const userFunds = require('../modals/userFunds.modals')

exports.getTransactions = async (req, res) => {
  const userId = req.user._id

  var { fundname } = req.body

  var transaction
  var user_Fund_Info

  if (!fundname) {
    const user_Funds = await userFunds
      .find({ user: userId })
      .select('totalInvested currentValue totalUnits')

    var totalInvested = 0
    var currentValue = 0
    var totalUnits = 0

    for (var i = 0; i < user_Funds.length; i++) {
      totalInvested += user_Funds[i].totalInvested
      currentValue += user_Funds[i].currentValue
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
      .select('totalInvested currentValue totalUnits')

    transaction = await Transactions.find({
      user: userId,
      fundname: fundname,
    })
  }

  return res
    .status(200)
    .json({ satus: true, data: transaction, header: user_Fund_Info })
}

exports.addTransaction = async (req, res) => {
  var { userId, fundname, date, narration, nav, investedAmount, units } =
    req.body

  fundname = fundname.toUpperCase()

  const userFund = await userFunds.findOne({ user: userId, fundname: fundname })

  if (!userFund) {
    // FIRST TRANSACTION OF THIS USER IN THE GIVEN FUND

    console.log('FIRST TNX')

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
    if (units < 0) {
      console.log(lastTransaction)
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
        investedAmount: 0,
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
