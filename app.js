const express = require("express")
const app = express()
const handlebars = require("express-handlebars").engine
const bodyParser = require("body-parser")
const post = require("./models/post")
const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const serviceAccount = require('./webii-1a74e-firebase-adminsdk-if5ht-e952c7f91d.json');


initializeApp({
        credential: cert(serviceAccount)
     
})


const db = getFirestore()


app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const Handlebars = require("express-handlebars").create().handlebars;

Handlebars.registerHelper("eq", function (v1, v2) {
  return v1 === v2;
});

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.post("/cadastrar", function(req, res){
 var result = db.collection('Clientes').add({
    nome: req.body.nome,
    telefone: req.body.telefone,
    origem: req.body.origem,
    data_contato: req.body.data_contato,
    observacao: req.body.observacao
 }).then(function(){
    console.log("Dados cadastrados com sucesso!")
 })
})
app.get("/", function(req, res){
    res.render("primeira_pagina")
})


app.get("/confirmar", function(req, res){
    res.render("quarta_pagina", {posts})
    console.log(posts)
})


app.get("/consultar", function(req, res){
    var posts = []
    db.collection('Clientes').get().then(
      function(snapshot){
        snapshot.forEach(function(doc){
          const data = doc.data()
          data.id = doc.id
          posts.push(data)
        })
        res.render("segunda_pagina",{posts: posts})
      }
    )
  })

app.post("/atualizar", function(req,res){
    post.update({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    }).then(
        function(){
            console.log('Dados atualizados com sucesso!')
            res.render('/consultar')
        }
    )
})


app.get("/excluir/:id", function (req, res) {
    const id = req.params.id;
    console.log("ID recebido:", id);
    db.collection("Clientes").doc(id).get().then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          data.id = doc.id;
          res.render("quarta_pagina", { posts: [data] });
        }
      });
  });

app.post("/excluir", function (req, res) {
    const id = req.body.id;
    db.collection("Clientes").doc(id).delete().then(function(){
        console.log("Dados excluídos com sucesso!");
        res.redirect("/consultar");
      });
  });
  

app.get("/editar/:id", function(req, res){
        post.findAll({where: {'id' : req.params.id}}).then(
            function(posts){
                res.render("terceira_pagina", {posts})
                console.log(posts)
            }
        )
    })

app.listen(8081, function(){
    console.log("Servidor funfando")
})
