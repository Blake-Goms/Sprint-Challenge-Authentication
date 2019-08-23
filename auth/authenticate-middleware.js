/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const jwt = require('jsonwebtoken')

const secrets = require('../config/secrets')

module.exports = function restricted(req, res, next) {
  console.log(req.headers)
  const token = req.headers.token;
  if(token) {
    jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
      if(err){
        // token is invalid
        console.log(err)
        res.status(401).json({message: 'invalid token'})
      } else {
        // good token
        req.user = { username: decodedToken.username}
        next();
      }
    })
  } else {
    res.status(400).json({message: 'no token. gimme token'})
  }
};
