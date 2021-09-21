const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  fullname: { type: String },
  username: { type: String, unique: true },
  emailAddress: { type: String, unique: true },
  phone: { type: String, unique: true },
  password: String,
  accountDetails: {},
  subAccountDetails: {},
  downloadToken: String,
  downloadExpiry: String,
  noOfProjectsSold: Number,
  isAdmin: { type: Boolean, default: false },
});

userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);

module.exports = User;
