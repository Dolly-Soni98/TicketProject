const express = require('express');
const userRoutes = require('./server/routes/users/user.route');
const adminRoutes = require('./server/routes/admin/admin.route');

const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

// mount user routes at /users
router.use('/0.0/app/users', userRoutes);
router.use('/0.0/admin', adminRoutes);



module.exports = router;
