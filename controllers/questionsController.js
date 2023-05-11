// const questionnaireFullPath = '/opt/render/project/src/JSON/Questionnaire.json'

const { errorRespose, alertResponse } = require('../config/errorStatus');
const User = require('../models/User');
const Questionnaire = require('../models/Questionnaire');
const mongoose = require('mongoose');

const createQuestionnaire = async (req, res) => {

    try {
        let { title, description, each_point, questionnaire_id, timeLimit } = req.body;

        if (!title) return alertResponse(res, "Please provide the title of the Questionnaire!")
        if (!description) return alertResponse(res, "Please provide the description of the Questionnaire!")
        if (!each_point) return alertResponse(res, "Please provide the points per question of the Questionnaire!")
        if (!questionnaire_id) return alertResponse(res, "Please provide the questionnaire_id of the Questionnaire!")
        if (!timeLimit) return alertResponse(res, "Please provide the timeLimit of the Questionnaire!")

        const questionnaire = await new Questionnaire({ ...req.body, createdBy: req.user._id }).save();

        res.send(questionnaire)
    } catch (error) {
        return errorRespose(res, false, error)
    }

}

const addQuestion = async (req, res) => {

    try {
        const { questionnaire_id } = req.params

        let { question, category, options, correctAnswers } = req.body;

        if (!question) return alertResponse(res, "Please provide the question")
        if (!category) return alertResponse(res, "Please provide the category of the question")
        if (options.length < 4) return alertResponse(res, "Please provide 4 options")
        if (!correctAnswers.length) return alertResponse(res, "Please provide the correctAnswers")

        const optionsObjArray = []
        options.forEach((option, i) => {
            let opt = {}
            opt.id = i + 1
            opt.option = option
            optionsObjArray.push(opt)
        })

        const questionObj = {
            question, category, options: optionsObjArray, correctAnswers, comments: []
        }

        const updatedQuestionnaire = await Questionnaire.findByIdAndUpdate(questionnaire_id, { $push: { questions: questionObj } }, { new: true });

        let questions = updatedQuestionnaire.questions;

        questions = questions.map(q => {
            delete q.correctAnswers
            return q
        });

        updatedQuestionnaire.questions = questions

        res.json({ status: true, message: "Question added successfully", updatedQuestionnaire })
    } catch (error) {
        return errorRespose(res, false, error)
    }
}

const getQuestionnaire = async (req, res) => {

    try {
        const { questionnaire_id } = req.params

        let questionnaire = await Questionnaire.findOne({ questionnaire_id });

        let questions = questionnaire.questions;

        questions = questions.map(q => {
            delete q.correctAnswers
            return q
        });

        questionnaire.questions = questions

        res.json({ questionnaire, status: true })

    } catch (error) {
        return errorRespose(res, false, error)
    }

}

const comment = async (req, res) => {

    try {
        const { comment } = req.body
        const { qId, questionnaire_id } = req.params

        const user = await User.findById(req.user._id)

        const commentObj = {
            comment, user: user.name, uId: user._id
        }

        let ObjectqId = new mongoose.Types.ObjectId(qId)

        let questionnaire = await Questionnaire.findOne({ questionnaire_id });

        let commentsByQueId = questionnaire.questions.filter(q => { if (String(q._id) === String(ObjectqId)) return q })[0].comments;

        if (commentsByQueId.map(comm => String(comm.uId)).includes(String(user._id))) {

            let commentObj = commentsByQueId.filter(comm => String(comm.uId) === String(user._id))[0]
            await Questionnaire.updateOne({ questionnaire_id, "questions._id": ObjectqId }, { $pull: { "questions.$.comments": commentObj } })
        }

        await Questionnaire.updateOne({ questionnaire_id, "questions._id": ObjectqId }, { $push: { "questions.$.comments": commentObj } })

        let updatedQuestionnaire = await Questionnaire.findOne({ questionnaire_id })

        let questions = updatedQuestionnaire.questions;

        questions = questions.map(q => {
            delete q.correctAnswers
            return q
        });

        updatedQuestionnaire.questions = questions

        res.json({ status: true, updatedQuestionnaire })

    } catch (error) {
        return errorRespose(res, false, error)
    }
}

const submitTest = async (req, res) => {

    try {
        let { selectedOptionsbyQue } = req.body;
        const { questionnaire_id } = req.params

        let questionnaire = await Questionnaire.findOne({ questionnaire_id });

        let questions = questionnaire.questions

        console.log(selectedOptionsbyQue);

        // console.log(selectedOptionsbyQue,questions);

        let score = 0;
        Object.keys(selectedOptionsbyQue).map(qId => {   // qId :- questionId

            // console.log(k,questions.filter(q => q.id === parseInt(k)));
            // console.log((questions.filter(q => q.id === parseInt(k))[0]));


            // console.log("------------------", questions.filter(q => q.id === parseInt(qId)));

            const correctAnswersbyQueId = questions.filter(q => String(q._id) === qId)[0].correctAnswers
            let count = 0;

            // console.log("...", correctAnswersbyQueId);

            if (correctAnswersbyQueId.length === selectedOptionsbyQue[qId].length) {
                selectedOptionsbyQue[qId].forEach(ans => {
                    if (correctAnswersbyQueId.indexOf(ans) !== -1) {
                        count++
                    }
                    if (count === correctAnswersbyQueId.length) {
                        score += questionnaire.each_point
                    }
                })
            }
        })

        await User.findByIdAndUpdate(req.user._id, { score, isSubmitted: true }, { new: true });
        res.status(200).json({ status: true, message: "Your Test has been submitted", score })


    } catch (error) {
        return errorRespose(res, false, error)
    }
}

module.exports = { getQuestionnaire, comment, submitTest, createQuestionnaire, addQuestion }
