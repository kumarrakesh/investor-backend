const Transactions = require('../modals/transaction.modals')
const userFunds = require('../modals/userFunds.modals')
exports.getTransactions = async (req, res) => {}

exports.addTransaction = async (req, res) => {
  const {
    userId,
    fundname,
    date,
    narration,
    nav,
    investedAmount,
    withdrawalAmount,
    units,
  } = req.body

  const userFund = await userFunds.count({ user: userId, fundname: fundname })

  if (userFund == 0) {
    if (units < 0) {
      return res
        .status(400)
        .json({ status: false, error: 'Withdrawl not Allowed' })
    }
    const adduserFound = await userFunds.create({
      user: userId,
      fundname: fundname,
      totalInvested: investedAmount,
      currentValue: investedAmount,
      totalGain: 0,
      totalUnits: 0,
    })
  }
}
