const Folios = require('../modals/folio.modals')

const FolioTransactions = require('../modals/folioTransaction.modals')

const Users = require('../modals/user.modals')

const { transactionReport } = require('../transactionPdf/transactionReport')

const isValid = async (type, amount, date, userFolio) => {
  // Transaction must be after Folio Creation Date

  var trxTime = new Date(date).getTime()
  var lastTrxTime = new Date(userFolio.lastTransactionDate).getTime()
  var folioStartTime = new Date(userFolio.date).getTime()
  var currentContribution = userFolio.contribution

  if (folioStartTime > trxTime)
    return {
      error: 'Date Must be on or after Folio Registration date',
      valid: false,
    }

  //Must have suffeicent amount for withdrwal

  if (type == 3)
    if (currentContribution < Math.abs(amount))
      return { error: 'Insufficient Contributed Amount', valid: false }

  // Transaction must be after last transaction date

  if (lastTrxTime > trxTime)
    return {
      error: 'Transaction Date must be after or on last transaction date',
      valid: false,
    }

  //Amount Must be Positive

  if (amount <= 0)
    return { error: 'Amount must be greater than zero', valid: false }

  return { valid: true }
}

exports.getTransactions = async (req, res) => {
  const { folioNumber } = req.body

  if (!folioNumber) {
    return res.status(400).json({ status: false, error: 'Folio Number needed' })
  }

  console.log('GET TRANSACTION  BODY ', req.body)

  const folio = await Folios.findOne({ folioNumber: folioNumber })

  console.log(folio)

  if (!folio) {
    return res.status(400).json({ status: false, error: 'No Folio Exists' })
  }

  const transactions = await FolioTransactions.find({
    folio: folio._id,
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
  const { folioNumber, statements } = req.body

  var userFolio = await Folios.findOne({ folioNumber: folioNumber })

  const user = await Users.findById(userFolio.user)

  if (!user) {
    return res.status(400).json({
      status: false,
      error: 'No User Exits with this passport',
    })
  }

  for (var i = 0; i < statements.length; i++) {
    var type = statements[i].type
    var amount = statements[i].amount
    var date = statements[i].date
    var narration = statements[i].narration

    // var check = await isValid(type, amount, date, userFolio)

    // if (!check.valid)
    //   return res.status(400).json({ status: false, error: check.error })

    var Amount = type == '3' ? -1 * parseFloat(amount) : parseFloat(amount)

    if (type == '2') userFolio.yieldAmount += Amount
    userFolio.contribution += Amount
    userFolio.lastTransactionDate = new Date(date)

    const newFolioTransaction = await FolioTransactions.create({
      user: user._id,
      folio: userFolio._id,
      addedBy: req.user._id,
      type: type,
      amount: Amount,
      date: new Date(
        new Date(date).setHours(
          new Date().getHours(),
          new Date().getMinutes(),
          new Date().getSeconds()
        )
      ),
      narration: narration,
    })
    // console.log('Transaction added ', newFolioTransaction)
  }

  await userFolio.save()

  return res
    .status(200)
    .json({ status: true, data: userFolio, message: 'All Transaction added' })
}

exports.editTransaction = async (req, res) => {}

exports.getTransactionsPDF = async (req, res) => {
  const { folioNumber } = req.body

  const user = await Users.findById(req.user._id)

  const userFolio = await Folios.findOne({
    folioNumber: folioNumber.toUpperCase(),
  })

  const transaction = await FolioTransactions.find({ folio: userFolio._id })

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

  const pdffile = await transactionReport(user, transaction, userFolio)

  var data = pdffile
  res.contentType('application/pdf')
  res.send(data)
}

exports.getTransactionsPDFAdmin = async (req, res) => {
  const { folioNumber } = req.body

  const userFolio = await Folios.findOne({
    folioNumber: folioNumber.toUpperCase(),
  })

  const user = await Users.findById(userFolio.user)

  const transaction = await FolioTransactions.find({ folio: userFolio._id })

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

  const pdffile = await transactionReport(user, transaction, userFolio)

  var data = pdffile
  res.contentType('application/pdf')
  res.send(data)
}

exports.getTransactionsPDF2 = async (req, res) => {
  const folioId = '618a4a03537eb2a3707aaf45'
  const userId = '617bec3aa1cb758124df9741'
  0

  const user = await Users.findById(userId)

  const userFolio = await Folios.findById(folioId)

  const transaction = await FolioTransactions.find({ folio: folioId })

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

  const pdffile = await transactionReport(user, transaction, userFolio)

  var data = pdffile
  res.contentType('application/pdf')
  res.send(data)
}
