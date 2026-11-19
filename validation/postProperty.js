const Joi = require("joi");

// ========================================
// LISTING VALIDATION SCHEMA
// ========================================

const postPropertyValidation = Joi.object({

    // ========================================
    // OWNER DETAILS
    // ========================================

    ownerEmail: Joi.string()
        .email()
        .allow("")
        .optional(),

    ownerPhone: Joi.string()
        .trim()
        .pattern(/^[6-9]\d{9}$/)
        .required()
        .messages({
            "string.empty": "Owner mobile number is required",
            "string.pattern.base": "Enter a valid 10 digit phone number",
            "any.required": "Owner mobile number is required"
        }),

    responseTime: Joi.string()
        .valid(
            "Within 5 mins",
            "Within 30 mins",
            "Within 1 hour",
            "Within 24 hours"
        )
        .default("Within 1 hour"),


    // ========================================
    // PROPERTY DETAILS
    // ========================================

    title: Joi.string()
        .trim()
        .min(5)
        .max(100)
        .required()
        .messages({
            "string.min": "Property title must contain at least 5 characters",
            "string.max": "Property title cannot exceed 100 characters"
        }),

    description: Joi.string()
        .trim()
        .min(20)
        .max(2000)
        .required()
        .messages({
            "string.min": "Description must contain at least 20 characters",
            "string.max": "Description cannot exceed 2000 characters"
        }),

    propertyType: Joi.string()
        .valid("Room", "Flat", "House", "Apartment", "PG", "Shop")
        .required(),

    bhk: Joi.string()
        .valid("1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK")
        .required(),

    furnishing: Joi.string()
        .valid("Furnished", "Semi Furnished", "Unfurnished")
        .required(),


    // ========================================
    // PRICE DETAILS
    // ========================================

    rentPrice: Joi.number()
        .positive()
        .required()
        .messages({
            "number.positive": "Rent price must be greater than 0",
            "any.required": "Rent price is required"
        }),

    securityDeposit: Joi.number()
        .min(0)
        .default(0)
        .required(),

    maintenanceCharge: Joi.number()
        .min(0)
        .default(0)
        .required(),

    electricityIncluded: Joi.boolean()
        .truthy("true")
        .falsy("false")
        .default(false)
        .required(),


    // ========================================
    // LOCATION DETAILS
    // ========================================

    area: Joi.string()
        .trim()
        .required(),

    fullAddress: Joi.string()
        .trim()
        .min(10)
        .required()
        .messages({
            "string.min": "Complete address must contain at least 10 characters"
        }),

    city: Joi.string()
        .valid("Aligarh")
        .required()
        .messages({
            "any.only": "Currently we provide services only in Aligarh",
            "any.required": "City is required"
        }),

    country: Joi.string()
        .valid("India")
        .default("India")
        .required()
        .messages({
            "any.only": "Only India is allowed",
            "any.required": "Country is required"
        }),

    pincode: Joi.string()
        .valid(
            "202001",
            "202002",
            "202125",
            "202122",
            "202124",
            "202128",
            "202129",
            "202140"
        )
        .required()
        .messages({
            "any.only": "Invalid Aligarh pincode",
            "any.required": "Pincode is required"
        }),

    googleMapLink: Joi.string()
        .uri()
        .allow("")
        .optional(),


    // ========================================
    // NEARBY LANDMARKS
    // ========================================

    nearbyLandmarks: Joi.array()
        .items(
            Joi.object({

                mainlocation: Joi.string()
                    .trim()
                    .allow("")
                    .optional(),

                landmarkName: Joi.string()
                    .trim()
                    .allow("")
                    .optional(),

                distance: Joi.number()
                    .min(0)
                    .allow("")
                    .optional(),

                distanceUnit: Joi.string()
                    .valid("km", "meter")
                    .allow("")
                    .optional()

            })
        )
        .optional()
        .custom((value, helpers) => {

            if (!value) {
                return value;
            }

            const filtered = value.filter(item => {

                return (
                    item &&
                    (
                        item.landmarkName ||
                        item.distance ||
                        item.distanceUnit
                    )
                );

            });

            for (const item of filtered) {

                if (
                    item.landmarkName &&
                    (
                        item.distance === undefined ||
                        item.distance === ""
                    )
                ) {
                    return helpers.message(
                        "Distance is required when landmark name is entered"
                    );
                }

                if (
                    item.distance !== undefined &&
                    item.distance !== "" &&
                    !item.landmarkName
                ) {
                    return helpers.message(
                        "Landmark name is required when distance is entered"
                    );
                }

                if (
                    item.distance !== undefined &&
                    item.distance !== "" &&
                    !item.distanceUnit
                ) {
                    return helpers.message(
                        "Distance unit is required"
                    );
                }

            }

            return filtered;

        }),


    // ========================================
    // BUILDING DETAILS
    // ========================================

    floor: Joi.number()
        .min(1)
        .required()
        .messages({
            "number.min": "Floor must be at least 1",
            "any.required": "Floor is required"
        })
        .custom((value, helpers) => {

            const totalFloors =
                helpers.state.ancestors[0].totalFloors;

            if (
                totalFloors !== undefined &&
                Number(value) > Number(totalFloors)
            ) {
                return helpers.message(
                    "Available floor cannot be greater than total floors"
                );
            }

            return value;

        }),

    totalFloors: Joi.number()
        .min(1)
        .required()
        .messages({
            "number.min": "Total floors must be at least 1",
            "any.required": "Total floors is required"
        })
        .custom((value, helpers) => {

            const floor =
                helpers.state.ancestors[0].floor;

            if (
                floor !== undefined &&
                Number(floor) > Number(value)
            ) {
                return helpers.message(
                    "Total floors cannot be less than available floor"
                );
            }

            return value;

        }),


    // ========================================
    // TENANT DETAILS
    // ========================================

    preferredTenant: Joi.string()
        .valid(
            "Boys",
            "Girls",
            "Family",
            "Couples",
            "Anyone",
            "Student"
        )
        .required(),

    maxOccupants: Joi.number()
        .min(1)
        .required()
        .custom((value, helpers) => {

            const {
                roommateAvailable,
                currentOccupants
            } = helpers.state.ancestors[0];

            if (
                roommateAvailable === true &&
                currentOccupants !== undefined &&
                currentOccupants !== "" &&
                currentOccupants !== null &&
                Number(currentOccupants) > Number(value)
            ) {
                return helpers.message(
                    "Current occupants cannot be greater than maximum occupants"
                );
            }

            return value;

        })
        .messages({
            "number.base": "Maximum occupants must be a number",
            "number.min": "Maximum occupants must be at least 1",
            "any.required": "Maximum occupants is required"
        }),

    roommateAvailable: Joi.boolean()
        .truthy("true")
        .falsy("false")
        .default(false),

    currentOccupants: Joi.when("roommateAvailable", {

        is: true,

        then: Joi.number()
            .min(1)
            .required()
            .messages({
                "number.base": "Current occupants must be a number",
                "number.min": "Current occupants must be at least 1",
                "any.required": "Current occupants is required when roommate is available"
            }),

        otherwise: Joi.number()
            .min(0)
            .allow("")
            .optional()
            .messages({
                "number.base": "Current occupants must be a number",
                "number.min": "Current occupants cannot be negative"
            })

    })
        .custom((value, helpers) => {

            const {
                maxOccupants
            } = helpers.state.ancestors[0];

            if (
                value !== undefined &&
                value !== "" &&
                maxOccupants !== undefined &&
                Number(value) > Number(maxOccupants)
            ) {
                return helpers.message(
                    "Current occupants cannot exceed maximum occupants"
                );
            }

            return value;

        }),

    availableFor: Joi.string()
        .valid("Student", "Family", "Roommate", "Visitor")
        .required(),


    // ========================================
    // ROOMMATE DETAILS
    // ========================================

    roommates: Joi.array()
        .when("roommateAvailable", {

            is: true,

            then: Joi.array()
                .items(
                    Joi.object({

                        name: Joi.string()
                            .allow("")
                            .optional(),

                        gender: Joi.string()
                            .valid("Male", "Female")
                            .when("name", {
                                is: Joi.string().trim().min(1),
                                then: Joi.required(),
                                otherwise: Joi.optional()
                            }),

                        age: Joi.number()
                            .when("name", {
                                is: Joi.string().trim().min(1),
                                then: Joi.required(),
                                otherwise: Joi.optional()
                            })

                    })
                ),

            otherwise: Joi.array()
                .optional()

        }),


    // ========================================
    // AVAILABILITY DETAILS
    // ========================================

    availableFrom: Joi.date()
        .min("now")
        .required()
        .messages({
            "date.base": "Available date must be valid",
            "date.min": "Available date cannot be in the past",
            "any.required": "Available date is required"
        }),


    // ========================================
    // LEASE PERIOD
    // ========================================

    minimumLeaseMonths: Joi.number()
        .min(1)
        .required()
        .custom((value, helpers) => {

            const maximumLeaseMonths =
                helpers.state.ancestors[0].maximumLeaseMonths;

            if (
                maximumLeaseMonths !== undefined &&
                Number(value) > Number(maximumLeaseMonths)
            ) {
                return helpers.message(
                    "Minimum lease months cannot be greater than maximum lease months"
                );
            }

            return value;

        }),

    maximumLeaseMonths: Joi.number()
        .min(1)
        .max(11)
        .required()
        .custom((value, helpers) => {

            const minimumLeaseMonths =
                helpers.state.ancestors[0].minimumLeaseMonths;

            if (
                minimumLeaseMonths !== undefined &&
                Number(value) < Number(minimumLeaseMonths)
            ) {
                return helpers.message(
                    "Maximum lease months cannot be less than minimum lease months"
                );
            }

            return value;

        }),


    // ========================================
    // PROPERTY STATUS
    // ========================================

    status: Joi.string()
        .valid("Available", "Booked", "Occupied", "Pending")
        .default("Available"),


    // ========================================
    // IMAGES
    // New listing: minimum 3 checked in POST route.
    // Edit listing: new images are optional.
    // ========================================

    images: Joi.array()
        .max(10)
        .optional()
        .messages({
            "array.max": "Maximum 10 images allowed"
        })

});


// ========================================
// REVIEW VALIDATION
// ========================================

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const reviewValidation = Joi.object({

    title: Joi.string()
        .trim()
        .min(3)
        .max(80)
        .allow("")
        .optional()
        .pattern(/^[A-Za-z\s]+$/)
        .messages({
            "string.min": "Review title must contain at least 3 characters",
            "string.max": "Review title cannot exceed 80 characters",
            "string.pattern.base": "Review title can contain only letters and spaces"
        }),

    listing: Joi.string()
        .pattern(objectIdPattern)
        .required()
        .messages({
            "string.pattern.base": "Invalid listing ID",
            "any.required": "Listing ID is required"
        }),

    user: Joi.string()
        .pattern(objectIdPattern)
        .optional()
        .messages({
            "string.pattern.base": "Invalid user ID"
        }),

    rating: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .required()
        .messages({
            "number.base": "Rating must be a number",
            "number.integer": "Rating must be a whole number",
            "number.min": "Rating must be between 1 and 5",
            "number.max": "Rating must be between 1 and 5",
            "any.required": "Rating is required"
        }),

    comment: Joi.string()
        .trim()
        .min(3)
        .max(1000)
        .required()
        .pattern(/^[A-Za-z\s]+$/)
        .messages({
            "string.empty": "Review comment is required",
            "string.min": "Review comment must contain at least 3 characters",
            "string.max": "Review comment cannot exceed 1000 characters",
            "string.pattern.base": "Review comment can contain only letters and spaces",
            "any.required": "Review comment is required"
        })

});


// ========================================
// EXPORT VALIDATIONS
// ========================================

module.exports = {
    reviewValidation,
    postPropertyValidation
};