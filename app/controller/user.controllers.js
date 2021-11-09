const jwt = require('jsonwebtoken')
require('dotenv').config()
var mongoose = require('mongoose')
const bycryptjs = require('bcrypt')

const Users = require('../modals/user.modals')
const Roles = require('../modals/roles.modals')
const Funds = require('../modals/funds.modals')
const UserFunds = require('../modals/userFunds.modals')
const Transactions = require('../modals/transaction.modals')

const AWS = require('../utils/aws')

const { validateEmail } = require('../utils/validate')
const Folios = require('../modals/folio.modals')

exports.getSignIn = async (req, res) => {
  try {
    var { username, password } = req.body

    if (!username || !password) {
      return res.json({ error: 'Both Username and password required' })
    }

    username = username.toLowerCase()

    // console.log(username)

    const user = await Users.findOne({ username })

    // console.log(user)

    if (!user) {
      return res.status(404).json({ status: false, error: 'User not found' })
    }

    const role = await Roles.findById(user.role)

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
      return res
        .status(200)
        .json({ status: true, token: token, role: role.role })
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

    // console.log(req.body)
    req.body.password = await bycryptjs.hash(password, 12)

    req.body.role = '616d2f588d908648c28d63a1'

    // if (!validateEmail(username)) {
    //   return res.status(404).json({
    //     success: false,
    //     error: 'Username is not valid Use email format',
    //   })
    // }

    username = username.toLowerCase()

    const searchuser = await Users.findOne({ username: username })

    if (searchuser) {
      return res.status(400).json({
        success: false,
        error: 'User is already registered',
      })
    }
    // console.log(req.file)
    if (req.file) {
      const profilePic = await AWS.uploadImage(req)
      req.body.profilePic = profilePic
    }
    const usersCount = await Users.count()

    req.body.userId = usersCount + 1

    req.body.username = username.toLowerCase()

    const user = await Users.create(req.body)

    console.log(user)

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
  } = req.body

  console.log(req.body)

  var user = await Users.findById(req.user._id)

  console.log(user)

  user.name = name
  user.passport = passport
  user.maturity = maturity
  user.address = address
  user.city = city
  user.state = state
  user.country = country
  user.pincode = pincode

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
  const {
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
  } = req.body

  var user = await Users.findById(userId)

  console.log(user)

  user.name = name
  user.passport = passport
  user.maturity = maturity
  user.address = address
  user.city = city
  user.state = state
  user.country = country
  user.pincode = pincode

  if (password) {
    user.password = await bycryptjs.hash(password, 12)
  }

  if (req.file) {
    const profilePic = await AWS.uploadImage(req)
    user.profilePic = profilePic
  }

  await user.save()

  // console.log(user)

  return res.status(200).json({
    success: true,
    data: user,
  })
}

exports.allUsers = async (req, res) => {
  const users = await Users.find({ role: '616d2f588d908648c28d63a1' }) //Only Users Not Admin

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

  // console.log(usersTotalInvested)

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
      // console.log(userFunds[j].totalUnits * fund.nav)
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
  const users = await Users.find({ role: '616d2f588d908648c28d63a1' }) //Only Users Not Admin

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

  console.log(usersTotalInvested)

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

  const user = await Users.findById(userId)

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

  //console.log(usersTotalInvested)

  return res.status(200).json({
    status: true,
    data: user,
    AmountCommited: usersTotalInvested[0]?.totalCommited || 0,
    AmountContributed: usersTotalInvested[0]?.totalInvested || 0,
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
