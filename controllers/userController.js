const { BadRespose, errorRespose } = require('../config/errorStatus')
const genToken = require('../config/generateToken')

const User = require('../models/User')

const createUser = async (req, res) => {

    const { name, email } = req.body

    if (!name) return BadRespose(res, false, "Name is manditory")
    if (!email) return BadRespose(res, false, "Email is manditory")

    try {
        const user = await User.findOne({ email });

        let token;
        let status = true;
        if (user) {
            token = genToken(user._id);
            res.status(200).json({ user, token, status, userExists: true })
        }
        else {
            let newUser = await new User({ ...req.body, isStarted: true }).save()

            token = genToken(newUser._id)

            res.status(201).json({ newUser, token, status })
        }
    } catch (error) {
        return errorRespose(res, false, error)
    }
}

const getUser = async (req, res) => {
    try {
        const user = await User.findOne(req.user._id);
        res.status(200).json({ user, status: true })
    } catch (error) {
        errorRespose(res, false, error)
    }
}

module.exports = { getUser, createUser }