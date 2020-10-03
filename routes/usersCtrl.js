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
    const lastName = req.body.lastName;
    const firstName = req.body.firstName;
    const password = req.body.password;


    // Verify usernam lenght, mail regex, password etc.
    if (email == null || lastName == null || firstName == null || password == null) {
      return res.status(400).json({ 'error': 'missing parameters' });
    }

    if (lastName.length >= 13 || lastName.length <=2) {
      return res.status(400).json({ 'error': 'wrong username (must be lenght 5-12' });
    }

    if (firstName.length >= 13 || firstName.length <=2) {
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
        models.User.findOne({
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
          lastName: lastName,
          firstName: firstName,
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
  login: function(req, res) {
    
    // Params
    let email    = req.body.email;
    let password = req.body.password;

    if (email == null ||  password == null) {
      return res.status(400).json({ 'error': 'missing parameters' });
    }

    asyncLib.waterfall([
      function(done) {
        models.User.findOne({
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
        if (userFound) {
          bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt) {
            done(null, userFound, resBycrypt);
          });
        } else {
          return res.status(404).json({ 'error': 'user not exist in DB' });
        }
      },
      function(userFound, resBycrypt, done) {
        if(resBycrypt) {
          done(userFound);
        } else {
          return res.status(403).json({ 'error': 'invalid password' });
        }
      }
    ], function(userFound) {
      if (userFound) {
        return res.status(201).json({
          'userId': userFound.id,
          'token': jwtUtils.generateTokenForUser(userFound)
        });
      } else {
        return res.status(500).json({ 'error': 'cannot log on user' });
      }
    });
  },
}