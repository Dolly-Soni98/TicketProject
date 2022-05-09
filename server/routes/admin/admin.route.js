const express = require('express');
const validate = require('express-validation');
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

router.route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(userCtrl.get)


  router.post('/tickets',adminCtrl.tickets)

  router.route('/login')
  .post(validate(paramValidation.login), adminCtrl.login)

  /** DELETE /api/users/:userId - Delete user */
  .delete(userCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);



module.exports = router;
