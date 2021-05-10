const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    title : String,
    description: String
});

const Category = new mongoose.model('Category', categorySchema);

module.exports = {Category, categorySchema};