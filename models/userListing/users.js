const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default;


const userSchema = new mongoose.Schema(
{

    // BASIC DETAILS
    fullName: {

        type: String,

        required: [
            true,
            "Please enter your full name."
        ],

        trim: true,

        minlength: [
            3,
            "Name must be at least 3 characters."
        ],

        maxlength: [
            50,
            "Name cannot exceed 50 characters."
        ],
    },


    email: {

        type: String,

        required: [
            true,
            "Please enter your email."
        ],

        unique: true,

        lowercase: true,

        trim: true,
    },


    phone: {

        type: String,

        required: [
            true,
            "Please enter your phone number."
        ],

        unique: true,

        trim: true,

        match: [
            /^[6-9]\d{9}$/,
            "Please enter a valid 10 digit mobile number."
        ],
    },


    // USER TYPE
    role: {

        type: String,

        enum: {

            values: [
                "Owner",
                "Tenant"
            ],

            message: "Invalid user role."
        },

        default: "Tenant",
    },


    // PROFILE IMAGE
    profileImage: {

        url: {

            type: String,

            default: "",
        },


        filename: {

            type: String,

            default: "",
        },

    },


    // ACCOUNT STATUS
    isActive: {

        type: Boolean,

        default: true,
    },


    lastLogin: {

        type: Date,

        default: null,
    },


},
{
    timestamps:true
});



// Passport Login
userSchema.plugin(
    passportLocalMongoose,
    {
        usernameField:"email"
    }
);



const User = mongoose.model(
    "User",
    userSchema
);


module.exports = User;