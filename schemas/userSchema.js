const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


const userSchema = new mongoose.Schema({
    username : {type: String, unique: true},
    emailAddress: {type:String, unique:true},
    password:String,   
    accountDetails: {},
    subAccountDetails: {}
});

userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model('User', userSchema);

module.exports = User;