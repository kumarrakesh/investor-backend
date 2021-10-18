const Querys = require('../modals/query.modals')

exports.deleteQuery = async (req, res) => {
  const queryId = req.params.id

  if (!queryId) {
    return res
      .status(400)
      .json({ status: false, error: 'Query ID is required' })
  }

  const removeQuery = await Querys.remove({ _id: queryId })

  return res
    .status(200)
    .json({ status: true, message: 'Query deleted Succesfully' })
}

exports.getQueryofUser = async (req, res) => {
  const userId = req.user._id

  const querys = await Querys.find({ user: userId })

  return res.status(200).json({ status: true, data: querys })
}

exports.getQuery = async (req, res) => {
  const querys = await Querys.find({})

  return res.status(200).json({ status: true, data: querys })
}

exports.addQuery = async (req, res) => {
  const { subject, description, date } = req.body

  if (!subject || !description || !date) {
    return res
      .status(400)
      .json({ status: false, error: 'All fields are required' })
  }

  const newQuery = await Querys.create({
    subject: subject,
    description: description,
    date: new Date(date),
    isResolved: false,
    user: req.user._id,
  })

  return res.status(200).json({ status: true, data: newQuery })
}

exports.updateQuery = async (req, res) => {
  const { queryId, subject, description, isResolved } = req.body

  const query = await Querys.findById(queryId)

  query.subject = subject ? subject : query.subject
  query.description = description ? description : query.description
  query.isResolved = isResolved

  await query.save()

  return res.status(200).json({ status: true, data: query })
}
