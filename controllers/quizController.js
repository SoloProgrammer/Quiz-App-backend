const { alertResponse, errorRespose } = require('../config/errorStatus');
const Questionnaire = require('../models/Questionnaire');
const Quiz = require('../models/Quiz');
const User = require('../models/User');

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

const submitQuiz = async (req, res) => {

    try {
        let { selectedOptionsbyQue } = req.body;
        const { quizId } = req.params

        let questions = await Questionnaire.find({ quizId });

        const quiz = await Quiz.findById(quizId);

        // console.log(selectedOptionsbyQue);

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
                        score += quiz.each_point
                    }
                })
            }
        })

        const scoreObj = {
            [quizId]: score
        }
        let badge = (score === 100 && "gold" || score === 90 && "silver" || score === 80 && "bronze")

        if (badge) {
            const badgeObj = {
                badge,
                quiz: quizId
            }
            await User.findByIdAndUpdate(req.user._id, { $push: { badges: badgeObj } }, { new: true });
        }

        let user = await User.findByIdAndUpdate(req.user._id, { $push: { score: scoreObj } }, { new: true }).select('-password');

        res.status(200).json({ status: true, message: "Your Quiz Has Been Submitted!", score, user })


    } catch (error) {
        return errorRespose(res, false, error)
    }
}

module.exports = { addQuiz, quizes, quiz, submitQuiz }