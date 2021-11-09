const Folios = require('../modals/folio.modals')
const FolioNewId = require('../modals/folioId.modals')

exports.addFolio = async (req, res) => {
  const { userId, commitment, yield } = req.body

  var FolioDB = await FolioNewId.find({})

  // console.log(FolioDB)

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
    folioId: newFolioId,
    user: userId,
    commitment: commitment,
    contribution: 0,
    yield: yield,
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

  return res.status(200).json({ status: true, data: userFolio })
}
exports.getAllFolio = async (req, res) => {
  const allFolio = await Folios.find({}).populate('user')

  return res.status(200).json({ status: true, data: allFolio })
}
exports.getFolioInfo = async (req, res) => {
  const { folioId } = req.body

  const folio = await Folios.findById(folioId).populate('user')

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
