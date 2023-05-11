const router = require('express').Router()
const { getQuestionnaire, comment, submitTest, createQuestionnaire, addQuestion } = require('../controllers/questionsController');
const authorize = require('../middlewares/authorization');

router.post('/questionnaire', authorize, createQuestionnaire)
router.get('/questionnaire/:questionnaire_id', authorize, getQuestionnaire)
router.put('/addquestion/:questionnaire_id', authorize, addQuestion)
router.put('/question/:qId/comment/:questionnaire_id', authorize, comment)
router.put('/submit/:questionnaire_id', authorize, submitTest)

module.exports = router