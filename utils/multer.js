const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// =====================================
// CLOUDINARY STORAGE
// =====================================

const storage = new CloudinaryStorage({
    cloudinary,

    params: async (req, file) => {
        return {
            folder: "aligarh-rentals/properties",

            allowed_formats: [
                "jpg",
                "jpeg",
                "png",
                "webp"
            ],

            public_id:
                Date.now() +
                "-" +
                Math.round(Math.random() * 1E9)
        };
    }
});

// =====================================
// FILE FILTER
// =====================================

const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only image files (jpg, jpeg, png, webp) are allowed"
            ),
            false
        );
    }
};

// =====================================
// MULTER CONFIGURATION
// =====================================

const upload = multer({
    storage,
    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 10
    }
});

module.exports = upload;
