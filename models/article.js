const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  keyword: {
    required: true,
    type: String,
  },
  title: {
    required: true,
    type: String,
  },
  text: {
    required: true,
    type: String,
  },
  date: {
    required: true,
    type: Date,
  },
  source: {
    required: true,
    type: String,
  },
  link: {
    required: true,
    type: String,
  },
  image: {
    required: true,
    type: String,
  },
  owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    select: false,
  },
});

module.exports = mongoose.model('article', articleSchema);
