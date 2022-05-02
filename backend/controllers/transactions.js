const transactionsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Transaction = require('../models/transaction')
const User = require('../models/user')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

transactionsRouter.get('/', async (request, response) => {
  const transactions = await Transaction.find({}).populate('userSplits.user', {
    name: 1,
    username: 1,
    picture: 1,
  })

  response.json(transactions)
})

transactionsRouter.post('/', async (request, response) => {
  const body = request.body

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
      } catch (err) {
        throw err
      }
    })
  )

  const savedPopulatedTransaction = await Transaction.findOne({
    _id: savedTransaction._id,
  }).populate('userSplits.user', { name: 1, picture: 1 })

  response.json(savedPopulatedTransaction)
})

transactionsRouter.get('/:id', async (request, response) => {
  const transaction = await Transaction.findById(request.params.id)
  if (transaction) {
    const populatedTransaction = await Transaction.findOne({
      _id: transaction._id,
    }).populate('userSplits.user', { name: 1, picture: 1 })
    response.json(populatedTransaction)
  } else {
    response.status(404).end()
  }
})

transactionsRouter.delete('/', async (request, response) => {
  await Transaction.deleteMany({})
  return response.status(204).end()
})

module.exports = transactionsRouter
