// Imports 
const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt.utils');
const models = require('../models');
const asyncLib = require('async');

// Regex
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*\d).{4,8}$/;

// Routes
module.exports = {
  register: function(req, res) {

    // Params
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;


    // Verify usernam lenght, mail regex, password etc.
    if (email == null || username == null || password == null) {
      return res.status(400).json({ 'error': 'missing parameters' });
    }

    if (username.lenght >= 13 || username.lenght <=4) {
      return res.status(400).json({ 'error': 'wrong username (must be lenght 5-12' });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ 'error': 'email is not valid' });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 'error': 'password invalid (must lenght 4-8 and include 1 number' });
    }

    asyncLib.waterfall([
      function(done) {
        models.user.findOne({
          attributes: ['email'],
          where: { email: email }
      })
      .then(function(userFound) {
        done(null, userFound);
      })
      .catch(function(err) {
        return res.status(500).json({ 'error': 'unable to verify user' });
      });
    },
      function(userFound, done) {
        if (!userFound) {
          bcrypt.hash(password, 5, function( err, bcryptedPassword ) {
            done(null, userFound, bcryptedPassword);
          });
        } else {
          return res.status(409).json({ 'error': 'user already exist' });
        }
      },
      function(userFound, bcryptedPassword, done) {
        let newUser = models.User.create({
          email: email,
          username: username,
          password: bcryptedPassword,
          isAdmin: 0
        })
        .then(function(newUser) {
          done(newUser);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'cannot add user' });
        });
      }
    ], function(newUser) {
      if (newUser) {
        return res.status(201).json({
          'userId': newUser.id
        });
      } else {
        return res.status(500).json({ 'error': 'cannot add user' });
      }
    });
  },
  login: function (req, res) {

    // Params
    const email = req.body.email;
    const password = req.body.password;

    if (email == null || password == null) {
      return res.status(400).json({ 'error': 'missing parameters' });
    }

    // Regex & password lenght.

    models.User.findOne({
      attributes: [ 'id', 'email', 'username' ],
      where: { id: userId }
    }).then(function(user) {
      if (user) {
        res.status(201).json(user);
      } else {
        res.status(404).json({ 'error': 'user not found' });
      }
    }).catch(function(err) {
      res.status(500).json({ 'error': 'cannot fetch user' });
    });
  },
}