// imports
const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./apiRouter').router;
const morgan = require('morgan');
const errorHandler = require('errorhandler');
const path = require('path');
const port = process.env.PORT || 3000;

// Instantiate app
const app = express();

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Body Parser configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Configure routes
app.get('/', function (req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send('Bienvenue sur mon serveur :)');

});


app.use('/api/', apiRouter);


// Launch server
app.listen(8080, function() {
  console.log('Server en écoute :)')
});