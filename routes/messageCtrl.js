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
  createMessage: function(req, res) {
    // Getting auth header
    console.log('test1')
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);

    // Params
    let title   = req.body.title;
    let content = req.body.content;

    if (title == null || content == null) {
      return res.status(400).json({ 'error': 'missing parameters' });
    }

    if (title.length <= titleLimit || content.length <= contentLimit) {
      return res.status(400).json({ 'error': 'invalid parameters' });
    }
console.log('test2')
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
          return res.status(401).json({ 'error': 'unable to verify user' });
        });
      },
      function(userFound, done) {
        console.log('test3', {
          title  : title,
          content: content,
          UserId : userFound.id
        })
        if(userFound) {
          models.Message.create({
            title  : title,
            content: content,
            UserId: userFound.id
          })
          .then(function(newMessage) {
            console.log('test4')
            done(newMessage);
          }).catch(err => {console.log('err', err)})
        } else {
            res.status(404).json({ 'error': 'user not found' });
        }
      },
    ], function(newMessage) {
      if (newMessage) {
        return res.status(201).json(newMessage);
      } else {
        return res.status(400).json({ 'error': 'cannot post message' });
      }
    });
  },
  listMessages: function(req, res) {
    let fields  = req.query.fields;
    let limit   = parseInt(req.query.limit);
    let offset  = parseInt(req.query.offset);
    let order   = req.query.order;

    if (limit > itemsLimit) {
      limit = itemsLimit;
    }

    models.Message.findAll({
      order: [(order != null) ? order.split(':') : ['title', 'ASC']],
      attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
      limit: (!isNaN(limit)) ? limit : null,
      offset: (!isNaN(offset)) ? offset : null
    }).then(function(messages) {
      if (messages) {
        res.status(200).json(messages);
      } else {
        res.status(404).json({ "error": "no messages found" });
      }
    }).catch(function(err) {
      console.log(err);
      res.status(500).json({ "error": "invalid fields" });
    });
  },
    deleteMessage: function(req, res) {
        //req => userId, postId, user.isAdmin
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);

        models.User.findOne({
            attributes: ['id', 'email', 'isAdmin'],
            where: { id: userId }
        }).then(userFound => {
        //Vérification que le demandeur est soit l'admin soit le poster (vérif aussi sur le front)
        if (userFound && (userFound.isAdmin == true || userFound.id == idUSERS)) {
        console.log('Suppression du post id :', id);
        models.Message.findOne({
          where: { id: id }
        }).then(function(messages) {
        if (messages) {
        models.Message.destroy({
        where: { id: id }
        }).then(() => res.end())
        .catch(err => res.status(500).json(err))
        }
        }).catch(err => res.status(500).json(err))
        } else { res.status(403).json('Utilisateur non autorisé à supprimer ce post') }
        }).catch(error => res.status(500).json(error));
    }
  }