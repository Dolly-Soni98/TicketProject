const express = require('express');
const userRoutes = require('./server/routes/users/user.route');
const adminRoutes = require('./server/routes/admin/admin.route');
const authRoutes = require('./server/auth/auth.route');

const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /users
router.use('/0.0/app/users', userRoutes);
router.use('/0.0/admin', adminRoutes);


// mount auth routes at /auth
router.use('/auth', authRoutes);

module.exports = router;
