const router = require('express').Router()
const { getQuestionnaire, comment, createQuestionnaire, addQuestion } = require('../controllers/questionsController');
const { addQuiz, quizes, quiz, submitQuiz } = require('../controllers/quizController');
const authorize = require('../middlewares/authorization');

router.post('/questionnaire', authorize, createQuestionnaire)
router.get('/quizes', quizes)
router.get('/quiz/:slug', quiz) // get single quiz route
router.post('/quiz', authorize, addQuiz) // add single quiz route
router.get('/questionnaire/:quizId', authorize, getQuestionnaire)
router.put('/addquestion/:quizId', authorize, addQuestion)
router.put('/question/:qId/comment/:questionnaire_id', authorize, comment)
router.put('/quiz/submit/:quizId', authorize, submitQuiz)

module.exports = router