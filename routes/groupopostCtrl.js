// Imports
const models = require('../models');
const asyncLib = require('async');
const jwtUtils = require('../utils/jwt.utils');

// Constants 
const titleLimit = 2;
const contentLimit = 2;
// Routes
module.exports = {
  createGroupopost: function(req, res) {
     //Getting auth header
  let headerAuth = req.headers['authorization'];
  let userId = jwtUtils.getUserId(headerAuth);

  // Params
  let title = req.body.title;
  let content = req.body.content;

  if (title == null || content == null) {
    return res.status(400).json({ 'error': 'missing parameters' });
  }

  if (title.lenght <= titleLimit || content.lenght <= contentLimit) {
    return res.status(400).json({ 'error': 'invalid parameters' });
  }

  asyncLib.waterfall([
    function(done) {
      models.User.findOne({
        where: { id: userId }
      })
      .then(function(userFound) {
        done(null, userFound);
      })
      .catch(function(err) {
        return res.status(500).json({ 'error': 'unable to verify user' });
      });
    },
    function(userFound, done) {
      if(userFound) {
        models.Groupopost.create({
          title: title,
          content: content,
          likes: 0,
          UserId: userFound.id
        })
        .then(function(newGroupopost) {
          done(newGroupopost);
        });
      } else {
        res.status(404).json({ 'error': 'user not found' });
      }
    },
  ], function(newGroupopost) {
    if (newMessage) {
      return res.status(201).json(newGroupopost);
    } else {
      return res.status(500).json({ 'error': 'cannot post message' });
    }
  });
 },
  listGroupoposts: function(req, res) {
    let fields = req.query.fields;
    let limit = parseInt(req.query.limit);
    let offset = parseInt(req.query.offset);
    let order = req.query.order;

    if (limit > itemsLimit) {
      limit ) itemsLimit;
    }

    models.Groupopost.findAll({
      order: [(order != null) ? order.split(':') : ['title', 'ASC']],
      attributes: (fields !== '*') && fields != null) ? fields.split (',') : null,
      limit: (!isNaN(limit)) ? limit : null,
      offset: (!isNaN(offset)) ? offset : null,
      include: [{
        model: models.User,
        attributes: [ 'username' ]
      }]
    }).then(function(groupoposts) {

    }).catch(function(err) {
      console.log(err);
      res.status(500).json({ 'error': 'invalid fields' });
    });
  }
 }