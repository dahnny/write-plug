const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema({
    projectUserEmail: String,
    token: String,
    projectId:String
});

const Download = new mongoose.model('Download', downloadSchema);

module.exports = Download;