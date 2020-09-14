const router = require('express').Router();
const Post = require('../database/models/postModel');
const { postList, postNew, postCreate } = require('../controllers/postsControllers');

router.get('/', postList);
router.get('/new', postNew);
router.post('/', postCreate);
router.delete('/:postId', postDelete);

module.exports = router;