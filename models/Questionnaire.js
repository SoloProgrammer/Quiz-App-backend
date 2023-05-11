const mongoose = require('mongoose')

const QuestionnaireSchema = new mongoose.Schema({
    "title": {
        type: String,
        required: [true,"Please Provide the title of Questionnaire"],
        trim: true
    },
    "description": {
        type: String,
        required: [true,"Please Provide the description of Questionnaire"],
        trim: true
    },
    "createdBy": {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true
    },
    "each_point": {
        type: Number
    },
    "questionnaire_id": {
        type: String,
        required: [true,'Please Provide the questionnaire_id of Questionnaire'],
        unique: true
    },
    "questions": [{
        "question": { type: String, required:true },
        "comments": [],
        "category": {
            type: String,
            required: true
        },
        "options": [],
        "correctAnswers": []
    }],
    "timeLimit": {
        hours: {
            type: Number,
            required: true
        },
        minutes: {
            type: Number,
            required: true
        }
    }
})


const Questionnaire = mongoose.model('questionnaire', QuestionnaireSchema);
module.exports = Questionnaire