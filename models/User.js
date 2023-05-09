const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        unique:true
    },
    score: {
        type: Number,
        default:0
    },
    isStarted: {
        type: Boolean,
        default: false
    },
    isSubmitted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const user = mongoose.model('users', UserSchema);
module.exports = user