const logger = require('./logger')
const jwt = require('jsonwebtoken')
const createError = require('http-errors')
const { getTokenFrom } = require('./authHelper')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:', request.path)
  logger.info('Body:', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  const statusCode = response.statusCode !== 200 ? response.statusCode : 500
  response.status(statusCode).json({
    message: error.message,
  })
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
}
