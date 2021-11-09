const Folios = require('../modals/folio.modals')

exports.addFolio = async (req, res) => {
  const { userId, commitment, yield } = req.body

  const newFolioId = await Folios.count({})

  const newFolio = await Folios.create({
    folioId: newFolioId + 1,
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
    .json({ status: false, message: 'Folio Created', data: newFolio })
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
  const userFolio = await Folios.find({ user: req.user._id }).populate('user')

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
  const fundId = await Folios.count({})

  return res.status(200).json({ status: true, newFolioId: fundId + 1 })
}
