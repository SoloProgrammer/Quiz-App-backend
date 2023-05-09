const express = require('express');
const { createUser, getUser, submitTest } = require('../controllers/userController');
const authorize = require('../middlewares/authorization');

const router = express.Router()

router.route('/').get(authorize,getUser).post(createUser)
router.put('/submit',authorize,submitTest)

module.exports = router