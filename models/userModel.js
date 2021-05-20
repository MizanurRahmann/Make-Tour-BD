const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
        minlength: [6, 'Password should be greater than 6 character.']
    },
    confirmPassword: {
        type: String,
        required: [true, "Please confirm your password."],
        validate: {
            validator: function(el) { return el === this.password; },
            message: 'Passwords should be matched.'
        }
    }
});

userSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if(!this.isModified('password')) return next();

    // Hash the password with cost 12 and delete confirmPasswor
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;