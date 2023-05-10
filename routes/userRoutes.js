const express = require('express');
const { createUser, getUser } = require('../controllers/userController');
const authorize = require('../middlewares/authorization');

const router = express.Router()

router.route('/').get(authorize,getUser).post(createUser)

module.exports = router