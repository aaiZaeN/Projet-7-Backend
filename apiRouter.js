// Imports 
const express = require('express');
const usersCtrl = require('./routes/usersCtrl');
const groupopostsCtrl = require('./routes/groupopostsCtrl');

//Router
exports.router = (function() {
  let apiRouter = express.Router();

  // Users routes
  apiRouter.route('/users/register/').post(usersCtrl.register);
  apiRouter.route('/users/login/').post(usersCtrl.login);
  apiRouter.route('/users/me').get(usersCtrl.getUserProfil);

  // Groupoposts routes
  apiRouter.route('/groupoposts/new/').post(groupopostsCtrl.createGroupopost);
  apiRouter.route('/groupoposts/').get(groupopostsCtrl.listGroupoposts);

  return apiRouter;
})();