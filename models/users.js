const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const { Schema } = mongoose

usersSchema = new Schema({
    username: String,
    email: String,
    password: String
})

usersSchema.plugin(passportLocalMongoose, {usernameField:'email'});

const users = new mongoose.model("User", usersSchema)

module.exports = users