const Folios = require('../modals/folio.modals')
const Configs = require('../modals/config.modals')
const FolioTransactions = require('../modals/folioTransaction.modals')
const Users = require('../modals/user.modals')
const { validateFolioNumber } = require('../utils/validate')

exports.addFolio = async (req, res) => {
  try {
    const { userId, commitment, yield, date, folioNumber, currency } = req.body

    if (!folioNumber) {
      return res.status(400).json({ error: 'Folio Number is Required' })
    }

    const user = await Users.findOne({ username: userId.toLowerCase() })

    if (!user) {
      return res
        .status(400)
        .json({ status: false, error: 'No User with this passport exists' })
    }

    if (!validateFolioNumber(folioNumber, res)) {
      return res.status(400).json({
        status: false,
        error: 'Folio Number can be Alphanumeric,Numeric and Alphabets only',
      })
    }

    const folio = await Folios.findOne({
      folioNumber: folioNumber.toUpperCase(),
    })

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
      currency: currency,
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
  } catch (error) {
    return res.status(400).json({ status: true, error: 'Something went wrong' })
  }
}
exports.editFolio = async (req, res) => {
  try {
    //NOT REQUIRED FOR NOW

    const { folioId, commitment, yield } = req.body

    const folio = await Folios.findById(folioId)

    folio.commitment = commitment
    folio.yield = yield

    await folio.save()

    return res.status(200).json({ status: true, data: folio })
  } catch (error) {
    return res.status(400).json({ status: true, error: 'Something went wrong' })
  }
}

exports.getUserFolio = async (req, res) => {
  try {
    const userFolio = await Folios.find({ user: req.user._id }).sort({
      date: -1,
    })
    return res.status(200).json({ status: true, data: userFolio })
  } catch (error) {
    return res.status(400).json({ status: true, error: 'Something went wrong' })
  }
}
exports.getAllFolio = async (req, res) => {
  try {
    const allFolio = await Folios.find({}).populate('user').sort({ date: -1 })

    return res.status(200).json({ status: true, data: allFolio })
  } catch (error) {
    return res.status(400).json({ status: true, error: 'Something went wrong' })
  }
}
exports.getFolioInfo = async (req, res) => {
  try {
    const { folioNumber } = req.body

    const folio = await Folios.findOne({ folioNumber }).populate('user')

    return res.status(200).json({ status: true, data: folio })
  } catch (error) {
    return res.status(400).json({ status: true, error: 'Something went wrong' })
  }
}

exports.getNewFolioID = async (req, res) => {
  res.send('Stopped')
}

exports.deleteFolio = async (req, res) => {
  try {
    const { folioNumber } = req.body

    const deleteFolio = await Folios.remove({ folioNumber: folioNumber })

    return res
      .status(200)
      .json({ status: true, message: 'Deleted Succesfully' })
  } catch (error) {
    return res.status(400).json({ status: true, error: 'Something went wrong' })
  }
}

exports.avaliableCurrency = async (req, res) => {
  try {
    const config = await Configs.find({})

    return res.json({
      status: true,
      message: 'Avaliable Currency',
      data: config[0].currency,
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ status: true, error: 'Something went wrong' })
  }
}
