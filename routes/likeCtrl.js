// Import
let models = require('../models')
let jwtUtils = require('../utils/jwt.utils')
let asyncLib = require('async')

//
const DISLIKED = 0;
const LIKED = 1;

//Routes
module.exports = {
  likePost: function (req, res) {
    //Getting auth header
    let headerAuth = req.headers['authorization'];
    let IdUSERS = jwtUtils.getUserId(headerAuth);

    //Params
    let groupopostId = parseInt(req.params.groupopostId);
    console.log(groupopostId)

    if (groupopostId <= 0) {
      return res.status(400).json({ 'error': 'invalid parameters' });
    }

    asyncLib.waterfall([
      //Finds the groupopost
      function (done) {
        models.Groupopost.findOne({
          where: { id: groupopostId }
        })
        .then(function (err) {
          done(null, groupopostFound);
        })
        .catch(function (err) {
          return res.status(500).json({ 'error': 'unable to verify groupopost' });
        });
      },
      //Finds the user associated to thar groupopost
      function (groupopostFound, done) {
        if (groupopostFound) {
          models.User.findOne({
            where: { id: IdUSERS }
          })
          .then(function (userFound) {
            done(null, groupopostFound, userFound);
          })
          .catch(function (err) {
            return res.status(500).json({ 'error': 'unable to verify user' });
          });
        } else {
          res.status(404).json({ 'error': 'post already liked' });
        }
      },
      //Check in Likes if there is a groupopost with IdUSERS and groupopostId
      function (groupopostFound, userFound, done) {
        if (userFound) {
          models.Like.findOne({
            where: {
              IdUSERS: IdUSERS,
              groupopostId: groupopostId
            }
          })
          .then(function (userAlreadyLikedFound) {
            console.log(userAlreadyLikedFound)
            done(null, groupopostFound, userFound, userAlreadyLikedFound);

          })
          .catch(function (err) {
            return res.status(500).json({ 'error': 'unable to verify user has already liked' });
          });
        } else {
          res.status(404).json({ 'error': 'user not exist' });
        }
      },
      //Checks if user has already liked a groupopost
      function (groupopostFound, userFound, userAlreadyLikedFound, done) {
        if (!userAlreadyLikedFound) {
          groupopostFound.addUser(userFound, { isLike: LIKED })
          .then(function (alreadyLikeFound) {
            done(null, groupopostFound, userFound);
          })
          .catch(function (err) {
            console.log(userFound.isLike)
            return res.status(500).json({ 'error': 'unable to set a reaction' });
          });
        } else {
          if (userAlreadyLikedFound.isLike === DISLIKED) {
            userAlreadyLikedFound.update({
              isLike: LIKED,
            }).then(function () {
              done(null, groupopostFound, userFound);
            }).catch(function (err) {
              res.status(500).json({ 'error':'cannot update user reaction' });
            });
          } else {
            res.status(400).json({ 'error': 'groupopost already liked' });
          }
        }
      },
      //Update the number of likes
      function (groupopostFound, userFound, done) {
        groupopostFound.update({
          likes: groupopostFound.likes + 1,
        }).then(function () {
          done(groupopostFound);
        }).catch(function (err) {
          res.status(500).json({ 'error': 'cannot update groupopost like counter' });
        });
      },
    ],
      //Display likes 
      function (groupopostFound) {
        if (groupopostFound) {
          return res.status(201).json(groupopostFound);
        } else {
          return res.status(500).json({ 'error': 'cannot update groupopost' });
        }
    });
  },
  dislikePost: function(req, res) {
    //Getting auth header
    let headerAuth = req.headerAuth['authorization'];
    let IdUSERS = jwtUtils.getUserId(headerAuth);

    //Params
    let groupopostId = parseInt(req.params.groupopostId);

    if (groupopostId <= 0) {
      return res.status(400).json({ 'error': 'invalid parameters' });
    }

  asyncLib.waterfall([
    function (done) {
      models.Groupopost.findOne({
        where: { id: groupopostId }
      })
      .then(function (groupopostFound) {
        done(null, groupopostFound);
      })
      .catch(function (err) {
        return res.status(500).json({ 'error': 'unable to verify groupopost' });
      });
    },
    function (groupopostFound, done) {
      if (groupopostFound) {
        models.User.findOne({
          where: { id: IdUSERS }
        })
        .then(function (userFound) {
          done(null, groupopostFound, userFound);
        })
        .catch(function (err) {
          return res.status(500).json({ 'error': 'unable to verify user' });
        });
      } else {
        res.status(404).json({ 'error': 'post already liked' });
      }
    },
    function (groupopostFound, userFound, done) {
      if (userFound) {
        models.Like.findOne({
          where: {
            IdUSERS: IdUSERS,
            groupopostId: groupopostId
          }
        })
        .then(function (userAlreadyLikedFound) {
          done(null, groupopostFound, userFound, userAlreadyLikedFound);
        })
        .catch(function (err) {
          return res.status(500).json({ 'error': 'unable to verify is user already liked' });
        });
      } else {
          res.status(404).json({ 'error': 'user not exist' });
      }
    },
    function (groupopostFound, userFound, userAlreadyLikedFound, done) {
        if (!userAlreadyLikedFound) {
          groupopostFound.addUser(userFound, { isLike: DISLIKED })
          .then(function (alreadyLikeFound) {
            done(null, groupopostFound, userFound);
          }).catch(function (err) {
            res.status(500).json({ 'error': 'cannot update reaction' });
          });
        } else {
          if (userAlreadyLikedFound.isLike === LIKED) {
            userAlreadyLikedFound.update({
                isLike: DISLIKED,
            }).then(function () {
                done(null, groupopostFound, userFound);
            }).catch(function (err) {
                res.status(500).json({ 'error': 'cannot update user reaction' });
            });
        } else {
          res.status(409).json({ 'error': 'groupopost already disliked' });
        }
      }
    },
      function (groupopostFound) {
        groupopostFound.update({
          likes: groupopostFound.likes -1,
        }).then(function () {
          done(groupopostFound);
        }).catch(function (err) {
          res.status(500).json({ 'error': 'cannot update groupopost like counter' });
        });
      },
    ], function (groupopostFound) {
        if (groupopostFound) {
          return res.status(201).json(groupopostFound);
        } else {
          return res.status(500).json({ 'error': 'cannot update groupopost' });
        }
    });
  }
}