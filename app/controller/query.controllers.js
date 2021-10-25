const Querys = require('../modals/query.modals')
const { sendQueryEmail } = require('../utils/email')
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
  const querys = await Querys.find({}).populate('user', 'name')

  return res.status(200).json({ status: true, data: querys })
}

exports.addQuery = async (req, res) => {
  const { subject, description, date } = req.body

  if (!subject || !description || !date) {
    return res
      .status(400)
      .json({ status: false, error: 'All fields are required' })
  }

  var querys = await Querys.count()

  const newQuery = await Querys.create({
    subject: subject,
    description: description,
    date: new Date(date),
    isResolved: false,
    queryId: querys + 1,
    user: req.user._id,
  })
  sendQueryEmail(newQuery, res)
}

exports.updateQuery = async (req, res) => {
  const { queryId, reply, isResolved } = req.body

  const query = await Querys.findById(queryId)

  if (!query) {
    return res.status(200).json({ status: false, error: 'Error in Updating' })
  }
  query.reply = reply
  query.isResolved = isResolved

  await query.save()

  return res.status(200).json({ status: true, data: query })
}

exports.newQueryID = async (req, res) => {
  const queryID = await Querys.count()
  return res.status(200).json({ status: true, queryId: queryID + 1 })
}
