// Imports 
const express = require('express');
const usersCtrl = require('./routes/usersCtrl');
const groupopostsCtrl = require('./routes/groupopostsCtrl');

//Router
exports.router = (function() {
  const apiRouter = express.Router();

  // Users routes
  apiRouter.route('/user/register/').post(usersCtrl.register);
  apiRouter.route('/user/login/').post(usersCtrl.login);



  // Groupoposts routes
  apiRouter.route('/groupoposts/new/').post(groupopostsCtrl.createGroupopost);
  apiRouter.route('/groupoposts/').get(groupopostsCtrl.listGroupoposts);

  return apiRouter;
})();