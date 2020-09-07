const router = require('express').Router();
const Post = require('./posts');

router.use('/posts', posts);
router.get('/', (req, res) => {
  res.redirect('/tweets')
});

module.exports = router;