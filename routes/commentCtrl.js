// Imports
let models = require('../models');
let asyncLib = require('async');
let jwtUtils = require('../utils/jwt.utils');


// Routes
module.exports = {

    //Creates new Comment
    createComment: function (req, res) {
        // Getting auth header
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);
        // Params
        let messageId = req.body.MessageId////////////PROBLEM?
        let content = req.body.content;

        if (content == null) {
            return res.status(400).json({ 'error': 'missing parameters 1' });
        }

        //Waterfall for comment creation
        asyncLib.waterfall([

            //Finds user by id
            function (done) {
                models.User.findOne({
                    where: { id: userId }
                })
                    .then(userFound => {
                        done(null, userFound);
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'unable to verify user' });
                    });
            },

            //Finds message by id
            function (userFound, done) {
                if (userFound) {
                    models.Message.findOne({
                        where: { id: messageId }
                    })
                        .then(messageFound => {
                            done(null, messageFound, userFound);
                        })
                } else {
                    console.log(messageFound)
                    res.status(500).json({ 'error': 'unable to verify user' });
                }
            },

            //Creates comment
            function (messageFound, userFound, done) {
                models.Comment.create({
                    content: content,
                    UserId: userFound.id,
                    MessageId: messageFound.id
                })
                    .then(newComment => {
                        done(newComment);
                    })
                    .catch(err => {
                        return res.status(500).json({ 'error': 'unable to verify user 3' });
                    })
            },
        ],
            //Posts comment
            function (newComment) {
                if (newComment) {
                    return res.status(201).json(newComment);

                } else {
                    return res.status(500).json({ 'error': 'cannot post message' });
                }
            });
    },

    //Lists all Comments on message page
    listComments: function (req, res) {
        let order = req.query.order;

        //Verification that messages are not empty 
        models.Comment.findAll({
            order: [['createdAt', 'DESC']],
            include: [{
                model: models.User,
                attributes: ['username']
            }]
        })
            .then(function (comments) {
                if (comments) {
                    res.status(200).json(comments);
                } else {
                    res.status(404).json({ "error": "no messages found" });
                }
            }).catch(function (err) {
                console.log(err);
                res.status(500).json({ "error": "invalid fields" });
            });
    },

    //Gets one Comment after clicking on dashboard
    listOneComment: function (req, res) {
        models.Comment.findByPk(req.params.id)
            .then(function (comments) {
                if (comments) {
                    res.status(200).json(comments);
                } else {
                    res.status(404).json({ "error": "no messages found" });
                }
            })
            .catch(function (err) {
                console.log(err);
                res.status(500).json({ "error": "invalid fields" });
            });
    },
    // Updates one message 
    modifyComment: function (req, res) {
        // Params
        let content = req.body.content;

        if (content == null) {
            return res.status(400).json({ 'error': 'Rien à publier' });
        }

        asyncLib.waterfall([
            //Finds Message by messageId
            function (done) {
                models.Comment.findByPk(req.params.id)
                    .then(messageFound => {
                        done(null, messageFound);
                    })
                    .catch(err => {
                        return res.status(500).json({ 'error': 'Message non authentifié' });
                    });
            },
            //If message exists, update attributes
            function (messageFound, done) {
                if (messageFound) {
                    messageFound.update({
                        content: (content ? content : messageFound.content)
                    })
                        .then(() => {
                            done(messageFound);
                        })
                        .catch(err => {
                            res.status(500).json({ 'error': 'Modification du message impossible' });
                        });
                } else {
                    res.status(404).json({ 'error': 'Message non trouvé' });
                }
            },
        ],
            //Response and updates message
            function (messageFound) {
                if (messageFound) {
                    return res.status(201).json(messageFound);
                } else {
                    return res.status(500).json({ 'error': 'Message non trouvé' });
                }
            });
    },

    /** Deletes one comment **/
    deleteComment: function (req, res) {
        let messageId = req.params.id
        asyncLib.waterfall([

            //Deletes likes of comment and then deletes the comment
            function (done) {
              models.Comment.destroy({
                where: { id: messageId }
              })
                  return res.status(201).json(commentFound)
                .catch(err => {
                  return res.status(500).json({ 'error': 'Pas possible de supprimer le message' })
              })
            }
        ])
    }
}