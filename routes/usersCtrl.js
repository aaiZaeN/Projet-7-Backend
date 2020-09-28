// Imports 
const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt.utils');
const models = require('../models');

// Routes
module.exports = {
  register: function(req, res) {

    // Params
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const bio = req.body.bio;

    if (email == null || username == null || password == null) {
      return res.status(400).json({ 'error': 'missing parameters' });
    }

    if (username.lenght >= 13 || username.lenght <=4) {
      return res.status(400).json({ 'error': 'wrong username (must be lenght 5-12' });
    }

    // Verify usernam lenght, mail regex, password etc.

      models.User.findOne({
        attributes: ['email'],
        where: { email: email }
      })
      .then(function(userFound) {
        if (!userFound) {

          bcrypt.hash(password, 5, function( err, bcryptedPassword ) {
            const newUser = models.USer.create({
              email: email,
              username: username,
              password: bcryptedPassword,
              bio: bio, 
              isAdmin: 0
            })
            .then(function(newUser) {
              return res.status(201).json({
                'userId': newUser.id
              })
            })
            .catch(function(err) {
              return res.status(500).json({ 'error': 'cannot add user' });
            });
          });

        } else {
          return res.status(409).json({ 'error': 'user already exist' });
        }
      })

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
      where: { email: email }
    })
    .then(function(userFound) {
      if (userFound) {

        bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt) {
          if(resBycrypt) {
            return res.status(200).json({
              'userId': userFound.id,
              'token': jwtUtils.generateTokenForUser(userFound)
            });
          } else {
            return res.status(403).json({ 'error': 'invalid password' });
          }
        });
      } else {
        return res.status(404).json({ 'error': 'user not exist in DB' });
      }
    })
    .catch(function(err) {
      return res.status(500).json({ 'error': 'unable to verify user' });
    });
  }
}