const mongoose = require("mongoose");

mongoose.connect(`mongodb+srv://MyOn:lindo0987@cluster0.pq86e.mongodb.net/Da?retryWrites=true&w=majority`, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

  .then(function() {
    console.log("\x1b[32m[ BANCO DE DADOS ] \x1b[0mBanco de dados foi ligado!");
  }).catch(function() {
    console.log("\x1b[31m[ BANCO DE DADOS ] \x1b[0mBanco de dados desligado por erro!");
  });
