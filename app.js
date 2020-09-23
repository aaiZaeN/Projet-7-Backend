// imports
const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./apiRouter').router;
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

server.use('/api/', apiRouter);

// Body Parser configuration
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// Launch server
server.lesten(8000, function() {
  console.log('Server en écoute :)')
});


app.listen(port);