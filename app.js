const express = require('express');
const mysql = require('mysql');
const morgan = require('morgan');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const index = require('./routes');

app.use(morgan('short'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(index);

app.listen(port);