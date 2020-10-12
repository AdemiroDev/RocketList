const mongoose = require("mongoose");

let schema = new mongoose.Schema({
  _id: String,
  bots: {
    type: Array,
    default: []
  },
  servers: {
    type: Array,
    default: []
  },
  storage: {
    type: Array,
    default: []
  },
  bio: {
    type: String,
    default: 'Nenhuma biografia definida!'
  },
  seguidores_size: {
    type: Number,
    default: 0
  },
  seguidores: {
    type: Array,
    default: []
  },
  seguindo: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model("DB_User", schema);
