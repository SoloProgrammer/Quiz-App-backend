// const path = require('path')

const questionnaireFullPath = '/opt/render/project/src/JSON/Questionnaire.json'
// const questionnaireFullPath = '/Quiz-App/BackEnd/JSON/Questionnaire.json'
const { writeFile, readFile } = require("fs");
const { errorRespose, BadRespose } = require('../config/errorStatus');
const User = require('../models/User');

const getQuestionnaire = async (req, res) => {

    try {
        readFile(questionnaireFullPath, async (err, questionnaireBuffer) => {

            if (err) return BadRespose(res, false, err.message)

            let questionnaire = JSON.parse(questionnaireBuffer)
            let questions = questionnaire.questions;

            questions = questions.map(q => {
                delete q.correctAnswers
                return q
            });

            questionnaire.questions = questions

            res.json({ questionnaire , status: true })
        })
    } catch (error) {
        return errorRespose(res, false, error)
    }

}

const comment = async (req, res) => {

    const { comment } = req.body
    const { qId } = req.params

    try {

        readFile(questionnaireFullPath, async (err, questionnaireBuffer) => {

            if (err) return BadRespose(res, false, err.message)

            const user = await User.findById(req.user._id);

            // console.log(user._id);

            let questionnaire = JSON.parse(questionnaireBuffer)
            let questions = questionnaire.questions;

            questions = questions.map(q => {
                if (q.id === parseInt(qId)) {
                    if (q.comments.length > 0) {
                        // console.log(q.comments,typeof String(user._id), typeof q.comments[0].uId);
                        if (q.comments.map(comm => comm.uId).includes(String(user._id))) {
                            q.comments = q.comments.filter(comm => comm.uId !== String(user._id))
                            // console.log("......................................", q.comments);
                        }
                    }
                    q.comments.push({ user: user.name, uId: user._id, comment })
                }
                return q;
            })

            questionnaire.questions = questions

            writeFile(questionnaireFullPath, JSON.stringify(questionnaire, null, 2), (err) => {
                if (err) {
                    console.log("Failed to write updated data to questionnaireData file");
                    return;
                }
                console.log("Updated questionnaireData file successfully");
            })

            // removing correctAnswer array before sending to the client......

            questions = [...questionnaire.questions];

            questions = questions.map(q => {
                delete q.correctAnswers
                return q
            });

            questionnaire.questions = questions

            res.status(200).json({ status: true, updatedQuestionnaire: questionnaire })

        })


    } catch (error) {
        return errorRespose(res, false, error)
    }
}

const submitTest = async (req, res) => {

    try {

        readFile(questionnaireFullPath, async (err, questionnaireBuffer) => {

            if (err) return BadRespose(res, false, err.message)

            if (err) throw Error("Error reading the file: ", err.message)

            let { selectedOptionsbyQue } = req.body;

            let questionnaire = JSON.parse(questionnaireBuffer)

            let questions = questionnaire.questions

            // console.log(selectedOptionsbyQue,questions);

            let score = 0;
            Object.keys(selectedOptionsbyQue).map(qId => {   // qId :- questionId

                // console.log(k,questions.filter(q => q.id === parseInt(k)));
                // console.log((questions.filter(q => q.id === parseInt(k))[0]));


                // console.log("------------------", questions.filter(q => q.id === parseInt(qId)));

                const correctAnswersbyQueId = questions.filter(q => q.id === parseInt(qId))[0].correctAnswers
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

        })
    } catch (error) {
        return errorRespose(res, false, error)
    }
}

module.exports = { getQuestionnaire, comment, submitTest }
