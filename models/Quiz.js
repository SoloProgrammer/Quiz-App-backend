const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const quizSchema = new Schema({
    "title": {
        type: String,
        required: [true, "Please Provide the title of Questionnaire"],
        trim: true
    },
    "techs": [{
        type: String,
        required: [true, "Please specify the Tech names"],
    }],
    "img": {
        type: String,
        required: true
    },
    "description": {
        type: String,
        required: [true, "Please Provide the description of Questionnaire"],
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
    "slug": {
        type: String,
        required: [true, 'Please Provide the slug of Questionnaire'],
        unique: true
    },
    "timeLimit": {
        hours: {
            type: Number,
            required: true
        },
        minutes: {
            type: Number,
            required: true
        }
    },
    isStarted: [{
        type: mongoose.Types.ObjectId,
        ref: 'users'
    }],
    isSubmitted: [{}]
})

const Quiz = mongoose.model('quizes', quizSchema)

module.exports = Quiz