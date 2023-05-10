const router = require('express').Router()
const { getQuestionnaire, comment, submitTest } = require('../controllers/questionsController');
const authorize = require('../middlewares/authorization');


router.get('/questions', authorize, getQuestionnaire)
router.put('/question/:qId/comment', authorize, comment)
router.put('/submit',authorize,submitTest)

module.exports = router