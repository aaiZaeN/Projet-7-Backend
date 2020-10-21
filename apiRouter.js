// Imports 
const express = require('express');
const usersCtrl = require('./routes/usersCtrl');
const groupopostsCtrl = require('./routes/messageCtrl');

//Router
exports.router = (function() {
  let apiRouter = express.Router();

  // Users routes
  apiRouter.route('/users/register/').post(usersCtrl.register);
  apiRouter.route('/users/login/').post(usersCtrl.login);
  apiRouter.route('/users/me').get(usersCtrl.getUserProfil);

  // Groupoposts routes
  apiRouter.route('/message/new/').post(groupopostsCtrl.createMessage);
  apiRouter.route('/messages/').get(groupopostsCtrl.listMessages);

  return apiRouter;
})();