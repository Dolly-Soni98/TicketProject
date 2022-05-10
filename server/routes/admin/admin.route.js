const express = require('express');
const validate = require('express-validation');
const config = require('../../../config/config');
const expressJwt = require('express-jwt');
const paramValidation = require('../../../config/param-validation');
const adminCtrl = require('../../Controllers/admin/admin.controller');
const userCtrl = require('../../Controllers/users/user.controller');


//module.exports=function(app)
/* {
  post('/tickets',adminCtrl.tickets)
} */
const router = express.Router(); // eslint-disable-line new-cap


router.route('/')
  /** GET /api/admin - Get list of users */
  .get(adminCtrl.list)

 
  router.route('/tickets')
  .post(expressJwt({ secret: config.jwtSecret }), adminCtrl.tickets)

  router.route('/login')
  .post(validate(paramValidation.login), adminCtrl.login)

 

module.exports = router;
