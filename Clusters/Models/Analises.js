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
  livraria: {
    type: String,
    default: ''
  }
 })

module.exports = mongoose.model('DB_Analises', schema);
