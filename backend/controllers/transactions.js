const transactionsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Transaction = require('../models/transaction')
const User = require('../models/user')
const { getTokenFrom } = require('../utils/authHelper')

transactionsRouter.get('/', async (request, response) => {
  try {
    const transactions = await Transaction.find({}).populate(
      'userSplits.user',
      {
        name: 1,
        username: 1,
        picture: 1,
      }
    )

    response.json(transactions)
  } catch (error) {
    next(error)
  }
})

// only logged-in users can post new transactions
transactionsRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body
    const token = getTokenFrom(request)
    if (!token) {
      return next()
    }

    const decodedToken = jwt.verify(
      token,
      process.env.SECRET,
      (error, decoded) => {
        if (error) {
          return next(error)
        }
        return decoded.id
      }
    )

    if (!decodedToken) {
      return next()
    }

    const user = await User.findById(decodedToken)
    if (!user) {
      throw new Error('There is no user associated with the provided token')
    }

    const users = body.userSplits.map((u) => {
      u.user = u.userId
      delete u['userId']
      return u
    })

    const transaction = new Transaction({
      title: body.title,
      total: body.total,
      comments: body.comments,
      userSplits: users,
    })

    const savedTransaction = await transaction.save()

    await Promise.all(
      body.userSplits.map(async (u) => {
        try {
          const user = await User.findById(u.user)
          user.transactions = user.transactions.concat(savedTransaction._id)
          await user.save()
        } catch (error) {
          next(error)
        }
      })
    )

    const savedPopulatedTransaction = await Transaction.findOne({
      _id: savedTransaction._id,
    }).populate('userSplits.user', { name: 1, picture: 1 })

    response.json(savedPopulatedTransaction)
  } catch (error) {
    next(error)
  }
})

transactionsRouter.get('/:id', async (request, response) => {
  try {
    const transaction = await Transaction.findById(request.params.id)
    if (transaction) {
      const populatedTransaction = await Transaction.findOne({
        _id: transaction._id,
      }).populate('userSplits.user', { name: 1, picture: 1 })
      response.json(populatedTransaction)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

transactionsRouter.delete('/', async (request, response) => {
  try {
    await Transaction.deleteMany({})
    return response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = transactionsRouter
