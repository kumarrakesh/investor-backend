const jwt = require('jsonwebtoken')
require('dotenv').config()
const bycryptjs = require('bcrypt')

const Users = require('../modals/user.modals')
const AWS = require('../utils/aws')

const { validateEmail } = require('../utils/validate')

exports.getSignIn = async (req, res) => {
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
          user: user,
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

exports.getProfilePic = async (req, res) => {
  const key = req.params.key

  if (!key) {
    res.send('key required')
  }
  AWS.readImage(key, res)
}

exports.addUser = async (req, res) => {
  try {
    const {
      name,
      username,
      password,
      passport,
      maturity,
      address,
      city,
      state,
      country,
      pincode,
      role,
    } = req.body

    req.body.password = await bycryptjs.hash(password, 12)

    if (!validateEmail(username)) {
      return res.status(404).json({
        success: false,
        error: 'Username is not valid Use email format',
      })
    }

    const searchuser = await Users.findOne({ username: username })

    if (searchuser) {
      return res.status(400).json({
        success: false,
        error: 'User is already registered',
      })
    }

    if (req.file) {
      const profilePic = await AWS.uploadImage(req)
      req.body.profilePic = profilePic
    }

    const user = await Users.create(req.body)

    return res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.log(error)
    return res.status(404).json({
      success: false,
      error: 'Something went wrong',
    })
  }
}

exports.allUsers = async (req, res) => {
  const users = await Users.find()
    .select(
      'username _id name city state country profilePic address passport maturity role'
    )
    .populate('role')

  return res.status(200).json({
    success: true,
    data: users,
  })
}

exports.deleteUser = async (req, res) => {
  const db_ID = req.params.id

  if (!db_ID) {
    return res.status(404).json({
      success: true,
      data: 'DB ID is required as a params',
    })
  }

  const user = await Users.remove({ _id: db_ID })

  return res.status(404).json({
    success: true,
    data: 'Deleted Succesfully',
  })
}
