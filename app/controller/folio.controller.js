const Folios = require('../modals/folio.modals')
const FolioTransactions = require('../modals/folioTransaction.modals')
const Users = require('../modals/user.modals')

const validateFolioNumber = (folioNumber, res) => {
  var regex = '^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]+$'
  if (!regex.test(folioNumber)) {
    return res.status(400).json({ error: 'Folio Number is Not alpha numeric' })
  }
}

exports.addFolio = async (req, res) => {
  const { userId, commitment, yield, date, folioNumber } = req.body

  if (!folioNumber) {
    return res.status(400).json({ error: 'Folio Number is Required' })
  }

  const user = await Users.findOne({ username: userId.toLowerCase() })

  if (!user) {
    return res
      .status(400)
      .json({ status: false, error: 'No User with this passport exists' })
  }

  await validateFolioNumber(folioNumber, res)

  const folio = await Folios.findOne({ folioNumber: folioNumber.toUpperCase() })

  if (folio) {
    return res
      .status(400)
      .json({ status: false, error: 'FOLIO NAME IS NOT UNIQUE' })
  }

  const newFolio = await Folios.create({
    folioNumber: folioNumber.toUpperCase(),
    user: user._id,
    commitment: commitment,
    contribution: 0,
    yield: yield,
    date: new Date(new Date(date).setHours(0, 0, 0, 0)),
  })

  if (!newFolio) {
    return res
      .status(400)
      .json({ status: false, error: 'Error in creating Folio' })
  }

  return res
    .status(200)
    .json({ status: true, message: 'Folio Created', data: newFolio })
}

exports.editFolio = async (req, res) => {
  const { folioId, commitment, yield } = req.body

  const folio = await Folios.findById(folioId)

  folio.commitment = commitment
  folio.yield = yield

  await folio.save()

  return res.status(200).json({ status: true, data: folio })
}

exports.getUserFolio = async (req, res) => {
  // console.log(req.user)
  const userFolio = await Folios.find({ user: req.user._id }).sort({ date: -1 })

  return res.status(200).json({ status: true, data: userFolio })
}
exports.getAllFolio = async (req, res) => {
  const allFolio = await Folios.find({}).populate('user').sort({ date: -1 })

  return res.status(200).json({ status: true, data: allFolio })
}
exports.getFolioInfo = async (req, res) => {
  const { folioNumber } = req.body

  const folio = await Folios.findOne({ folioNumber }).populate('user')

  return res.status(200).json({ status: true, data: folio })
}

exports.getNewFolioID = async (req, res) => {
  res.send('Stopped')
  // const fundNewId = await FolioNewId.find({})

  // console.log(fundNewId)
  // return res
  //   .status(200)
  //   .json({ status: true, newFolioId: fundNewId[0]?.folioId || 0 })
}

exports.deleteFolio = async (req, res) => {
  const { folioNumber } = req.body

  const deleteFolio = await Folios.remove({ folioNumber: folioNumber })

  return res.status(200).json({ status: true, message: 'Deleted Succesfully' })
}
