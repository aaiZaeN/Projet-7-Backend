// Imports
const jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = '544jdbsg55slkgcjcjkjk445v55dvsjf44qq4f4v1q';

// Exported functions 
module.exports = {
  generateTokenForUser: function(userData) {
    return jwt.sign({
      idUSERS: userData.id,
      isAdmin: userData.isAdmin,
      lastName: userData.lastName,
      firstName: userData.firstName,
      email: userData.email
    },
    JWT_SIGN_SECRET,
    {
      expiresIn: '1h'
    })
  },
  parseAuthorization: function(authorization) {
    return (authorization != null) ? authorization.replace('Bearer ', '') : null;
  },
  getUserId: function(authorization) {
    let idUSERS = -1;
    let token = module.exports.parseAuthorization(authorization);
    if(token != null) {
      try {
        let jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
        if(jwtToken != null)
          idUSERS = jwtToken.idUSERS;
      } catch(err) { console.log(err)}
    }
    return idUSERS;
  }
}