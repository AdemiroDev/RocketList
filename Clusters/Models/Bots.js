const mongoose = require('mongoose');

let schema = new mongoose.Schema({
  _id: String,
  name: {
    type: String,
    default: ''
  },
  prefix: {
    type: String,
    default: ''
  },
  invite: {
    type: String,
    default: ''
  },
  suporte: {
    type: String,
    default: ''
  },
  owner: {
    type: String,
    default: ''
  },
  shortdescription: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  votes: {
    type: Number,
    default: 0
  }
 })

module.exports = mongoose.model('Bots', schema);
