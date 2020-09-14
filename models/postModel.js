const postSchema = schema({
  content: { 
    type: String,
    maxlenght: [500, 'Message trop long' ],
    minlength: [1, 'Message trop court' ],
    required: [true, 'Champ requit' ]
  }
});

module.exports = Post;