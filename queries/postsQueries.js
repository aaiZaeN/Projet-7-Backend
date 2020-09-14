const Post = require('../database/models/postModel');

exports.getPosts = () => {
  return Post.find({}).exec();
}

exports.createPost = (post) => {
  const newPost = new Post(post);
  return newPost.save();
}