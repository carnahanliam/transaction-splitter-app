const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  try {
    const { username, password } = request.body

    const user = await User.findOne({ username })
      .populate('friends', {
        name: 1,
        username: 1,
        picture: 1,
      })
      .populate({
        path: 'transactions',
        populate: { path: 'userSplits.user', select: 'name picture' },
      })

    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      response.status(401).json({
        error: 'Invalid username or password',
      })
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    // token expires in 1800 seconds (30 minutes)
    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 1800,
    })

    response.status(200).send({ user, token })
  } catch (error) {
    next(error)
  }
})

module.exports = loginRouter
