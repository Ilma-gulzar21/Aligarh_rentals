
const express = require("express");
const router = express.Router();

const Listing = require("../models/propertyOwnerListing/listing.js");
const asyncWrap = require("../utils/asyncWrap.js");


/* ======================================================
   RENT GUIDE ROUTE
   URL: /listings/guide
====================================================== */

router.get(
    "/guide",
    asyncWrap(async (req, res) => {

        /* ==================================================
           TOTAL AVAILABLE PROPERTIES
        ================================================== */

        const totalProperties = await Listing.countDocuments({
            status: "Available"
        });


        /* ==================================================
           TOTAL AREAS
        ================================================== */

        const areas = await Listing.distinct("area");


        /* ==================================================
           PROPERTY TYPES
        ================================================== */

        const propertyTypes = await Listing.distinct(
            "propertyType"
        );


        /* ==================================================
           PREFERRED TENANT TYPES
        ================================================== */

        const tenantTypes = await Listing.distinct(
            "preferredTenant"
        );


        /* ==================================================
           RENT RANGE
        ================================================== */

        const rentRange = await Listing.aggregate([
            {
                $group: {
                    _id: null,

                    minimumRent: {
                        $min: "$rentPrice"
                    },

                    maximumRent: {
                        $max: "$rentPrice"
                    }
                }
            }
        ]);


        const priceData = rentRange[0] || {
            minimumRent: 0,
            maximumRent: 0
        };


        /* ==================================================
           POPULAR AREAS
        ================================================== */

        const popularAreas = await Listing.aggregate([

            {
                $match: {
                    status: "Available"
                }
            },

            {
                $group: {
                    _id: "$area",

                    count: {
                        $sum: 1
                    }
                }
            },

            {
                $sort: {
                    count: -1
                }
            },

            {
                $limit: 6
            }
        ]);


        /* ==================================================
           RENDER RENT GUIDE PAGE
        ================================================== */

        res.render(
            "routeListings/rentGuide",
            {
                totalProperties,

                totalAreas: areas.length,

                propertyTypes,

                tenantTypes,

                minimumRent:
                    priceData.minimumRent,

                maximumRent:
                    priceData.maximumRent,

                popularAreas
            }
        );
    })
);


module.exports = router;
