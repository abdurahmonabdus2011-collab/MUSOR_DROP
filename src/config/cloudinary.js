const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'uzamr3pe',
    api_key: process.env.CLOUDINARY_API_KEY || '954342841228186',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'ePk0-PyZbG778pRX-ziOHX1Wtd0',
    secure: true
});

module.exports = cloudinary;
