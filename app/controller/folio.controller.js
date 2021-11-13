const Folios = require('../modals/folio.modals')
const FolioNewId = require('../modals/folioId.modals')
const Users = require('../modals/user.modals')

exports.addFolio = async (req, res) => {
  const { userId, commitment, yield, date, folioName } = req.body

  var FolioDB = await FolioNewId.find({})

  // console.log(FolioDB)

  const user = await Users.findOne({ username: userId.toLowerCase() })

  if (!user) {
    return res
      .status(400)
      .json({ status: false, error: 'No User with this passport exists' })
  }

  var newFolioId = 0

  if (FolioDB.length == 0) {
    newFolioId = 1
    const addFolioNewId = await FolioNewId.create({
      folioId: 1,
    })
  } else {
    FolioDB[0].folioId += 1
    await FolioDB[0].save()
    newFolioId = FolioDB[0].folioId
  }

  const newFolio = await Folios.create({
    folioName: folioName,
    folioId: newFolioId,
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
  const userFolio = await Folios.find({ user: req.user._id })

  userFolio.sort(function (a, b) {
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

  return res.status(200).json({ status: true, data: userFolio })
}
exports.getAllFolio = async (req, res) => {
  const allFolio = await Folios.find({}).populate('user')

  allFolio.sort(function (a, b) {
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

  return res.status(200).json({ status: true, data: allFolio })
}
exports.getFolioInfo = async (req, res) => {
  const { folioId } = req.body

  const folio = await Folios.findOne({ folioId }).populate('user')

  return res.status(200).json({ status: true, data: folio })
}

exports.getNewFolioID = async (req, res) => {
  const fundNewId = await FolioNewId.find({})

  console.log(fundNewId)
  return res
    .status(200)
    .json({ status: true, newFolioId: fundNewId[0]?.folioId || 0 })
}

exports.deleteFolio = async (req, res) => {
  const { folioId } = req.body

  const deleteFolio = await Folios.remove({ _id: folioId })

  return res.status(200).json({ status: true, message: 'Deleted Succesfully' })
}
