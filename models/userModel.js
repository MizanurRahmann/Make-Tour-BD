const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "A user must have a name."],
    },
    email: {
        type: String,
        required: [true, "A user must have a email."],
        validate: [validator.isEmail, 'Please provide a valid email.'],
        unique: true,
        lowercase: true,
    },
    photo: String,
    password: {
        type: String,
        required: [true, "Please provide a password."],
        maxlength: [6, 'Password should be greater than 6 character.']
    },
    confirmPassword: {
        type: String,
        required: [true, "Please confirm your password."],
    }
})

const User = mongoose.model("User", userSchema);

module.exports = User;