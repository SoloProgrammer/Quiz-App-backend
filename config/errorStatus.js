const errorRespose = (res, status, error) => {
    return res.status(400).json({ status, badMsg: "Some error occured please try again later!", error: error.message })
}
const BadRespose = (res, status, msg) => {
    return res.status(400).json({ status, badMsg: msg })
}

const alertResponse = (res, message) => {
    res.json({ status: false, message: message })
}

module.exports = { errorRespose, BadRespose, alertResponse }