const router = require('express').Router();
const Post = require('../database/models/postModel');
const { postList, postNew, postCreate, postEdit, postUpdate, postDelete } = require('../controllers/postsControllers');

router.get('/', postList);
router.get('/new', postNew);
router.post('/', postCreate);
router.get('/edit', postEdit);
router.get('update/:postId', postUpdate);
router.delete('/:postId', postDelete);


module.exports = router;