const mongoose = require('mongoose')

const QuestionnaireSchema = new mongoose.Schema({
    "question": { type: String, required: true },
    "quizId": {
        type: mongoose.Types.ObjectId,
        ref: "quiz"
    },
    "comments": [],
    "category": {
        type: String,
        required: true
    },
    "options": [],
    "correctAnswers": []
})


const Questionnaire = mongoose.model('questionnaire', QuestionnaireSchema);
module.exports = Questionnaire

