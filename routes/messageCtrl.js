// Imports
const models = require('../models');
const asyncLib = require('async');
const jwtUtils = require('../utils/jwt.utils');
const usersCtrl = require('./usersCtrl');
const multer = require('multer')
const upload = multer({ dest: 'images/' })

// Constants 
const titleLimit = 2;
const contentLimit = 2;
const itemsLimit = 50;
// Routes
module.exports = {
  createImageMessage: function (req, res) {
  let headerAuth = req.headers['authorization'];
  let userId = jwtUtils.getUserId(headerAuth);
  let attachmentURL

  // Params

  let title = req.body.title;
  let content = req.body.content;
    asyncLib.waterfall([
    //Finds user by userID

  function (done) {
    models.User.findOne({
      where: { id: userId }
    })
    .then(userFound => {
    console.log(req.body)
    done(null, userFound);
    })
    .catch(err => {
      return res.status(500).json({ 'error': 'Utilisateur non authentifié' });
    });
  },
  //Creates new message
  function (userFound, done) {
  console.log(req.body)
  if (userFound !== null) {
  let attachmentURL = `${req.file.filename}`;
  //let attachmentURL = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

  if (req.file != undefined) {
  (req, res) => {
  try {
  //console.log(req.file)
  res.send(req.file);
  } catch (err) {
  res.send(400);
  }
  }
  } else {
  attachmentURL == null
  };
  if ((attachmentURL == null)) {
    res.status(400).json({ error: 'Rien à publier' })
  } else {
    models.Message.create({
      title: title,
      content: content,
      UserId: userFound.id,
      attachment: attachmentURL
    })
  .then(newMessage => {
    done(newMessage);
  })
  .catch(err => {
    return res.status(500).json({ 'error': 'Message non authentifié' });
  });
  }
 }
            },
        ],
            //Response
            function (newMessage) {
                if (newMessage) {
                    return res.status(201).json(newMessage);
                } else {
                    return res.status(500).json({ 'error': 'message non publié' });
                }
            });
    },
  createMessage: function(req, res) {
    // Getting auth header
    console.log('test1')
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    let attachmentURL
    let multer = require('multer')
    let upload = multer({ dest: 'images/' })

    // Params
    let title   = req.body.title;
    let content = req.body.content;
    let attachment = req.body.attachment;

    
    if (title == null || content == null) {
      return res.status(400).json({ 'error': 'Rien à publier' });
    }
    console.log('test2')

    if (req.file != undefined) {
      attachmentURL = `${req.file.filename}`;
    }
    else {
        attachmentURL == null
    };

    

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
        console.log('test3', {
          title  : title,
          content: content,
          UserId : userFound.id,
          attachment: attachmentURL
        })
        if(userFound) {
          models.Message.create({
            title  : title,
            content: content,
            UserId: userFound.id,
            attachment: attachmentURL
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
      include: [{
        model: models.User,
        attributes: ['username']
      }],
      order: [(order != null) ? order.split(':') : ['createdAt', 'DESC']],
      attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
      limit: (!isNaN(limit)) ? limit : null,
      offset: (!isNaN(offset)) ? offset : null,
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
    deleteOneMessage: function(req, res) {
        //req => userId, postId, user.isAdmin
        let messageId = req.params.id

        asyncLib.waterfall([
          function (done) {
            models.Message.destroy({
              where: { id: messageId }
            })
            .then(done => {
              return res.status(201).json({ 'ok': 'message supprimé' })
            })
            .catch(err => {
              return res.status(400).json({ 'error': 'Impossible de supprimer le message'})
            })
          }
        ])
    }
  }