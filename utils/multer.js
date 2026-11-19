const multer = require("multer");
const path = require("path");


// ================================
// STORAGE CONFIGURATION
// ================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, "uploads/");

    },


    filename: (req, file, cb) => {


        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9);


        cb(
            null,
            uniqueName + path.extname(file.originalname)
        );


    }

});




// ================================
// FILE FILTER
// ONLY IMAGE FILES ALLOWED
// ================================


const fileFilter = (req, file, cb) => {


    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ];



    if(
        allowedTypes.includes(file.mimetype)
    ){

        cb(null,true);

    }

    else{

        cb(
            new Error(
                "Only image files (jpg, jpeg, png, webp) are allowed"
            ),
            false
        );

    }


};




// ================================
// MULTER CONFIGURATION
// ================================


const upload = multer({

    storage: storage,


    fileFilter: fileFilter,


    limits: {

        // maximum image size 5MB

        fileSize: 5 * 1024 * 1024,


        // maximum files

        files: 10

    }

});



module.exports = upload;