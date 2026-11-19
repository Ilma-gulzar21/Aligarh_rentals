const mongoose = require("mongoose");


const reviewSchema = new mongoose.Schema({

    /* ======================================================
       REVIEW TITLE
    ====================================================== */

    title: {

        type: String,

        trim: true,

        minlength: [
            3,
            "Review title must be at least 3 characters long."
        ],

        maxlength: [
            80,
            "Review title cannot exceed 80 characters."
        ],

        default: "Untitled Review"

    },


    /* ======================================================
       PROPERTY REFERENCE
    ====================================================== */

    listing: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Listing",

        required: [
            true,
            "Review must belong to a property."
        ]

    },


    /* ======================================================
       USER REFERENCE
    ====================================================== */

    user: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: [
            true,
            "User is required to submit a review."
        ]

    },


    /* ======================================================
       RATING
    ====================================================== */

    rating: {

        type: Number,

        required: [
            true,
            "Please select a rating."
        ],

        min: [
            1,
            "Rating must be at least 1 star."
        ],

        max: [
            5,
            "Rating cannot be more than 5 stars."
        ],

        validate: {

            validator: Number.isInteger,

            message: "Rating must be a whole number."

        }

    },


    /* ======================================================
       REVIEW COMMENT
    ====================================================== */

    comment: {

        type: String,

        required: [
            true,
            "Please write your review."
        ],

        trim: true,

        minlength: [
            3,
            "Review must contain at least 3 characters."
        ],

        maxlength: [
            1000,
            "Review cannot exceed 1000 characters."
        ]

    },


    /* ======================================================
       REVIEW STATUS
       (Admin approval ke liye useful)
    ====================================================== */

    status: {

        type: String,

        enum: {

            values: [
                "Pending",
                "Approved",
                "Rejected"
            ],

            message: "Invalid review status."

        },

        default: "Approved"

    }


}, 
{
    timestamps: true
});



// Agar ek user ek property par sirf ek review de sakta hai
// to isko uncomment kar dena

// reviewSchema.index(
//     {
//         listing: 1,
//         user: 1
//     },
//     {
//         unique: true
//     }
// );



const Review = mongoose.model("Review", reviewSchema);


module.exports = Review;