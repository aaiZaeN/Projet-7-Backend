const Post = require('../database/models/postModel');

exports.getPosts = () => {
  return Post.find({}).exec();
}

exports.createPost = (post) => {
  const newPost = new Post(post);
  return newPost.save();
}

exports.deletePost = (postId) => {
  return Post.findByIdAndDelete(postId).exec();
}

exports.getPosts = (postId) => {
  return Post.findOne({ _id: postId}).exec();
}

exports.updatePost = (postId, post) => {
  return Post.findByIdAndUpdate(postId, { $set: post }, {
    runValidators: true });
}