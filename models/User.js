const mongoose = require('mongoose')
const { genSalt, hash, compare } = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dvzjzf36i/image/upload/v1679814483/wxrvucwq93ovrswfpsk3.png",
    },
    techInt: [],
    badges: [{
        badge: {
            type: String
        },
        quiz: {
            type: mongoose.Types.ObjectId,
            ref: 'questionnaire'
        }
    }],
    score: {},
}, { timestamps: true });

UserSchema.methods.comparePassword = async function (enteredPass) {
    return compare(enteredPass, this.password)
}

UserSchema.pre('save', async function (next) {
    let saltLen = 10
    if (!this.isModified) next()

    const salt = await genSalt(saltLen);
    this.password = await hash(this.password, salt)
})

const User = mongoose.model('users', UserSchema);
module.exports = User