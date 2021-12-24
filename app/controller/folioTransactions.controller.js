const Folios = require('../modals/folio.modals')

const FolioTransactions = require('../modals/folioTransaction.modals')

const Users = require('../modals/user.modals')

const Configs = require('../modals/config.modals')

const { transactionReport } = require('../transactionPdf/transactionReport')

const createConfig = async () => {
  const isPresent = await Configs.count({})
  if (!isPresent) {
    const addConfig = await Configs.create({})
    console.log('Default Confg added', addConfig)
  } else {
    console.log('Configration present')
  }
}

createConfig()

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

    if (type == '2') {
      userFolio.yieldAmount += Amount
    } else if (type == '1') {
      userFolio.contribution += Amount
    } else {
      userFolio.redemptionAmount += -1 * Amount
    }

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
  }

  await userFolio.save()

  return res
    .status(200)
    .json({ status: true, data: userFolio, message: 'All Transaction added' })
}

exports.editTransaction = async (req, res) => {}

exports.getTransactionsPDF = async (req, res) => {
  const { folioNumber } = req.body

  if (!folioNumber) {
    return res.send('error')
  }

  const userFolio = await Folios.findOne({
    folioNumber: folioNumber.toUpperCase(),
  })

  if (!userFolio) {
    return res.send('error')
  }

  const config = await Configs.find({})

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

  const pdffile = await transactionReport(
    user,
    transaction,
    userFolio,
    config[0]
  )

  var data = pdffile
  res.contentType('application/pdf')
  res.send(data)
}

exports.getTransactionsPDFAdmin = async (req, res) => {
  const { folioNumber } = req.body

  if (!folioNumber) {
    return res.send('error')
  }

  const userFolio = await Folios.findOne({
    folioNumber: folioNumber.toUpperCase(),
  })

  if (!userFolio) {
    return res.send('error')
  }

  const config = await Configs.find({})

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

  const pdffile = await transactionReport(
    user,
    transaction,
    userFolio,
    config[0]
  )

  var data = pdffile
  res.contentType('application/pdf')
  res.send(data)
}

exports.getTransactionsPDF2 = async (req, res) => {
  try {
    const folioNumber = 'FOLIO24NOV'

    const config = await Configs.find({})

    console.log(config)

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

    const pdffile = await transactionReport(
      user,
      transaction,
      userFolio,
      config[0]
    )

    var data = pdffile
    res.contentType('application/pdf')
    res.send(data)
  } catch (err) {
    console.log(err)
    res.send('error')
  }
}
