// const questionnaireFullPath = '/opt/render/project/src/JSON/Questionnaire.json'

const { errorRespose, alertResponse } = require('../config/errorStatus');
const User = require('../models/User');
const Questionnaire = require('../models/Questionnaire');
const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');

const createQuestionnaire = async (req, res) => {

    try {
        let { title, description, each_point, slug, timeLimit } = req.body;

        if (!title) return alertResponse(res, "Please provide the title of the Questionnaire!")
        if (!description) return alertResponse(res, "Please provide the description of the Questionnaire!")
        if (!each_point) return alertResponse(res, "Please provide the points per question of the Questionnaire!")
        if (!slug) return alertResponse(res, "Please provide the slug of the Questionnaire!")
        if (!timeLimit) return alertResponse(res, "Please provide the timeLimit of the Questionnaire!")

        const questionnaire = await new Questionnaire({ ...req.body, createdBy: req.user._id }).save();

        res.send(questionnaire)
    } catch (error) {
        return errorRespose(res, false, error)
    }

}

const addQuestion = async (req, res) => {

    try {
        const { quizId } = req.params

        let { question, category, options, correctAnswers } = req.body;

        if (!quizId) return alertResponse(res, "Please provide the quizId with the request params")
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
            question, category, options: optionsObjArray, correctAnswers, comments: [], quizId
        }

        const createdQuestion = await new Questionnaire(questionObj).save()

        res.json({ status: true, message: "Question added successfully", createdQuestion })

    } catch (error) {
        return errorRespose(res, false, error)
    }
}

const getQuestionnaire = async (req, res) => {

    try {
        let { quizId } = req.params

        let questions = await Questionnaire.find({ quizId });

        if (!questions) return res.json([])

        // await Quiz.findByIdAndUpdate(quizId, { $addToSet: { isStarted: req.user._id } })

        // Removing correctAnswers from the Questionnaire before sending to the client

        questions = questions.map(q => {
            let Copyq = q.toObject()
            delete Copyq.correctAnswers
            return Copyq
        });

        res.json({ questions, status: true })

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
            comment, user: user.name, uId: user._id, comm_id: Date.now()
        }

        let ObjectqId = new mongoose.Types.ObjectId(qId)

        let questionnaire = await Questionnaire.findOne({ questionnaire_id });

        // let commentsByQueId = questionnaire.questions.filter(q => { if (String(q._id) === String(ObjectqId)) return q })[0].comments;

        let commentsByQueId = questionnaire.questions.filter(q => String(q._id) === String(ObjectqId))[0].comments;

        if (commentsByQueId.map(comm => String(comm.uId)).includes(String(user._id))) {

            let commentObj = commentsByQueId.filter(comm => String(comm.uId) === String(user._id))[0]
            await Questionnaire.updateOne({ questionnaire_id, "questions._id": ObjectqId }, { $pull: { "questions.$.comments": commentObj } })
        }

        await Questionnaire.updateOne({ questionnaire_id, "questions._id": ObjectqId }, { $push: { "questions.$.comments": commentObj } })

        let updatedQuestionnaire = await Questionnaire.findOne({ questionnaire_id })

        // Removing correctAnswers from the Questionnaire before sending to the client

        let questions = updatedQuestionnaire.questions.toObject();

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


module.exports = { getQuestionnaire, comment, createQuestionnaire, addQuestion }
