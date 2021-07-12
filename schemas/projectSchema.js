const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: String,
    preview: String,
    file:String,
    dateCreated: {type: Date, default: Date.now},
    username: String,
    category: String,
    isApproved: {type: Boolean, default: false},
    noOfTimesSold: Number,
});

const Project = new mongoose.model('Project', projectSchema);

module.exports = Project;