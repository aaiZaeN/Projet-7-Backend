// Imports
const models = require('../models');
const asyncLib = require('async');
const jwtUtils = require('../utils/jwt.utils');

// Constants 
const titleLimit = 2;
const contentLimit = 2;
const itemsLimit = 50;
// Routes
module.exports = {
  createGroupopost: function(req, res) {
    // Getting auth header
    console.log('test5')
    let headerAuth  = req.headers['authorization'];
    let userId      = jwtUtils.getUserId(headerAuth);

    // Params
    let title   = req.body.title;
    let content = req.body.content;

    if (title == null || content == null) {
      return res.status(400).json({ 'error': 'missing parameters' });
    }

    if (title.length <= titleLimit || content.length <= contentLimit) {
      return res.status(400).json({ 'error': 'invalid parameters' });
    }
console.log('test4')
    asyncLib.waterfall([
      function(done) {
        models.User.findOne({
          where: { id: userId }
        })
        .then(function(userFound) {
          console.log('test3', userFound)
          done(null, userFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify user' });
        });
      },
      function(userFound, done) {
        console.log('test', {
          title  : title,
          content: content,
          userId : userFound.dataValues.id
        })
        if(userFound) {
          models.GroupoPost.create({
            title  : title,
            content: content,
            user: {id: userFound.dataValues.id} 
          })
          .then(function(newGroupopost) {
            console.log('test2')
            done(newGroupopost);
          }).catch(err => {console.log('err', err)})
        } else {
          return res.status(404).json({ 'error': 'user not found' });
        }
      },
    ], function(newGroupopost) {
      if (newGroupopost) {
        return res.status(201).json(newGroupopost);
      } else {
        return res.status(500).json({ 'error': 'cannot post message' });
      }
    });
  },
  listGroupoposts: function(req, res) {
    let fields  = req.query.fields;
    let limit   = parseInt(req.query.limit);
    let offset  = parseInt(req.query.offset);
    let order   = req.query.order;

    if (limit > itemsLimit) {
        limit = itemsLimit;
    }

    models.Groupopost.findAll({
      order: [(order != null) ? order.split(':') : ['title', 'ASC']],
      attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
      limit: (!isNaN(limit)) ? limit : null,
      offset: (!isNaN(offset)) ? offset : null,
      include: [{
        model: models.User,
        attributes: [ 'lastName', 'firstName' ]
      }]
    }).then(function(groupoposts) {
      if (groupoposts) {
        res.status(200).json(groupoposts);
      } else {
        res.status(404).json({ "error": "no messages found" });
      }
    }).catch(function(err) {
      console.log(err);
      res.status(500).json({ "error": "invalid fields" });
    });
  }
}