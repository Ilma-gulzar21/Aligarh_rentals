const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const roommateSchema = new Schema({

    /* ======================================================
       USER WHO CREATED ROOMMATE POST
    ====================================================== */

    postedBy: {

        type: Schema.Types.ObjectId,

        ref: "User",

        required: [
            true,
            "Roommate post creator is required."
        ]

    },


    /* ======================================================
       POST DETAILS
    ====================================================== */

    title: {

        type: String,

        required: [
            true,
            "Please enter post title."
        ],

        trim: true,

        minlength: [
            5,
            "Title must contain at least 5 characters."
        ],

        maxlength: [
            100,
            "Title cannot exceed 100 characters."
        ]

    },


    description: {

        type: String,

        required: [
            true,
            "Please enter description."
        ],

        trim: true,

        minlength: [
            10,
            "Description must contain at least 10 characters."
        ],

        maxlength: [
            1500,
            "Description cannot exceed 1500 characters."
        ]

    },


    /* ======================================================
       PROPERTY IMAGES
    ====================================================== */

    images: {

        type: [

            {

                filename: {

                    type: String,

                    default: "default.jpg"

                },


                url: {

                    type: String,

                    default:
                    "https://images.unsplash.com/photo-1560518883-ce09059eeffa"

                }

            }

        ],

        default: []

    },


    /* ======================================================
       LOCATION
    ====================================================== */

    area: {

        type: String,

        required: true,

        trim: true

    },


    fullAddress: {

        type: String,

        required: true,

        trim: true

    },


    city: {

        type: String,

        default: "Aligarh",

        enum: [
            "Aligarh"
        ]

    },


    /* ======================================================
       RENT DETAILS
    ====================================================== */

    rentPerPerson: {

        type: Number,

        required: true,

        min: [
            500,
            "Rent must be at least ₹500."
        ]

    },


    securityDeposit: {

        type: Number,

        default: 0,

        min: [
            0,
            "Security deposit cannot be negative."
        ]

    },


    /* ======================================================
       PROPERTY DETAILS
    ====================================================== */

    propertyType: {

        type: String,

        required: true,

        enum: [
            "Room",
            "Flat",
            "House",
            "Apartment",
            "PG"
        ]

    },


    furnishing: {

        type: String,

        required: true,

        enum: [
            "Furnished",
            "Semi Furnished",
            "Unfurnished"
        ]

    },


    /* ======================================================
       CURRENT ROOMMATES
    ====================================================== */

    currentRoommates: {

        type: [

            {

                name: {

                    type: String,

                    required: true,

                    trim: true

                },


                age: {

                    type: Number,

                    min: [
                        18,
                        "Age must be at least 18."
                    ]

                },


                gender: {

                    type: String,

                    enum: [
                        "Male",
                        "Female"
                    ]

                },


                occupation: {

                    type: String,

                    trim: true,

                    default: ""

                }

            }

        ],

        default: []

    },


    /* ======================================================
       ROOMMATE REQUIREMENT
    ====================================================== */

    roommatesNeeded: {

        type: Number,

        required: true,

        min: [
            1,
            "At least one roommate is required."
        ]

    },


    preferredGender: {

        type: String,

        required: true,

        enum: [
            "Male",
            "Female",
            "Anyone"
        ]

    },


    ageRange: {

        min: {

            type: Number,

            min: 18

        },


        max: {

            type: Number

        }

    },


    /* ======================================================
       AVAILABILITY
    ====================================================== */

    availableFrom: {

        type: Date,

        required: true

    },


    /* ======================================================
       POST STATUS
    ====================================================== */

    status: {

        type: String,

        enum: [
            "Open",
            "Filled",
            "Closed"
        ],

        default: "Open"

    },


    /* ======================================================
       VIEWS
    ====================================================== */

    views: {

        type: Number,

        default: 0,

        min: [
            0,
            "Views cannot be negative."
        ]

    }


},
{
    timestamps: true
});


const Roommate = mongoose.model(
    "Roommate",
    roommateSchema
);


module.exports = Roommate;