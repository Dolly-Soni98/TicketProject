const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../../config/param-validation');
const userCtrl = require('../../Controllers/users/user.controller');
const config = require('../../../config/config');
const expressJwt = require('express-jwt');
const router = express.Router(); // eslint-disable-line new-cap


  
router.route('/')
  /** GET /api/users - Get list of users */
  .get(expressJwt({ secret: config.jwtSecret }),userCtrl.list)

  /** POST /api/users - Create new user */
  .post(validate(paramValidation.createUser), userCtrl.create);

router.route('/login')
  .post(validate(paramValidation.login), userCtrl.login);

  router.route('/myTickets')
  .get(expressJwt({ secret: config.jwtSecret }),userCtrl.myTickets);

   router.route('/PurchaseTickets')
  .post(expressJwt({ secret: config.jwtSecret }),validate(paramValidation.createUserTicket), userCtrl.PurchaseTickets);
 

  router.route('/deleteTicket')
  .post(expressJwt({ secret: config.jwtSecret }),userCtrl.deleteTicket);
 

module.exports = router;
