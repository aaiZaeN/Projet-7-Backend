const Post = require('../database/models/postModel');

exports.postList = async (req, res, next) => {
  try {
    const posts = await Post.find({}) .exec();
    res.render('posts/postList', { posts });
  } catch(e) {
    next(e);
  }
}

exports.postNew = (req, res, next) => {
  res.render('posts/postForm');
}

exports.postCreate = async (req, res, next) => {
  try {
    const body = req.body;
    const newPost = new Post(body);
    await newPost.save();
  } catch(e) {
    const errors = Object.keys(e.errors).map( key => e.errors[key].message );
    res.status(400).render('posts/postForm', { errors });
  }
}