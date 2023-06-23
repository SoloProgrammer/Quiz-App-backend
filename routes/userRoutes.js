const express = require('express');
const { createUser, getUser, authenticateUser } = require('../controllers/userController');
const authorize = require('../middlewares/authorization');

const router = express.Router()

router.route('/').get(authorize, getUser).post(createUser)
router.post('/auth', authenticateUser)

module.exports = router