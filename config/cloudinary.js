require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY || process.env.CLOUD_API_KEY || process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET || process.env.CLOUD_API_SECRET || process.env.CLOUDINARY_SECRET
});

// Verification check
if (!cloudinary.config().cloud_name) {
    console.error("Cloudinary Error: Cloud name nahi mila! Apni .env file check karein.");
} else {
    console.log("Cloudinary Configured Successfully with:", cloudinary.config().cloud_name);
}

module.exports = cloudinary;
