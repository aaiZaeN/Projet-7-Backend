//Imports
let models = require('../models')
let asyncLib = require('async')
let jwtUtils = require('../utils/jwt.utils')

//Routes
module.exports = {
  //Create New Comment
  createComment: function (req, res) {
    //Getting auth header
    let headerAuth = req.headerAuth['authorization'];
    let idUSERS = jwtUtils.getUserId(headerAuth);
    //Params
    let groupopostId = req.body.GroupopostId//ICI
    let content = req.body.content;

    if (content == null){
      return res.status(400).json({ 'error': 'missing parameters'});
    }

    //Waterfall for comment creation
    asyncLib.waterfall([

      //Finds user by id
      function (done) {
        models.User.findOne({
          where: { id: idUSERS }
        })
        .then(userFound => {
          done(null, userFound);
        })
        .catch(function (err) {
          return res.status(500).json({ 'error': 'unable to verify user' });
        });
      },

      //Finds groupopost by id
      function (userFound, done) {
        if (userFound) {
          models.Groupopost.findOne({
            where: { id: groupopostId }
          })
          .then(groupopostFound => {
            done(null, groupopostFound, userFound);
          })
        } else {
          console.log(groupopostFound)
          res.status(500).json({ 'error': 'unable to verifu user' });
        }
      },

      //Create comment
      function (groupopostFound, userFound, done) {
        models.Comment.create({
          content: content,
          likes: 0,
          IdUSERS: userFound.id,
          GroupopostId: groupopostFound.id
        })
        .then(newComment => {
          done(newComment);
        })
        .catch(err => {
          return res.status(500).json({ 'error': 'unable to verify user' });
        })
      },
    ],
      //Posts comment
      function (newContent) {
        if (newContent) {
          return res.status(201).json(newContent);

        } else {
          return res.status(500).json({ 'error': 'cannoot post comment' });
        }
      });
  },

    //Lists all comments on groupopost page
    listComments: function (req, res) {
      let order = req.query.order;

      //Verification that groupoposts are not empty
      models.Comment.findAll({
        order: [['createdAt', 'DESC']],
        include: [{
          model: models.User,
          attributes: ['lastName']
        }]
      })
      .then(function (comments) {
        if (comments) {
          res.status(200).json(comments);
        } else {
          res.status(404).json({ 'error': 'no groupopost found' });
        }
      }).catch(function (err) {
        console.log(err);
        res.status(500).json({ 'error': 'invalid fields' });
      });
    },

    //Get one comment after clicking on dashboard
    listOneComment: function (req, res) {
      models.Comment.findByPk(req.params.id)
      .then(function (comments) {
        if (comments) {
          res.status(200).json(comments);
        } else {
          res.status(404).json({ 'error': 'no messages groupoposts found' });
        }
      })
      .catch(function (err) {
        console.log(err);
        res.status(500).json({ 'error': 'invalid fields' });
      });
    },
    //delete
    deleteOneComment: function (req, res) {
      let groupopostId = req.params.id
      asyncLib.waterfall([

        //Deletes likes of comment and then deletes the comment
        function (done) {
          models.Like.destroy({
            where: { commentId: groupopostId }
          })
          .then(commentFound => {
            models.Comment.destroy({
              where: { id: groupopostId }
            })
            return res.status(201).json(commentFound)
          })
          .catch(err => {
            return res.status(500).json({ 'erroe': 'Impossible de supprimer le commentaire' })
          })
        }
      ])
    }
}
