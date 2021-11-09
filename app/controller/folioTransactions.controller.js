const Folios = require('../modals/folio.modals')

const FolioNewId = require('../modals/folioId.modals')

const FolioTransactions = require('../modals/folioTransaction.modals')

const Users = require('../modals/user.modals')

const { transactionReport } = require('../PdfTemplate/transactionReport')

// const clearDb = async () => {
//   var a = await FolioTransactions.remove({})
//   var b = await FolioNewId.remove({})
//   var c = await Folios.remove({})
//   console.log(a, b, c)
// }

// clearDb()

exports.getTransactions = async (req, res) => {
  const { folioId } = req.body

  const transactions = await FolioTransactions.find({
    folio: folioId,
  }).populate('addedBy', 'name')

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

  if (new Date(userFolio.date).getTime() > new Date(date).getTime()) {
    return res.status(400).json({
      status: false,
      error: 'Date must be greater or equal to folio creation date',
    })
  }
  userFolio.contribution +=
    type == '3' ? -1 * parseFloat(amount) : parseFloat(amount)

  await userFolio.save()

  console.log(userFolio)

  // console.log(req.user)

  const newFolioTransaction = await FolioTransactions.create({
    user: userId,
    folio: userFolio._id,
    addedBy: req.user._id,
    type: type,
    amount: type == '3' ? -1 * parseFloat(amount) : parseFloat(amount),
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

exports.getTransactionsPDF = async (req, res) => {
  // const { fundname } = req.body
  // const userId = req.user._id
  var transaction = []
  // if (!fundname) transaction = await Transactions.find({ user: userId })
  // else
  //   transaction = await Transactions.find({ user: userId, fundname: fundname })

  // transaction.sort(function (a, b) {
  //   var keyA = new Date(a.date),
  //     keyB = new Date(b.date)
  //   if (keyA < keyB) return 1
  //   if (keyA > keyB) return -1
  //   else {
  //     if (a.sno < b.sno) {
  //       return 1
  //     } else {
  //       return -1
  //     }
  //   }
  //   return 0
  // })

  const pdffile = await transactionReport(transaction)

  var data = pdffile
  res.contentType('application/pdf')
  res.send(data)
}
