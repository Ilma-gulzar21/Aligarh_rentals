const express = require("express");
const router = express.Router();


const Listing = require("../models/propertyOwnerListing/listing.js");

const asyncWrap = require("../utils/asyncWrap.js");
const ExpressError = require("../utils/ExpressError.js");

//show property type route
router.get(
    "/type/:propertyType",

    asyncWrap(async (req, res, next) => {

        let { propertyType } = req.params;

        // Selected property type ki properties
        const listings = await Listing.find({
            propertyType: {
                $regex: `^${propertyType}$`,
                $options: "i"
            }
        });

        // Check if properties not found
        if (listings.length === 0) {
            return next(
                new ExpressError(
                    404,
                    "No properties found for this property type"
                )
            );
        }

        // Total properties count of this type
        const totalProperties = await Listing.countDocuments({
            propertyType: {
                $regex: `^${propertyType}$`,
                $options: "i"
            }
        });

        // Areas available for this property type
        const areas = await Listing.distinct(
            "area",
            {
                propertyType: {
                    $regex: `^${propertyType}$`,
                    $options: "i"
                }
            }
        );

        // BHK options
        const bhkTypes = await Listing.distinct(
            "bhk",
            {
                propertyType: {
                    $regex: `^${propertyType}$`,
                    $options: "i"
                }
            }
        );

        res.render(
            "routeListings/propertyType",
            {
                listings,
                propertyType,
                totalProperties,
                areas,
                bhkTypes
            }
        );

    })

);
    module.exports = router;