
const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  author: {
    name: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  title: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    enum: JSON.parse(process.env.TAGS)
  }],
  image: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Blog', Schema)
