const router = require('express').Router();

const userRoutes = require('./user-router');
const thoughtRoutes = require('./thought-router');

router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

module.exports = router;