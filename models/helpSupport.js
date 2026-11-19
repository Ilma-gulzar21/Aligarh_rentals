const mongoose = require("mongoose");

const supportRequestSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 80
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },

        category: {
            type: String,
            required: true,
            enum: [
                "Account & Login",
                "Property Listing",
                "Property Search",
                "Roommate & Flatmate",
                "Technical Issue",
                "Other"
            ]
        },

        subject: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150
        },

        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000
        },

        status: {
            type: String,
            enum: ["Pending", "In Progress", "Resolved"],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "SupportRequest",
    supportRequestSchema
);