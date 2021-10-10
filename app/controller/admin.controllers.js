const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const bycryptjs = require('bcrypt')

const Users = require('../modals/user.modals')

//  CONTROLLER TO ADD USER BY THE ADMIN

exports.addUser = async (req, res, next) => {
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
    } = req.body

    req.body.password = await bycryptjs.hash(password, 12)

    const user = await Users.create(req.body)

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'USER NOT FOUND',
      })
    }

    return res.status(200).json({
      success: true,
      data: user,
    })
  } catch {
    return res.status(404).json({
      success: false,
      error: 'Something went wrong',
    })
  }
}

exports.allUsers = async (req, res) => {
  const users = await Users.find()

  return res.status(404).json({
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
