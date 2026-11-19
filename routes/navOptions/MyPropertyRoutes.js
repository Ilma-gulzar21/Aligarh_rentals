const express = require("express");

const router = express.Router();

const Listing =
    require("../../models/propertyOwnerListing/listing.js");

const {
    isLoggedIn
} = require("../../middleware/Auth");


// =====================================================
// MY PROPERTIES
// =====================================================

router.get(
    "/myProperties",
    isLoggedIn,
    async (req, res, next) => {

        try {

            const myProperties =
                await Listing.find({
                    owner: req.user._id
                })
                .populate("owner")
                .sort({
                    createdAt: -1
                });


            console.log(
                "MY PROPERTY USER:",
                req.user._id
            );


            console.log(
                "MY PROPERTIES COUNT:",
                myProperties.length
            );


            res.render(
                "routeListings/myProperties.ejs",
                {
                    myProperties,
                    currentUser: req.user
                }
            );


        } catch (err) {

            next(err);

        }

    }
);


module.exports = router;