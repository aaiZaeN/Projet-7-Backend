// Imports
const jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = '544jdbsg55slkgcjcjkjk445v55dvsjf44qq4f4v1q';

// Exported functions 
module.exports = {
  generateTokenForUser: function(userData) {
    return jwt.sign({
      username: userData.username,
      userId: userData.id,
      isAdmin: userData.isAdmin,
      email: userData.email
    },
    JWT_SIGN_SECRET,
    {
      expiresIn: '24h'
    })
  },
  parseAuthorization: function(authorization) {
    return (authorization != null) ? authorization.replace('Bearer ', '') : null;
  },
  getUserId: function(authorization) {
    let userId = -1;
    let token = module.exports.parseAuthorization(authorization);
    if(token != null) {
      try {
        let jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
        if(jwtToken != null)
          username = jwtToken.username;
          userId = jwtToken.userId;
          isAdmin = jwtToken.isAdmin;
      } catch(err) { console.log(err)}
    }
    return userId;
  }
}