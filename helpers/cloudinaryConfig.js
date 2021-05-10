var cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'writeplug',
    api_key: '762372335622978',
    api_secret: process.env.CLOUDINARY_SECRET
});

module.exports = cloudinary;