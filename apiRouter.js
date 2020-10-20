// Imports 
const express = require('express');
const usersCtrl = require('./routes/usersCtrl');
const groupopostsCtrl = require('./routes/groupopostsCtrl');

//Router
exports.router = (function() {
  let apiRouter = express.Router();

  // Users routes
  apiRouter.route('/users/register').post(usersCtrl.register);
  apiRouter.route('/users/login').post(usersCtrl.login);
  apiRouter.route('/users/me').get(usersCtrl.getUserProfil);
  apiRouter.route('/users/delete').delete(usersCtrl.deleteUserProfil);


  // Groupoposts routes
  apiRouter.route('/groupoposts').post(groupopostsCtrl.createGroupopost);
  apiRouter.route('/groupoposts').get(groupopostsCtrl.listGroupoposts);
  apiRouter.route('/groupoposts/delete').delete(groupopostsCtrl.deleteOneGroupopost);

  return apiRouter;
})();