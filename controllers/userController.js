const { BadRespose, errorRespose } = require('../config/errorStatus')
const genToken = require('../config/generateToken')

const User = require('../models/User')

const createUser = async (req, res) => {

    const { name, email, techInt, password } = req.body
    let status = true;

    if (!name || !email || !password || !techInt.length) {
        return BadRespose(res, !status, "All feilds are required!")
    }

    try {
        const user = await User.findOne({ email });

        let token;

        if (user) return BadRespose(res, !status, "User with this email already our member, Please try with diffrent email")

        let newUser = await new User({ ...req.body }).save()

        newUser = await User.findById(newUser._id).select('-password')

        token = genToken(newUser._id)

        res.status(201).json({ newUser, token, status, message: `Welcome ${name} We've created your account successfully 🎉` })

    } catch (error) {
        return errorRespose(res, false, error)
    }
}

const authenticateUser = async (req, res) => {
    try {
        const { email, password } = req.body
        
        if (!email || !password) return BadRespose(res, false, "All fields are required")

        let [user] = await User.find({ email })

        if (!user) return BadRespose(res, false, "User with this email not found, please create an account!")

        if (!(await user.comparePassword(password))) return BadRespose(res, false, 'Incorrect password!')

        user = await User.findById(user._id).select('-password')

        const token = genToken(user._id)

        res.status(200).json({ status: true, message: `Login successfull, Welcome ${user.name} 👋`, token, user })
    } catch (error) {
        return errorRespose(res, false, error)
    }

}

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json({ user, status: true })
    } catch (error) {
        errorRespose(res, false, error)
    }
}

module.exports = { getUser, createUser, authenticateUser }