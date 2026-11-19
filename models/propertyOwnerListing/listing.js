const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListingSchema = new Schema({

    /* ======================================================
       OWNER DETAILS
    ====================================================== */

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Owner is required."],
    },

    ownerEmail: {
        type: String,
        required: [true, "Owner email is required."],
        trim: true,
        lowercase: true,
    },

    ownerPhone: {
        type: String,
        required: [true, "Please enter the owner's mobile number."],
        trim: true,
        match: [
            /^[6-9][0-9]{9}$/,
            "Please enter a valid 10-digit Indian mobile number."
        ]
    },

    ownerVerified: {
        type: Boolean,
        default: false,
    },

    responseTime: {
        type: String,
        enum: {
            values: [
                "Within 5 mins",
                "Within 30 mins",
                "Within 1 hour",
                "Within 24 hours",
            ],
            message: "Please select a valid response time.",
        },
        default: "Within 1 hour",
    },


    /* ======================================================
       PROPERTY DETAILS
    ====================================================== */

    title: {
        type: String,
        required: [true, "Please enter the property title."],
        trim: true,
        maxlength: [100, "Property title cannot exceed 100 characters."],
    },

    description: {
        type: String,
        required: [true, "Please enter the property description."],
        maxlength: [2000, "Description cannot exceed 2000 characters."],
    },

    propertyType: {
        type: String,
        required: [true, "Please select the property type."],
        enum: {
            values: [
                "Room",
                "Flat",
                "House",
                "Apartment",
                "PG",
                "Shop",
            ],
            message: "Please select a valid property type.",
        },
    },

    bhk: {
        type: String,
        required: [true, "Please select the BHK type."],
        enum: {
            values: [
                "1 RK",
                "1 BHK",
                "2 BHK",
                "3 BHK",
                "4 BHK",
                "5+ BHK",
            ],
            message: "Please select a valid BHK option.",
        },
    },

    furnishing: {
        type: String,
        required: [true, "Please select the furnishing type."],
        enum: {
            values: [
                "Furnished",
                "Semi Furnished",
                "Unfurnished",
            ],
            message: "Please select a valid furnishing type.",
        },
    },


    /* ======================================================
       PRICE DETAILS
    ====================================================== */

    rentPrice: {
        type: Number,
        required: [true, "Please enter the monthly rent."],
        min: [500, "Monthly rent must be at least ₹500."],
    },

    securityDeposit: {
        type: Number,
        required: [true, "Please enter the security deposit amount."],
        default: 0,
        min: [0, "Security deposit cannot be negative."],
    },

    maintenanceCharge: {
        type: Number,
        required: [true, "Please enter the maintenance charge."],
        default: 0,
        min: [0, "Maintenance charge cannot be negative."],
    },

    electricityIncluded: {
        type: Boolean,
        default: false,
    },


    /* ======================================================
       LOCATION DETAILS
    ====================================================== */

    area: {
        type: String,
        required: [true, "Please enter the area name."],
        trim: true,

        set: (value) => {

            if (!value) return value;

            return value
                .trim()
                .toLowerCase()
                .split(" ")
                .map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                )
                .join(" ");
        }
    },

    fullAddress: {
        type: String,
        required: [true, "Please enter the complete property address."],
        trim: true,
    },

    city: {
        type: String,
        default: "Aligarh",
        required: [true, "City is required."],

        enum: {
            values: ["Aligarh"],
            message: "Only Aligarh properties can be listed.",
        },
    },

    country: {
        type: String,
        default: "India",
    },

    pincode: {
        type: String,
        match: [
            /^[0-9]{6}$/,
            "Please enter a valid 6-digit PIN code.",
        ],
    },

    googleMapLink: {
        type: String,
        trim: true,
    },


    /* ======================================================
       NEARBY LANDMARKS
    ====================================================== */

    nearbyLandmarks: [
        {
            _id: false,

            landmarkName: {
                type: String,
                required: [true, "Please enter the nearby landmark name."],
                trim: true,
            },

            distance: {
                type: Number,
                required: [true, "Please enter the distance from the landmark."],
                min: [0, "Distance cannot be negative."],
            },

            mainlocation: {
                type: String,
                trim: true,
            },

            distanceUnit: {
                type: String,
                default: "km",

                enum: {
                    values: ["km", "m"],
                    message: "Please select a valid distance unit.",
                },
            },
        },
    ],


    /* ======================================================
       BUILDING DETAILS
    ====================================================== */

    floor: {
        type: Number,
        required: [true, "Please enter the floor number."],
        min: [1, "Floor number must be at least 1."],
    },

    totalFloors: {
        type: Number,
        required: [true, "Please enter the total number of floors."],
        min: [1, "Total floors must be at least 1."],
    },


    /* ======================================================
       TENANT PREFERENCE
    ====================================================== */

    preferredTenant: {
        type: String,
        required: [true, "Please select the preferred tenant type."],

        enum: {
            values: [
                "Boys",
                "Girls",
                "Family",
                "Couples",
                "Anyone",
                "Student",
            ],
            message: "Please select a valid preferred tenant.",
        },
    },

    maxOccupants: {
        type: Number,
        required: [true, "Please enter the maximum number of occupants."],
        min: [1, "Maximum occupants must be at least 1."],
    },

    currentOccupants: {
        type: Number,
        default: 0,
        min: [0, "Current occupants cannot be negative."],
    },


    /* ======================================================
       ROOMMATE DETAILS
    ====================================================== */

    roommateAvailable: {
        type: Boolean,
        default: false,
    },

    availableFor: {
        type: String,
        required: [true, "Please select who this property is available for."],

        enum: {
            values: [
                "Student",
                "Family",
                "Roommate",
                "Visitor",
            ],
            message: "Please select a valid availability option.",
        },
    },

    isActive: {
        type: Boolean,
        default: true,
    },

    roommates: [
        {
            _id: false,

            name: {
                type: String,
                trim: true,
            },

            gender: {
                type: String,

                enum: {
                    values: [
                        "Male",
                        "Female",
                    ],
                    message: "Please select a valid gender.",
                },
            },

            age: {
                type: Number,
            },
        },
    ],


    /* ======================================================
       AVAILABILITY DETAILS
    ====================================================== */

    availableFrom: {
        type: Date,
        default: Date.now,
    },


    /* ======================================================
       LEASE DETAILS
    ====================================================== */

    minimumLeaseMonths: {
        type: Number,

        required: [
            true,
            "Please enter the minimum lease duration.",
        ],

        min: [
            1,
            "Minimum lease duration must be at least 1 month.",
        ],

        max: [
            11,
            "Minimum lease duration cannot exceed 11 months.",
        ],
    },

    maximumLeaseMonths: {
        type: Number,

        required: [
            true,
            "Please enter the maximum lease duration.",
        ],

        min: [
            1,
            "Maximum lease duration must be at least 1 month.",
        ],

        max: [
            11,
            "Maximum lease duration cannot exceed 11 months.",
        ],
    },


    /* ======================================================
       PROPERTY STATUS
    ====================================================== */

    status: {
        type: String,

        enum: {
            values: [
                "Available",
                "Booked",
                "Rented",
                "Pending",
            ],
            message: "Please select a valid property status.",
        },

        default: "Available",
    },


    /* ======================================================
       PROPERTY IMAGES
    ====================================================== */

    images: {
        type: [
            {
                filename: {
                    type: String,
                    default: "default.jpg",
                },

                url: {
                    type: String,
                    default:
                        "https://images.unsplash.com/photo-1560518883-ce09059eeffa",
                },
            },
        ],

        default: [],
    },


    /* ======================================================
       PROPERTY VIEWS
    ====================================================== */

    views: {
        type: Number,
        default: 0,

        min: [
            0,
            "Property views cannot be negative.",
        ],
    },


    /* ======================================================
       PROPERTY REVIEWS
    ====================================================== */

    reviews: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review",
            },
        ],

        default: [],
    },

}, {
    timestamps: true,
});

const Listing = mongoose.model("Listing", ListingSchema);

module.exports = Listing;