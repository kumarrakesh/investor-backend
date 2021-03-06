const Folios = require('../modals/folio.modals')

const FolioTransactions = require('../modals/folioTransaction.modals')

const Users = require('../modals/user.modals')

const Configs = require('../modals/config.modals')

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

  if (!folioNumber)
    return res.status(400).json({ status: false, error: 'Folio Number needed' })

  const folio = await Folios.findOne({ folioNumber: folioNumber })

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

  var editTransaction = JSON.parse(JSON.stringify(transactions))

  if(editTransaction.length > 0 ) {
    editTransaction[0].canInvalidate = true
  }


  return res.status(200).json({ status: true, data: editTransaction })
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

    if (type == '1') {
      //CONTRIBUTION
      userFolio.contribution += Amount
    } else if (type == '2') {
      // YEILD PAYMENT
      userFolio.yieldAmount += Amount
    } else {
      // REDEMPTION AMOUNT
      userFolio.redemptionAmount += -1 * Amount
    }

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
      status: 'VALID',
      editHistory: [],
    })
  }

  await userFolio.save()

  return res
    .status(200)
    .json({ status: true, data: userFolio, message: 'All Transaction added' })
}

exports.invalidateTransaction = async (req, res) => {
  try {
    const { transactionId } = req.body

    const transaction = await FolioTransactions.findById(transactionId).sort({
      'editHistory.sno': 1,
    })

    var oldTransaction =
      transaction.editHistory.length == 0
        ? { type: transaction.type, amount: transaction.amount }
        : transaction.editHistory[transaction.editHistory.length - 1]

    const userFolio = await Folios.findById(transaction.folio)

    const oldType = oldTransaction.type

    const oldAmount = oldTransaction.amount

    // REMOVING OLD
    if (oldType == '1') {
      userFolio.contribution -= oldAmount
    } else if (oldType == '2') {
      userFolio.yieldAmount -= oldAmount
    } else {
      var positiveAmount = -1 * oldAmount
      userFolio.redemptionAmount -= positiveAmount
    }

    transaction.status = 'INVALID'

    await transaction.save()
    await userFolio.save()

    return res
      .status(200)
      .json({ status: true, data: transaction, message: 'Done' })
  } catch (err) {
    console.log(err)
    return res
      .status(400)
      .json({ status: false, error: 'Something went wrong' })
  }
}
exports.editTransaction = async (req, res) => {
  const { transactionId, type, amount, narration, date } = req.body

  const transaction = await FolioTransactions.findById(transactionId).sort({
    'editHistory.sno': 1,
  })

  var oldTransaction =
    transaction.editHistory.length == 0
      ? { type: transaction.type, amount: transaction.amount }
      : transaction.editHistory[transaction.editHistory.length - 1]

  const userFolio = await Folios.findById(transaction.folio)

  const oldType = oldTransaction.type

  const oldAmount = oldTransaction.amount

  // REMOVING OLD
  if (oldType == '1') {
    userFolio.contribution -= oldAmount
  } else if (oldType == '2') {
    userFolio.yieldAmount -= oldAmount
  } else {
    var positiveAmount = -1 * oldAmount
    userFolio.redemptionAmount -= positiveAmount
  }

  var newAmount = type == '3' ? -1 * parseFloat(amount) : parseFloat(amount)

  //ADDING NEW
  if (type == '1') {
    userFolio.contribution += newAmount
  } else if (type == '2') {
    userFolio.yieldAmount += newAmount
  } else {
    var positiveAmount = -1 * newAmount
    userFolio.redemptionAmount += positiveAmount
  }

  const oldEditHistoryLength = transaction.editHistory.length

  transaction.editHistory.push({
    type: type,
    amount: newAmount,
    narration: narration,
    date: new Date(
      new Date(date).setHours(
        new Date().getHours(),
        new Date().getMinutes(),
        new Date().getSeconds()
      )
    ),
    sno: oldEditHistoryLength + 1,
  })

  await transaction.save()
  await userFolio.save()

  return res
    .status(200)
    .json({ status: true, data: transaction, message: 'New Edit Added' })
}

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

  const transaction = await FolioTransactions.find(
  {
    //Query: where folio matches userFolio.id and
    //status is either missing or if present is VALID
    //TODO: instead of 'or' query for missing column, consider cleaning the data for missing 'status' column
    $and:
        [{folio: userFolio._id},
          {$or: [{status: { $exists: false }}, {status: 'VALID' } ]}]
  })

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
// FOR TESTING

exports.getTransactionsPDF2 = async (req, res) => {
  try {
    const folioNumber = 'FOLIO30DEC'

    const config = await Configs.find({})

    console.log(config)

    const userFolio = await Folios.findOne({
      folioNumber: folioNumber.toUpperCase(),
    })

    const user = await Users.findById(userFolio.user)

    const transaction = await FolioTransactions.find({
      folio: userFolio._id,
      status: 'VALID',
    })

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
