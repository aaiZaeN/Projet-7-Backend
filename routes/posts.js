const router = require('express').Router();
const Post = require('../database/models/post.model');
const { postList, postNew, postCreate } = require('../controllers/posts.controller');

const router = require('express').Router();

router.get('/', postList);
router.get('/post/new', postNew);
router.post('/', postCreate);

module.exports = router;