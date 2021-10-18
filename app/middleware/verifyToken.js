const jwt = require('jsonwebtoken')
const Users = require('../modals/user.modals')

require('dotenv').config()

const verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token']

  if (!token) {
    return res.status(403).send({
      message: 'No token provided!',
    })
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized!',
      })
    }
    req.user = decoded.user

    // console.log(req.user)
    next()
  })
}

module.exports.verifyToken = verifyToken
