const userSchema = schema({
  username: { type: String, required: true },
  local: {
    email: { type: String, required: true },
    password: { type: String, required: true }
  }
});

module.exports = User;