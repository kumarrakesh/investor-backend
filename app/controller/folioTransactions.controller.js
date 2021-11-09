const Folios = require('../modals/folio.modals')
const FolioTransactions = require('../modals/folioTransaction.modals')

const Users = require('../modals/user.modals')

exports.getTransactions = async (req, res) => {
  const { folioId } = req.body

  const transactions = await FolioTransactions.find({ folio: folioId })

  res.status(200).json({ status: true, data: transactions })
}

exports.addTransaction = async (req, res) => {
  const { userId, folioId, type, amount, date } = req.body

  const userFolio = await Folios.findOne({ folioId: folioId })

  //type 1 for investment , 2 for yeildPayment 3 for withdrwal

  if (type == 3) {
    if (userFolio.contribution < Math.abs(amount)) {
      return res
        .status(400)
        .json({ status: false, error: "You Can'nt Withdrwal" })
    }
  }

  userFolio.contribution += parseFloat(amount)

  await userFolio.save()

  console.log(userFolio)

  const newFolioTransaction = await FolioTransactions.create({
    user: userId,
    folio: userFolio._id,
    addedBy: req.user._id,
    type: type,
    amount: amount,
    date: new Date(date),
  })

  if (!newFolioTransaction) {
    return res
      .status(400)
      .json({ status: false, error: 'Something went wrong' })
  }

  return res.status(400).json({ status: true, data: newFolioTransaction })
}

exports.editTransaction = async (req, res) => {}

exports.getTransactionsPDF = async (req, res) => {}
