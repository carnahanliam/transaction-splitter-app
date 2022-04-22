const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema(
  {
    title: String,
    total: Number,
    date: { type: Date, default: Date.now },
    comments: String,
    userSplits: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        percent: Number,
        payer: Boolean,
        _id: false,
      },
    ],
  },
  {
    toJSON: {
      transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
      },
    },
  }
)

module.exports = mongoose.model('Transaction', transactionSchema)
