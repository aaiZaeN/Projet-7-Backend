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
    console.log('test1')
    let headerAuth = req.headers['authorization'];
    let idUSERS = jwtUtils.getUserId(headerAuth);

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
          where: { id: idUSERS }
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
          IdUSERS : userFound.id
        })
        if(userFound) {
          models.Groupopost.create({
            title  : title,
            content: content,
            UserId: userFound.id
          })
          .then(function(newGroupopost) {
            console.log('test4')
            done(newGroupopost);
          }).catch(err => {console.log('err', err)})
        } else {
            res.status(404).json({ 'error': 'user not found' });
        }
      },
    ], function(newGroupopost) {
      if (newGroupopost) {
        return res.status(201).json(newGroupopost);
      } else {
        return res.status(400).json({ 'error': 'cannot post message' });
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
      order: [(order != null) ? order.split(':') : ['updatedAt', 'DESC']],
      attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
      limit: (!isNaN(limit)) ? limit : null,
      offset: (!isNaN(offset)) ? offset : null
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
  },
    deleteGroupopost: function(req, res) {
        let headerAuth = req.headers['authorization'];
        let idUSERS = jwtUtils.getUserId(headerAuth);

        models.User.findOne({
            attributes: ['id', 'isAdmin'],
            where: { id: idUSERS }
        }).then(userFound => {
        //Vérification que le demandeur est soit l'admin soit le créateur du Goupopost 
        if (userFound && (userFound.isAdmin == true || userFound.id == idUSERS)) {
        console.log('Suppression du post id :', id);
        models.Groupopost.findOne({
          where: { id: id }
        }).then(function(groupoposts) {
        if (groupoposts) {
        models.Groupopost.destroy({
        where: { id: id }
        }).then(() => res.end())
        .catch(err => res.status(500).json(err))
        }
        }).catch(err => res.status(500).json(err))
        } else { res.status(403).json('Utilisateur non autorisé à supprimer ce post') }
        }).catch(error => res.status(500).json(error));
    }
  }