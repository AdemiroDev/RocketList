const router = require("express").Router();
const Discord = require("discord.js");
const client = new Discord.Client();
const firebase = require("firebase")

var firebaseConfig = {
    apiKey: "AIzaSyDkEkWuQnJMsOogUrIbXrQPe6XVT62eMoM",
    authDomain: "rocketlist-ace21.firebaseapp.com",
    databaseURL: "https://rocketlist-ace21.firebaseio.com",
    projectId: "rocketlist-ace21",
    storageBucket: "rocketlist-ace21.appspot.com",
    messagingSenderId: "641564054297",
    appId: "1:641564054297:web:cf6cd74153d1f493ea2b88",
    measurementId: "G-22CCXKE0JH"
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();

const Bots = require("../Clusters/Models/Bots.js");
const Users = require("../Clusters/Models/Users.js")
const Analises = require("../Clusters/Models/Analises.js")
const configs = {
  clientID: "764922683355168828",
  clientSecret: "DxJXhmXlR_BthQKU0z5kONTGRQpUoSgZ",
  callbackURL: "https://torch-cooperative-backpack.glitch.me/callback",
  token: "NzY0OTIyNjgzMzU1MTY4ODI4.X4NTww.xszg01JoX2DvBtSAqRZu_N5b-sg"
}

client.login(configs.token);
client.on("ready", async () => {

  console.log("APLICAÇÃO INICIADA!");

  setInterval(async () => {

  let filter = {};
  let allBots = await Bots.find(filter)

  allBots.forEach(async function(bot) {

    client.users.fetch(bot._id).then(async member => {

      await Bots.findByIdAndUpdate(bot._id , { $set: { avatar: member.avatarURL({ dynamic: true, size: 4096 }) } })

    })
   })
 }, 120000)

});

const session = require("express-session");
const passport = require("passport");
const Strategy = require("../lib").Strategy;

passport.serializeUser(function(user, done) { done(null, user); });
passport.deserializeUser(function(obj, done) { done(null, obj); });

var scopes = ["identify", "email"];
var prompt = "consent";

passport.use(new Strategy({ clientID: configs.clientID, clientSecret: configs.clientSecret, callbackURL: configs.callbackURL, scope: scopes, prompt: prompt },

    function(accessToken, refreshToken, profile, done) {

      process.nextTick(function() {

        return done(null, profile);

      });
    }
  )
);

router.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());

router.get("/oauth2", passport.authenticate("discord", { scope: scopes, prompt: prompt }), function(req, res) { });

router.get("/", checkAuth, async(req, res) => {

  let user = req.session.user

  res.render("index.ejs", { user, client })

})

router.post("/addbot/enviar", checkAuth, async(req, res) => {

      let dados = req.body
      let user = req.session.user
      
client.users.fetch(dados.id).then(member => {
      
      new Analises({
          _id: dados.id,
          name: dados.nome,
          prefix: dados.prefixo,
          invite: dados.botinvite,
          suporte: dados.botsuporte,
          owner: user.id,
          shortdescription: dados.descp,
          description: dados.descg,
          avatar: member.avatarURL({ dynamic: true, size: 4096 }),
      }).save()
  
})
  
  res.send('Bot enviado para verificação com sucesso!')

})

router.get("/addbot", checkAuth, async(req, res) => {

  let user    = req.session.user
  
  res.render("addbot.ejs", { client, user })

})

router.get("/bots", checkAuth, async(req, res) => {

  let filter  = {};
  let user    = req.session.user
  let allBots = await Bots.find(filter)

  res.render("bots.ejs", { Bots: allBots, client, user })

})

router.get("/bots/:botID", checkAuth, async(req, res) => {

  let botID = req.params.botID
  let stringID = req.params.botID.toString();
  let user = req.session.user
  let ms = require('parse-ms')
  let daily = await db.ref(`Cowndown/Votes/${user.id}/${stringID}/Timer`).once('value')
      daily = daily.val()
  let timeout = 43200000
  let time = ms(timeout - (Date.now() - daily));


  await Bots.findOne({ _id: botID }, async (err, dados) => {

    if (dados) {

      if (daily !== null && timeout - (Date.now() - daily) > 0) {

          if(time) time = `Vote novamente em ${time.hours}h ${time.minutes}m ${time.seconds}s`

          res.render("info_bots.ejs", { dados, client, db, stringID, time, user })

      } else {

          if(time) time = `Votar`

          res.render("info_bots.ejs", { dados, client, db, stringID, time, user })
      }

    } else {

      res.send("Bot existente !")

    }

  })

})

router.get('/bots/:botID/votar', checkAuth, async (req, res) => {

    let user = req.session.user;
    let botID = req.params.botID;
    let stringID = req.params.botID.toString();
    let botdb = await Bots.findById(stringID);
    let ms = require('parse-ms')

 let daily = await db.ref(`Cowndown/Votes/${user.id}/${stringID}/Timer`).once('value')
     daily = daily.val()

 let timeout = 43200000

 if (daily !== null && timeout - (Date.now() - daily) > 0) {

            let time = ms(timeout - (Date.now() - daily));

            let err = `Espera ai ${user.username}#${user.discriminator}, você já votou recentemente! Tente novamente em: ${time.hours}horas ${time.minutes}minutos ${time.seconds}segundos.`

            return res.redirect(`/bots/${botID}`)

 } else {

    botdb.votes += 1;
    botdb.save()
    db.ref(`Cowndown/Votes/${user.id}/${stringID}/Timer`).set(Date.now());

    await Bots.findOne({ _id: stringID }, async (err, dados) => {

      if(dados) {



      }

    })

  }

})

router.get("/analises", checkAuth, async (req, res) => {

  let user = req.session.user;

  if(!client.guilds.cache.get('764879920076816444').members.cache.get(user.id)) return res.send('Entre eu meu servidor fonte: https://discord.gg/s3qDFEw')
  if(!client.guilds.cache.get('764879920076816444').members.cache.get(user.id).roles.cache.has(('764902367056625714'))) return res.send('Acesso Negado !')

  let filter = {};
  let analise = await Analises.find(filter);

    setTimeout(() => {

          res.render("analises.ejs", { user, analise, client });

    }, 2000)

});

router.get("/analisar/:botID", checkAuth, async(req, res) => {

  let botID = req.params.botID
  let user  = req.session.user

  await Analises.findOne({ _id: botID }, async(err, dados) => {

    if(dados) {

      res.render("info_analise.ejs", { user, client, dados })

      }

  })

})

router.get("/aprovar/:botID", checkAuth, async(req, res) => {

  let botID = req.params.botID;
  let user  = req.session.user;

      await Analises.findOne({ _id: botID }, async (err, dados) => {

      new Bots({
          _id: botID,
          name: dados.name,
          prefix: dados.prefix,
          invite: dados.invite,
          suporte: dados.suporte,
          owner: dados.owner,
          shortdescription: dados.shortdescription,
          description: dados.description,
          avatar: dados.avatar,
      }).save()

      new Analises({
          _id: botID,
          name: dados.name,
          prefix: dados.prefix,
          invite: dados.invite,
          suporte: dados.suporte,
          owner: dados.owner,
          shortdescription: dados.shortdescription,
          description: dados.description,
          avatar: dados.avatar,
      }).delete()

          await Users.findByIdAndUpdate(dados.owner, { $push: { bots: botID } })

          let embed  = new Discord.MessageEmbed().setDescription(`**|** Bot <@!${botID}> do usuário <@!${dados.owner}> foi aprovado pelo analisador <@!${user.id}!`)
          let embed2 = new Discord.MessageEmbed().setDescription(`**|** <@!${dados.owner}> Seu bot <@!${botID}> foi aprovado pelo analisador <@!${user.id}>!`)

          res.redirect("/analises")

          client.channels.cache.get('765004096310345728').send(`<@!${dados.owner}>`, embed)
          client.users.cache.get(dados.owner).send(embed2).catch(err => {

            let error = new Discord.MessageEmbed().setDescription(`**|** Erro ao enviar mensagem para <@!${dados.owner}>\n\n\`\`\`js\n${err}\`\`\``)

            client.channels.cache.get('765004096310345728').send(error)

          })
      })

})

router.get("/reprovar/:botID", checkAuth, async(req, res) => {

  let botID = req.params.botID
  let user  = req.session.user

  await Analises.findOne({ _id: botID }, async (err, dados) => {

        new Analises({
             _id: botID,
             name: dados.name,
             prefix: dados.prefix,
             invite: dados.invite,
             suporte: dados.suporte,
             owner: dados.owner,
             shortdescription: dados.shortdescription,
             description: dados.description,
             avatar: dados.avatar,
             livraria: dados.livraria
         }).delete()

    let embed  = new Discord.MessageEmbed().setDescription(`**|** Bot <@!${botID}> do usuário <@!${dados.owner}> foi reprovado pelo analisador <@!${user.id}>!`)
    let embed2 = new Discord.MessageEmbed().setDescription(`**|** <@!${dados.owner} Seu bot <@!${botID}> foi reprovado pelo staff <@!${user.id}>!`)

    res.redirect("/analises")

    client.channels.cache.get('765004096310345728').send(`<@!${dados.owner}>`, embed)
    client.users.cache.get(dados.owner).send(embed2).catch(err => {

      let embed = new Discord.MessageEmbed().setDescription(`<a:emoji:733770542552973413> **|** Erro ao enviar mensagem para <@!${dados.owner}>\n\n\`\`\`js\n${err}\`\`\``)

      client.channels.cache.get('765004096310345728').send(embed)

    })

    client.guilds.cache.get('764879920076816444').members.cache.get(botID).kick({ reason: 'Bot reprovado !' })

  })

})

router.get("/callback", passport.authenticate("discord", { failureRedirect: "/" }),

function(req, res) {

    req.session.login    = true;
    req.session.user     = req.user;
    req.session.user.tag = `${req.user.username}#${req.user.discriminator}`
    req.session.guilds   = req.user.guilds;

    res.redirect("/");

});

function checkAuth(req, res, next) {

  if (req.session.login) return next();

  req.session.login = false;
  req.session.page = 1;
  res.redirect("/oauth2");

}

module.exports = router;