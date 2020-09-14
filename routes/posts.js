const router = require('express').Router();
const { postList, postNew, postCreate } = require('../controllers/postsControllers');

router.get('/', postList);
router.get('/new', postNew);
router.post('/', postCreate);

module.exports = router;