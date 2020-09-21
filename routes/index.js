const router = require('express').Router();
const Post = require('./posts');

router.use('/posts', posts);
router.use('/users', users);

router.get('/', (req, res) => {
  res.redirect('/posts')
});

module.exports = router;