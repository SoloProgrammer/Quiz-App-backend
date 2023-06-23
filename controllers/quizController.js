const { alertResponse, errorRespose } = require('../config/errorStatus');
// const Quiz = require('../models/Quiz');
const Quiz = require('../models/Quiz')

const addQuiz = async (req, res) => {

    try {
        let { title, description, each_point, slug, timeLimit, techs, img } = req.body;

        if (!title) return alertResponse(res, "Please provide the title of the Quiz!")
        if (!description) return alertResponse(res, "Please provide the description of the Quiz!")
        if (!each_point) return alertResponse(res, "Please provide the points per question of the Quiz!")
        if (!slug) return alertResponse(res, "Please provide the slug of the Quiz!")
        if (!timeLimit) return alertResponse(res, "Please provide the timeLimit of the Quiz!")
        if (!techs.length) return alertResponse(res, "Please provide the Technologies of which questions are asked in the Quiz!")
        if (!img) return alertResponse(res, "Please provide the image of the Quiz!")

        let createdQuiz = await new Quiz({ ...req.body, createdBy: req.user._id }).save();

        res.status(201).json({ staus: true, message: "Quiz created successfully!", createdQuiz })
    } catch (error) {
        return errorRespose(res, false, error)
    }
}

const quizes = async (req, res) => {

    try {
        let size = await Quiz.find({}).count()
        let data = await Quiz.aggregate([
            {
                $sample: { size }
            }
        ])

        data.forEach(d => {
            delete d.createdBy
        })

        res.json({ status: true, data })
    } catch (error) {
        return errorRespose(res, false, error)
    }

}

const quiz = async (req, res) => {

    try {

        let { slug } = req.params

        let quiz = await Quiz.findOne({ slug })

        let quizCopy = quiz.toObject() // created deep copy of the quiz data tro remove createdBy field from the data

        delete quizCopy.createdBy

        res.json({ status: true, data: quizCopy })

    } catch (error) {
        return errorRespose(res, false, error)
    }

}

module.exports = { addQuiz, quizes, quiz }