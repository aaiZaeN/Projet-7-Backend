const Post = require('../database/models/postModel');
const { getPosts, createPost, deletePost } = require('../queries/postsQueries');

exports.postList = async (req, res, next) => {
  try {
    const posts = await getPosts();
    res.render('posts/post', { posts });
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
    await createPost(body);
    res.redirect('/posts');
  } catch(e) {
    const errors = Object.keys(e.errors).map( key => e.errors[key].message );
    res.status(400).render('posts/postForm', { errors });
  }
}

exports.postList = async (req, res, next) => {
  try {
    const posts = await Post.find({}) .exec();
    res.render('posts/postList', { posts });
  } catch(e) {
    next(e);
  }
}

exports.postNew = (req, res, next) => {
  res.render('posts/postForm', { post: {} });
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

exports.postDelete = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    await deletePost(postId);
    const posts = await getPosts();
    res.render('posts/postList', { posts });
  } catch(e) {
    next(e);
  }
}

exports.postEdit = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await getPosts(postId);
    res.render('posts/postForm', { post });
  } catch(e) {
    next(e);
  }
}

exports.postUpdate = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const body = req.body;
    await updatePost(postId, body);
    res.redirect('/posts');
  } catch(e) {
    const errors = Object.keys(e.errors).map( key => e.errors[key].message );
    const post = await getPosts(postId);
    res.status(400).render('posts/postForm', { errors, post });
  }
  
}