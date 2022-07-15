const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const multer = require('multer')
const fs = require('fs').promises
const { uploadFile, getFileStream } = require('../utils/S3')

const storage = multer.diskStorage({
  destination: (request, file, next) => {
    next(null, 'uploads')
  },
  filename: (request, file, next) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    next(null, uniqueSuffix + '-' + file.originalname)
  },
})

const upload = multer({ storage: storage })

usersRouter.get('/', async (request, response) => {
  try {
    const users = await User.find({})
      .populate('friends', {
        name: 1,
        username: 1,
        picture: 1,
      })
      .populate({
        path: 'transactions',
        populate: { path: 'userSplits.user', select: 'name picture' },
      })
    response.json(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    const usernameTaken = await User.findOne({ username: body.username })
    if (usernameTaken) {
      response.status(400).json({
        error: 'This username is not available',
      })
    }

    if (body.password.length < 8) {
      return response.status(400).json({
        error: 'Password must be at least 8 characters',
      })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      name: body.name,
      username: body.username,
      passwordHash,
      picture: null,
    })

    const savedUser = await user.save()
    response.json(savedUser)
  } catch (error) {
    next(error)
  }
})

usersRouter.get('/uploads/:key', (request, response) => {
  try {
    const key = request.params.key
    const readStream = getFileStream(key)

    readStream.pipe(response)
  } catch (error) {
    next(error)
  }
})

usersRouter.post(
  '/update-profile/',
  upload.single('avatar'),
  async (request, response, next) => {
    try {
      const id = request.body.currentUserId
      const file = request.file
      const result = await uploadFile(file)
      const newAvatar = 'api/users/uploads/' + result.Key

      const userToUpdate = await User.findOne({ _id: id })

      const updatedUser = {
        picture: newAvatar ? newAvatar : userToUpdate.picture,
      }

      const savedUpdatedUser = await User.findByIdAndUpdate(id, updatedUser, {
        new: true,
      })

      response.json(savedUpdatedUser)
    } catch (error) {
      next(error)
    }
  }
)

usersRouter.put('/:id', async (request, response) => {
  try {
    const body = request.body

    const userToUpdate = await User.findOne({ username: body.username })

    const friends = body.friends.map((f) => f.userId)
    const updatedFriends = userToUpdate.friends.concat(friends)

    const user = {
      friends: updatedFriends,
    }

    const updatedUser = await User.findByIdAndUpdate(request.params.id, user, {
      new: true,
    }).populate('friends', { name: 1, username: 1, picture: 1 })

    await Promise.all(
      friends.map(async (f) => {
        try {
          const friend = await User.findById(f)
          friend.friends = friend.friends.concat(updatedUser._id)
          await friend.save()
        } catch (err) {
          next(error)
        }
      })
    )

    response.json(updatedUser)
  } catch (error) {
    next(error)
  }
})

usersRouter.get('/:id', async (request, response) => {
  try {
    const user = await User.findById(request.params.id)
    if (user) {
      const populatedUser = await User.findOne({ _id: user._id }).populate({
        path: 'transactions',
        populate: { path: 'userSplits.user', select: 'name picture' },
      })
      response.json(populatedUser)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter
