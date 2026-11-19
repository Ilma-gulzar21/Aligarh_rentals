
const express = require("express");
const router = express.Router();

const Listing = require("../models/propertyOwnerListing/listing.js");
const asyncWrap = require("../utils/asyncWrap.js");


// ======================================================
// ROOMMATE MATCHING
// GET /roommates
// ======================================================

router.get(
    "/roommates",

    asyncWrap(async (req, res) => {

        // ==================================================
        // ROOMMATE REQUIRED PROPERTIES
        // ==================================================

        const roommateProperties = await Listing.find({

            roommateAvailable: true,

            isActive: true,

            status: "Available"

        })

        .populate("owner")

        .sort({
            createdAt: -1
        });


        // ==================================================
        // TOTAL ROOMMATE LISTINGS
        // ==================================================

        const totalRequirements = roommateProperties.length;


        // ==================================================
        // AVAILABLE AREAS
        // ==================================================

        const roommateAreas = await Listing.distinct(

            "area",

            {
                roommateAvailable: true,

                isActive: true,

                status: "Available"
            }

        );


        // ==================================================
        // TENANT PREFERENCES
        // ==================================================

        const preferences = await Listing.distinct(

            "preferredTenant",

            {
                roommateAvailable: true,

                isActive: true,

                status: "Available"
            }

        );


        // ==================================================
        // RENDER ROOMMATE MATCHING PAGE
        // ==================================================

        return res.render(

            "routeListings/roommate",

            {
                roommateProperties,

                totalRequirements,

                roommateAreas,

                preferences
            }

        );

    })

);


// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;