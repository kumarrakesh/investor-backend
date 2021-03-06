const jwt = require('jsonwebtoken')
var mongoose = require('mongoose')
const bycryptjs = require('bcryptjs')
const Users = require('../modals/user.modals')
const Funds = require('../modals/funds.modals')
const UserFunds = require('../modals/userFunds.modals')
const Transactions = require('../modals/transaction.modals')
const AWS = require('../utils/aws')
const Folios = require('../modals/folio.modals')
const Roles = require('../modals/roles.modals')
require('dotenv').config()

exports.getSignIn = async (req, res) => {
  const user = await Users.findOne({
    username: req.body.username.toLowerCase(),
  }).populate('role')

  if (!user) {
    return res.status(404).json({ status: false, error: 'User not found' })
  }

  var match = bycryptjs.compareSync(req.body.password, user.password)

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
    return res.json({ status: true, token: token, role: user.role.role })
  }
  return res
    .status(200)
    .json({ status: false, error: 'Invalid Username and password ' })
}

exports.getProfilePic = async (req, res) => {
  const key = req.params.key

  if (key == undefined || key == null) {
    return res.send('error')
  }

  if (!key) {
    res.send('key required')
  }
  AWS.readImage(key, res)
}

exports.addUser = async (req, res) => {
  try {
    var {
      name,
      password,
      passport,
      maturity,
      address,
      city,
      state,
      country,
      pincode,
      role,
      phoneNo,
      email,
    } = req.body

    req.body.password = await bycryptjs.hash(password, 12)

    var role_ID = await Roles.findOne({ role: 'USER' })

    req.body.role = role_ID._id

    const searchuser = await Users.findOne({ username: passport.toLowerCase() })

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

    const usersCount = await Users.count()

    req.body.userId = usersCount + 1

    req.body.username = passport.toLowerCase()

    req.body.passport = passport.toLowerCase()

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

exports.updateProfile = async (req, res) => {
  const {
    name,
    passport,
    maturity,
    address,
    city,
    state,
    country,
    pincode,
    password,
    email,
    phoneNo,
  } = req.body

  var user = await Users.findById(req.user._id)

  user.name = name
  user.passport = passport
  user.maturity = maturity
  user.address = address
  user.city = city
  user.state = state
  user.country = country
  user.pincode = pincode
  user.email = email
  user.phoneNo = phoneNo

  if (password) {
    user.password = await bycryptjs.hash(password, 12)
  }

  if (req.file) {
    const profilePic = await AWS.uploadImage(req)
    user.profilePic = profilePic
  }

  await user.save()

  return res.status(200).json({
    success: true,
    data: user,
  })
}

exports.updateProfileAdmin = async (req, res) => {
  var {
    userId,
    name,
    passport,
    maturity,
    address,
    city,
    state,
    country,
    pincode,
    password,
    phoneNo,
    email,
  } = req.body

  var user = await Users.findById(userId)

  var searchuser = null

  if (user.username != passport) {
    searchuser = await Users.findOne({ username: passport.toLowerCase() })
  }

  if (searchuser) {
    return res.status(400).json({
      success: false,
      error: 'User is already registered with this passport',
    })
  }

  user.name = name
  user.username = passport.toLowerCase()
  user.passport = passport.toLowerCase()
  user.maturity = maturity
  user.address = address
  user.city = city
  user.state = state
  user.country = country
  user.pincode = pincode
  user.phoneNo = phoneNo
  user.email = email

  if (password) {
    user.password = await bycryptjs.hash(password, 12)
  }

  if (req.file) {
    const profilePic = await AWS.uploadImage(req)
    user.profilePic = profilePic
  }

  await user.save()

  return res.status(200).json({
    success: true,
    data: user,
  })
}

exports.allUsers = async (req, res) => {
  const role_ID = await Roles.findOne({ role: 'USER' })

  const users = await Users.find({ role: role_ID._id }) //Only Users Not Admin

  var usersData = JSON.parse(JSON.stringify(users))

  var usersTotalInvested = await UserFunds.aggregate([
    { $match: { _id: { $exists: true } } },
    {
      $group: {
        _id: '$user',
        totalInvested: {
          $sum: '$totalInvested',
        },
        totalUnits: {
          $sum: '$totalUnits',
        },
      },
    },
  ])

  for (var i = 0; i < usersData.length; i++) {
    var timestamp = usersData[i]._id.toString().substring(0, 8)

    var date = new Date(parseInt(timestamp, 16) * 1000)

    usersData[i].dateOfCreation = usersData[i]?.maturity

    var userData = usersTotalInvested.filter(
      (ele) => ele._id == usersData[i]._id
    )[0]

    var userFunds = await UserFunds.find({ user: usersData[i]._id }).select(
      'fundname totalUnits'
    )

    var currentValue = 0

    for (var j = 0; j < userFunds.length; j++) {
      var fund = await Funds.findOne({ fundname: userFunds[j].fundname })

      currentValue += userFunds[j].totalUnits * fund.nav
    }

    usersData[i].totalInvested = userData?.totalInvested || 0
    usersData[i].currentValue = currentValue
  }

  usersData.sort(function (a, b) {
    var keyA = new Date(a.dateOfCreation).getTime(),
      keyB = new Date(b.dateOfCreation).getTime()
    if (keyA < keyB) return 1
    if (keyA > keyB) return -1
    return 0
  })

  return res.status(200).json({
    success: true,
    data: usersData,
  })
}

exports.allUsersNew = async (req, res) => {
  const role_ID = await Roles.findOne({ role: 'USER' })

  const users = await Users.find({ role: role_ID._id }) //Only Users Not Admin

  var usersData = JSON.parse(JSON.stringify(users))

  var usersTotalInvested = await Folios.aggregate([
    { $match: { _id: { $exists: true } } },
    {
      $group: {
        _id: '$user',
        totalCommited: {
          $sum: '$commitment',
        },
        totalContributed: {
          $sum: '$contribution',
        },
      },
    },
  ])

  for (var i = 0; i < usersData.length; i++) {
    usersData[i].dateOfCreation = usersData[i]?.maturity
    var userData = usersTotalInvested.filter(
      (ele) => ele._id == usersData[i]._id
    )[0]

    usersData[i].totalContributed = userData?.totalContributed || 0
    usersData[i].totalCommited = userData?.totalCommited || 0
  }

  usersData.sort(function (a, b) {
    var keyA = new Date(a.dateOfCreation).getTime(),
      keyB = new Date(b.dateOfCreation).getTime()
    if (keyA < keyB) return 1
    if (keyA > keyB) return -1
    return 0
  })

  return res.status(200).json({
    success: true,
    data: usersData,
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

exports.getProfile = async (req, res) => {
  const userId = req.user._id

  var usersTotalInvested = await Folios.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalCommited: {
          $sum: '$commitment',
        },
        totalContribution: {
          $sum: '$contribution',
        },
      },
    },
  ])

  return res.status(200).json({
    status: true,
    data: req.user,
    AmountCommited: usersTotalInvested[0]?.totalCommited || 0,
    AmountContributed: usersTotalInvested[0]?.totalContribution || 0,
  })
}

exports.newUserId = async (req, res) => {
  const newID = await Users.count()
  return res.status(404).json({
    success: true,
    userId: newID + 1,
  })
}

exports.getDashboard = async (req, res) => {
  var { year } = req.body

  if (!year) {
    year = new Date().getFullYear()
  }

  console.log('Year', year)

  const userId = req.user._id

  //  const transaction = await Transactions.find({ user: userId })

  // const transaction = await Transactions.find({
  //   $where: `this.date.getFullYear() <= ${year}`,
  // })

  // const transaction = await Transactions.find({
  //   $expr: { $lte: [{ $year: '$date' }, year] },
  // })

  // { year: { $year : "$accessDate" }, month: { $month : "$accessDate" }

  var response = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]

  for (var i = 0; i <= 11; i++) {
    var lastDate = new Date(year, i + 1, 0)
    var transaction = await Transactions.aggregate([
      {
        $match: {
          // $expr: {
          //   $and: [
          //     { $lte: [{ $year: '$date' }, year] },
          //     { $lte: [{ $month: '$date' }, i + 1] },
          //   ],
          // },
          date: { $lte: lastDate },
          user: mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: '$fundname',
          investedAmount: {
            $sum: '$investedAmount',
          },
          units: {
            $sum: '$units',
          },
        },
      },
    ])
    // console.log(i + 1, transaction)
    response[i].investedAmount = 0
    response[i].currentAmount = 0
    // response[i].month = i + 1
    for (var j = 0; j < transaction.length; j++) {
      var fundname = transaction[j]._id

      var fund = await Funds.findOne({
        fundname: fundname,
      })

      var lastestFund = fund.history.filter((history) => {
        return history.date.getTime() <= new Date(year, i + 1, 0).getTime()
      })

      lastestFund.sort(function (a, b) {
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

      response[i].investedAmount += transaction[j].investedAmount
      response[i].currentAmount +=
        transaction[j].units * (lastestFund[0]?.nav || 0)
    }
  }
  return res.json({ status: true, data: response })
}

exports.getUsername = async (req, res) => {
  var { passport } = req.body

  if (!passport) {
    return res.status(404).json({
      success: false,
      error: 'passport required',
    })
  }

  const user = await Users.findOne({ username: passport.toLowerCase() })

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'No User Exists',
    })
  }

  return res.status(200).json({
    success: false,
    name: user.name,
  })
}

exports.searchUserBypassport = async (req, res) => {
  var { passport } = req.body

  if (!passport) {
    return res.status(404).json({
      success: false,
      error: 'passport required',
    })
  }

  const user = await Users.findOne({ username: passport.toLowerCase() })

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'No User Exists',
    })
  }

  return res.status(200).json({
    success: true,
    user: user,
  })
}
