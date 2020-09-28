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

// Configure routes
app.get('/', function (req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send('<h1>Hello bienvenue sur mon serveur</h1>');
});

app.use('/api/', apiRouter);

// Body Parser configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Launch server
app.listen(8000, function() {
  console.log('Server en écoute :)')
});


app.listen(port);