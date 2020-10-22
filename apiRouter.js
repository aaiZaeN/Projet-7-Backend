// Imports 
const express = require('express');
const usersCtrl = require('./routes/usersCtrl');
const messageCtrl = require('./routes/messageCtrl');
const commentCtrl = require('./routes/commentCtrl');
const multer = require('multer');

//Router
exports.router = (function() {

  //Multer config
  const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
  };
  let storage = multer.diskStorage({
    destination: function(req, file, cb) {
      const name = file.originalname.split(' ').join('_');
      const extension = MIME_TYPES[file.mimetype];
      cb(null, name + Data.now() + '.' + extension);
    }
  });

  let upload = multer({ storage: storage })

  let apiRouter = express.Router();
  const { static } = require('express'); 
  apiRouter.use('/images/', static('./images'));

  // CORS
  apiRouter.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.set('Access-Control-Allow-Credentials', 'true')
    next();
  });

  // Users routes
  apiRouter.route('/users/register/').post(usersCtrl.register);
  apiRouter.route('/users/login/').post(usersCtrl.login);
  apiRouter.route('/users/me').get(usersCtrl.getUserProfil);
  apiRouter.route('/users/me/').delete(usersCtrl.deleteUserProfile);

  // Groupoposts routes
  apiRouter.route('/messages').post(messageCtrl.createMessage);
  apiRouter.route('/messages').get(messageCtrl.listMessages);
  apiRouter.route('/messages/newimage/').post(upload.single('file'), messageCtrl.createImageMessage);
  apiRouter.route('/messages/:id').delete(messageCtrl.deleteOneMessage);
  apiRouter.route('/messages/images').get(messageCtrl.listMessages);
  //apiRouter.route('/messages/:id').get(messageCtrl.listOneMessage);
  //apiRouter.route('/messages/:id').put(messageCtrl.modifyMessage);

  //apiRouter.route('/imagetest', multer).post(messageCtrl.imageTest);

  // Commentaires
  apiRouter.route('/comment/').post(commentCtrl.createComment);
  apiRouter.route('/comment/').get(commentCtrl.listComments);
  apiRouter.route('/comment/:id').delete(commentCtrl.deleteComment);
  apiRouter.route('/comment/:id').get(commentCtrl.listOneComment);
  apiRouter.route('/comment/:id').put(commentCtrl.modifyComment);

  return apiRouter;
})();