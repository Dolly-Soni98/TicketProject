const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
const config = require('../../../config/config');
const User = require('../../models/user.model');


// sample user, used for authentication

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) { 
  // Ideally you'll fetch this from the db
  // Idea here was to show how jwt works with simplicity
  const { email ='jay@gmail.com', password = '4477822353' } = req.query;
  user= User.Byemail({ email, password })
    .then(users => res.json(users))
    .catch(e => next(e));

  console.log(user);
    if (req.body.email === user.email && req.body.password === user.password) {
      const token = jwt.sign({
      email: user.email
    }, config.jwtSecret);  

    return res.json({
      token,
      email: user.email
    });
    
  }  
  
  const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
 return next(user);
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

module.exports = { login, getRandomNumber };
