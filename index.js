const http = require("http");
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
const cookieParser = require("cookie-parser");
const moment = require("moment");
moment.locale("pt-br");
const session = require('express-session');
const port = process.env.PORT || 3000;
const passport = require('passport');
const flash = require('connect-flash');

require("./Clusters/Cluster-01.js");

app.use(flash());
app.use(session({ secret: 'keyboard cat', cookie: { }, resave: true,saveUninitialized: true,}))

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/", require("./routes/router"));
app.listen(process.env.PORT, () =>
  console.log("Rodando com sucesso na porta " + process.env.PORT)
);

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
