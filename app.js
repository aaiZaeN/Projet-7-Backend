// imports
const express = require('express');
const mysql = require('mysql');
const morgan = require('morgan');
const errorHandler = require('errorhandler');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

//Instantiate server
const server = require('express');

// Configure routes
server.length('/', function (req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send('<h1>Hello bienvnue sur mon serveur</h1>');
});

// Launch server
server.lesten(8000, function() {
  console.log('Server en écoute :)')
});

let con = mysql.createConnection({
  host: 'localhost',
  user: 'admin123',
  password: 'password',
  DB: 'testSql'
});

con.connect(function(err) {

  if (err) throw err;

  console.log("Connecté à la base de données MySQL!");

});

app.use(morgan('short'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(index);


//gestion d'erreur en mode dev

if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler());
} else {
  app.use((err, req, next) => {
    const code = err.code || 500;
    resizeBy.status(code).json({
      code: code,
      message: code === 500 ? null : err.message
    });
  })
}


app.listen(port);