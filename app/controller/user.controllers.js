const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const bycryptjs = require('bcrypt')

const Users = require('../modals/user.modals')

exports.getSign = async (req, res, next) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.json({ error: 'Both Username and password required' })
    }

    const user = await Users.findOne({ username })

    if (!user) {
      return res.status(404).json({ status: false, error: 'User not found' })
    }
    const match = await bycryptjs.compare(password, user.password)
    if (match) {
      const token = jwt.sign(
        {
          name: user.name,
          username: user.username,
          id: user._id,
          role: 'user',
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: '30d',
        }
      )
      return res.status(200).json({ status: true, token: token })
    }
    return res
      .status(200)
      .json({ status: false, error: 'Invalid Username and password ' })
  } catch {
    return res
      .status(404)
      .json({ status: false, error: 'Something went wrong' })
  }
}
