const Listing = require("../models/propertyOwnerListing/listing");

module.exports = async (req, res, next) => {

    try {

        res.locals.currentUser = req.user;


        res.locals.areas = await Listing.distinct("area");

        res.locals.bhkTypes = await Listing.distinct("bhk");

        res.locals.rentPrices = await Listing.distinct("rentPrice");

        res.locals.preferredTenants = await Listing.distinct("preferredTenant");

        res.locals.propertyBudget = await Listing.aggregate([
            {
                $group: {
                    _id: "$propertyType",
                    maxPrice: {
                        $max: "$rentPrice"
                    },
                    minPrice: {
                        $min: "$rentPrice"
                    }
                }
            }
        ]);

        next();

    } catch (err) {

        next(err);

    }

};