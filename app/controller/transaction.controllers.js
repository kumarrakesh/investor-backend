const Transactions = require('../modals/transaction.modals')
const userFunds = require('../modals/userFunds.modals')

exports.getTransactions = async (req, res) => {
  const userId = req.user._id

  const { fundname } = req.body

  var transaction

  if (!fundname) {
    transaction = await Transactions.find({ user: userId })
  } else {
    transaction = await Transactions.find({ user: userId, fundname: fundname })
  }

  return res.status(200).json({ satus: true, data: transaction })
}

exports.addTransaction = async (req, res) => {
  const { userId, fundname, date, narration, nav, investedAmount, units } =
    req.body

  const userFund = await userFunds.findOne({ user: userId, fundname: fundname })

  if (!userFund) {
    // FIRST TRANSACTION OF THIS USER IN THE GIVEN FUND

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
      totalUnits: units,
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
      units: units,
      totalUnits: units,
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
      if (lastTransaction.units < units) {
        return res
          .status(400)
          .json({ status: false, error: 'Not having units to withdraw' })
      }

      var sno = lastTransaction.sno + 1
      var totalUnits = lastTransaction.units - units
      var currentValue = nav * totalUnits
      var totalInvested =
        lastTransaction.totalInvested - lastTransaction.averageNav * units

      var withdrawalAmount = units * nav
      var gain =
        currentValue -
        totalInvested +
        (withdrawalAmount - lastTransaction.averageNav * units)
      var totalGain = lastTransaction.gain + gain
      var averageNav = totalInvested / totalUnits

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
      var totalUnits = lastTransaction.units + units
      var currentValue = nav * totalUnits
      var totalInvested = lastTransaction.totalInvested + investedAmount
      var gain = currentValue - totalInvested
      var totalGain = lastTransaction.gain + gain
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
        units: units,
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
