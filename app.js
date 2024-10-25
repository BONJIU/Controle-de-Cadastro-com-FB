const express = require("express")
const app = express()
const handlebars = require("express-handlebars").engine
const bodyParser = require("body-parser")
const post = require("./models/post")
const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const serviceAccount = require('./webii-1a74e-firebase-adminsdk-if5ht-1e8f70f277.json');


initializeApp({
        credential: cert(serviceAccount)
     
})

const db = getFirestore()

app.engine("handlebars", handlebars({
  defaultLayout: "main",
  helpers: {
    eq: (v1, v2) => v1 === v2
  }
}));

app.set("view engine", "handlebars");
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
    res.redirect("/consultar");
 })
})

app.get("/", function(req, res){
    res.render("primeira_pagina")
})


app.get("/confirmar", function(req, res){
    res.render("quarta_pagina", {posts})
    console.log(posts)
})


app.get("/consultar", function (req, res) {
  const posts = [];
  db.collection('Clientes').get().then(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();
      data.id = doc.id;
      posts.push(data);
    });
    res.render("segunda_pagina", { posts });
  })
});

app.post("/atualizar", function (req, res) {
  const id = req.body.id;
  console.log("ID recebido:", id);
  db.collection("Clientes").doc(id).update({
    nome: req.body.nome,
    telefone: req.body.telefone,
    origem: req.body.origem,
    data_contato: req.body.data_contato,
    observacao: req.body.observacao
  })
    .then(() => {
      console.log("Dados atualizados com sucesso!");
      res.redirect("/consultar");
    })
});

app.get("/excluir/:id", function (req, res) {
  const id = req.params.id;
  var result = db.collection('Clientes').doc(id).delete().then(function () {
      console.log('Documento excluído com sucesso!');
      res.redirect('/consultar');
  });
});
app.get("/editar/:id", function (req, res) {
  const id = req.params.id;
  db.collection("Clientes").doc(id).get()
    .then(doc => {
      if (doc.exists) {
        const post = doc.data();
        post.id = doc.id;
        res.render("terceira_pagina", { posts: [post] });
      }
    });
});

app.listen(8081, function(){
    console.log("Servidor funfando")
})
