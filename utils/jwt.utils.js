// Imports
const jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = '544jdbsg55slkgcjcjkjk445v55dvsjf44qq4f4v1q';

// Exported functions 
module.exports = {
  generateTokenForUser: function(userData) {
    return jwt.sign({
      userId: userData.id,
      isAdmin: userData.isAdmin
    },
    JWT_SIGN_SECRET,
    {
      expiresIn: '1h'
    })
  }
}