const Folios = require('../modals/folio.modals')

const FolioNewId = require('../modals/folioId.modals')

const FolioTransactions = require('../modals/folioTransaction.modals')

const Users = require('../modals/user.modals')

const { transactionReport } = require('../PdfTemplate/transactionReport')

exports.getTransactions = async (req, res) => {
  const { folioId } = req.body

  const transactions = await FolioTransactions.find({
    folio: folioId,
  }).populate('addedBy', 'name')

  transactions.sort(function (a, b) {
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

  return res.status(200).json({ status: true, data: transactions })
}

exports.addTransaction = async (req, res) => {
  const { userId, folioId, type, amount, date, narration } = req.body

  const userFolio = await Folios.findOne({ folioId: folioId })

  const user = await Users.findOne({ username: userId.toLowerCase() })

  if (!user) {
    return res.status(400).json({
      status: false,
      error: 'No User Exits with this passport',
    })
  }

  // Conditions Before Adding Trnsaction

  // Transaction Must be After or on Folio Creation Date

  if (new Date(userFolio.date).getTime() > new Date(date).getTime()) {
    return res.status(400).json({
      status: false,
      error: 'Date must be greater or equal to folio creation date',
    })
  }

  // Withdrwal Transaction must have enough contribution

  if (type == 3) {
    if (userFolio.contribution < Math.abs(amount)) {
      return res
        .status(400)
        .json({ status: false, error: "You Can'nt Withdrwal" })
    }
  }

  // Transaction must be after last transaction date

  if (
    new Date(userFolio.lastTransactionDate).getTime() > new Date(date).getTime()
  ) {
    return res.status(400).json({
      status: false,
      error: 'Date must be after last transaction date',
    })
  }

  var Amount = type == '3' ? -1 * parseFloat(amount) : parseFloat(amount)

  userFolio.contribution += Amount

  if (type == '2') {
    userFolio.yieldAmount += Amount
  }

  userFolio.lastTransactionDate = new Date(date)

  console.log('User Folio ', userFolio)

  await userFolio.save()

  const newFolioTransaction = await FolioTransactions.create({
    user: user._id,
    folio: userFolio._id,
    addedBy: req.user._id,
    type: type,
    amount: Amount,
    date: new Date(date),
    narration: narration,
  })

  if (!newFolioTransaction) {
    return res
      .status(400)
      .json({ status: false, error: 'Something went wrong' })
  }

  return res.status(200).json({ status: true, data: newFolioTransaction })
}

exports.editTransaction = async (req, res) => {}

exports.getTransactionsPDF = async (req, res) => {
  const { folioId } = req.body
  const userId = req.user._id

  const user = req.user

  const transaction = await FolioTransactions.find({ folio: folioId })

  console.log(transaction)

  const pdffile = await transactionReport(user, transaction)

  var data = pdffile
  res.contentType('application/pdf')
  res.send(data)
}
