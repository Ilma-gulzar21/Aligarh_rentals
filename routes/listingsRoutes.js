const express = require("express");
const router = express.Router();

const Listing = require("../models/propertyOwnerListing/listing.js");
const User = require("../models/userListing/users.js");
const Roommate = require("../models/roommateListing/roommate.js");
const Review = require("../models/reviews/reviewListings.js");

const asyncWrap = require("../utils/asyncWrap.js");
const ExpressError = require("../utils/ExpressError.js");

const upload = require("../utils/multer.js");
const validateListing = require("../middleware/listingValidation.js");

const {
    isLoggedIn,
    isOwner,
    isLoggedInForOwnerDetails,
    isLoggedInForRoommateDetails,
    isOwnerRole
} = require("../middleware/Auth");


// =====================================
// HELPER: ESCAPE REGEX
// =====================================

const escapeRegex = (text) => {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};


// =====================================
// HELPER: PARSE BUDGET
// =====================================

const parseBudget = (budget) => {

    if (!budget) return null;

    if (budget.startsWith("below-")) {

        const maxPrice = Number(
            budget.replace("below-", "")
        );

        if (!Number.isFinite(maxPrice)) return null;

        return { maxPrice };
    }

    if (budget.startsWith("above-")) {

        const minPrice = Number(
            budget.replace("above-", "")
        );

        if (!Number.isFinite(minPrice)) return null;

        return { minPrice };
    }

    const parts = budget.split("-");

    if (parts.length === 2) {

        const minPrice = Number(parts[0]);
        const maxPrice = Number(parts[1]);

        if (
            !Number.isFinite(minPrice) ||
            !Number.isFinite(maxPrice) ||
            minPrice < 0 ||
            maxPrice <= minPrice
        ) {
            return null;
        }

        return {
            minPrice,
            maxPrice
        };
    }

    return null;
};


// =====================================
// HELPER: NORMALIZE ROOMMATES
// =====================================

const normalizeRoommates = (roommates) => {

    if (!Array.isArray(roommates)) {
        return [];
    }

    return roommates

        .filter((roommate) => {

            if (!roommate) return false;

            const name = String(roommate.name || "").trim();
            const gender = String(roommate.gender || "").trim();
            const age = roommate.age;

            // Remove completely empty rows
            return Boolean(
                name ||
                gender ||
                (age !== undefined && age !== "")
            );

        })

        .map((roommate) => {

            const name = String(
                roommate.name || ""
            ).trim();

            let gender = String(
                roommate.gender || ""
            ).trim();

            // Normalize gender values
            if (gender.toLowerCase() === "male") {
                gender = "Male";
            } else if (gender.toLowerCase() === "female") {
                gender = "Female";
            } else {
                gender = undefined;
            }

            const age = (
                roommate.age !== undefined &&
                roommate.age !== ""
            )
                ? Number(roommate.age)
                : undefined;

            return {
                name,
                gender,
                age: Number.isFinite(age) ? age : undefined
            };

        });
};


// =====================================
// HELPER: NORMALIZE LANDMARKS
// =====================================

const normalizeLandmarks = (landmarks) => {

    if (!Array.isArray(landmarks)) {
        return [];
    }

    return landmarks.filter((landmark) => {

        return (
            landmark &&
            landmark.landmarkName &&
            landmark.landmarkName.trim() !== "" &&
            landmark.distance !== undefined &&
            landmark.distance !== ""
        );

    });
};


// =====================================
// INDEX ROUTE
// GET /listings
// =====================================

router.get(
    "/",

    asyncWrap(async (req, res) => {

        const {
            availableFor,
            area,
            location,
            propertyType,
            rentPrice,
            bhk,
            preferredTenant,
            minPrice,
            maxPrice,
            budget
        } = req.query;


        const searchLocation =
            typeof location === "string"
                ? location.trim()
                : "";

        const selectedPropertyType =
            typeof propertyType === "string"
                ? propertyType.trim()
                : "";

        const selectedBudget =
            typeof budget === "string"
                ? budget.trim()
                : "";


        // BASE FILTER

        const filter = {
            isActive: true
        };


        // AVAILABLE FOR

        if (availableFor && availableFor !== "All") {
            filter.availableFor = availableFor;
        }


        // AREA

        if (area) {
            filter.area = area;
        }


        // PROPERTY TYPE

        if (selectedPropertyType) {
            filter.propertyType = selectedPropertyType;
        }


        // BHK

        if (bhk) {

            filter.bhk = {
                $regex: `^${escapeRegex(bhk)}$`,
                $options: "i"
            };

        }


        // EXACT RENT PRICE

        if (rentPrice) {

            const price = Number(rentPrice);

            if (Number.isFinite(price)) {
                filter.rentPrice = price;
            }

        }


        // MIN / MAX PRICE

        if (minPrice || maxPrice) {

            filter.rentPrice = {};

            if (minPrice) {
                filter.rentPrice.$gte = Number(minPrice);
            }

            if (maxPrice) {
                filter.rentPrice.$lte = Number(maxPrice);
            }

        }


        // LOCATION FILTER

        if (searchLocation) {

            const locationRegex = {
                $regex: escapeRegex(searchLocation),
                $options: "i"
            };

            filter.$or = [

                { area: locationRegex },

                { fullAddress: locationRegex },

                {
                    "nearbyLandmarks.landmarkName": locationRegex
                },

                {
                    "nearbyLandmarks.mainlocation": locationRegex
                }

            ];

        }


        // BUDGET FILTER

        const budgetRange = parseBudget(selectedBudget);

        if (budgetRange) {

            if (
                !filter.rentPrice ||
                typeof filter.rentPrice !== "object"
            ) {
                filter.rentPrice = {};
            }

            if (budgetRange.minPrice !== undefined) {
                filter.rentPrice.$gte = budgetRange.minPrice;
            }

            if (budgetRange.maxPrice !== undefined) {
                filter.rentPrice.$lt = budgetRange.maxPrice;
            }

        }


        // FIND LISTINGS

        const listings = await Listing.find(filter)

            .populate("owner", "fullName profileImage")

            .populate({
                path: "reviews",
                select: "rating",
                match: {
                    status: "Published"
                }
            })

            .sort({
                createdAt: -1
            });


        // AREA PAGE

        if (area) {

            const nearbyAreas = await Listing.distinct("area");

            return res.render("routeListings/areawise", {
                listings,
                selectedArea: area,
                nearbyAreas,
                totalProperties: listings.length
            });

        }


        // SEARCH PAGE

        if (
            searchLocation ||
            selectedPropertyType ||
            selectedBudget ||
            minPrice ||
            maxPrice ||
            preferredTenant ||
            bhk
        ) {

            let selectedMinPrice = minPrice || "";
            let selectedMaxPrice = maxPrice || "";

            if (budgetRange) {

                selectedMinPrice =
                    budgetRange.minPrice !== undefined
                        ? budgetRange.minPrice
                        : "";

                selectedMaxPrice =
                    budgetRange.maxPrice !== undefined
                        ? budgetRange.maxPrice
                        : "";

            }

            return res.render("routeListings/tenantswise", {

                listings,

                propertyType: selectedPropertyType,

                minPrice: selectedMinPrice,

                maxPrice: selectedMaxPrice,

                bhk,

                preferredTenant,

                selectedArea: searchLocation || "",

                location: searchLocation,

                budget: selectedBudget,

                totalProperties: listings.length

            });

        }


        // HOME PAGE DATA

        const rentPrices = await Listing.distinct("rentPrice");

        const areas = await Listing.distinct("area");

        const bhkTypes = await Listing.distinct("bhk");

        const preferredTenants =
            await Listing.distinct("preferredTenant");


        const roommates = await Roommate.find({
            status: "Open"
        }).limit(3);


        // PROPERTY TYPE AND BUDGET DATA

        const propertyBudget = await Listing.aggregate([

            {
                $match: {
                    isActive: true
                }
            },

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


        // TOTAL LISTINGS

        const totalListings = await Listing.countDocuments({
            isActive: true
        });


        // TOTAL OWNERS

        const totalOwners = await User.countDocuments({
            role: "Owner"
        });


        // REVIEW STATISTICS

        const reviewStats = await Review.aggregate([

            {
                $match: {
                    status: "Published"
                }
            },

            {
                $group: {

                    _id: null,

                    averageRating: {
                        $avg: "$rating"
                    },

                    totalReviews: {
                        $sum: 1
                    }

                }
            }

        ]);


        const ratingData = reviewStats[0] || {
            averageRating: 0,
            totalReviews: 0
        };


        // LATEST REVIEWS

        const reviews = await Review.find({
            status: "Published"
        })

            .populate("user")

            .sort({
                createdAt: -1
            })

            .limit(6);


        // RENDER HOME PAGE

        res.render("routeListings/index", {

            listings,

            areas,

            bhkTypes,

            rentPrices,

            preferredTenants,

            propertyBudget,

            selected: availableFor || "All",

            selectedArea: area || "",

            roommates,

            totalListings,

            totalOwners,

            averageRating: Number(
                ratingData.averageRating
            ).toFixed(1),

            totalReviews: ratingData.totalReviews,

            reviews

        });

    })
);


// =====================================
// ROLE-BASED DASHBOARD
// GET /listings/dashboard
// =====================================

router.get(
    "/dashboard",

    isLoggedIn,

    asyncWrap(async (req, res) => {

        const user = await User.findById(req.user._id);

        if (!user || !user.isActive) {

            return req.logout((err) => {

                if (err) {
                    console.error("Logout error:", err);
                }

                return res.redirect("/login");

            });

        }


        // OWNER DASHBOARD

        if (user.role === "Owner") {

            const ownerId = user._id;

            const totalProperties =
                await Listing.countDocuments({
                    owner: ownerId
                });

            const availableProperties =
                await Listing.countDocuments({
                    owner: ownerId,
                    isActive: true,
                    status: "Available"
                });

            const pendingProperties =
                await Listing.countDocuments({
                    owner: ownerId,
                    status: "Pending"
                });

            const rentedProperties =
                await Listing.countDocuments({
                    owner: ownerId,
                    status: "Rented"
                });

            const bookedProperties =
                await Listing.countDocuments({
                    owner: ownerId,
                    status: "Booked"
                });

            const recentProperties =
                await Listing.find({
                    owner: ownerId
                })

                .sort({
                    createdAt: -1
                })

                .limit(5)

                .lean();


            return res.render(
                "routeListings/dashboard",
                {
                    user,
                    totalProperties,
                    availableProperties,
                    pendingProperties,
                    rentedProperties,
                    bookedProperties,
                    recentProperties
                }
            );

        }


        // TENANT DASHBOARD

        if (user.role === "Tenant") {

            const totalAvailableProperties =
                await Listing.countDocuments({
                    isActive: true,
                    status: "Available"
                });

            const totalRoommates =
                await Roommate.countDocuments({
                    status: "Open"
                });

            const totalReviews =
                await Review.countDocuments({
                    user: user._id
                });


            return res.render(
                "routeListings/tenantDashboard",
                {
                    user,
                    totalAvailableProperties,
                    totalRoommates,
                    totalReviews
                }
            );

        }


        req.flash("error", "Invalid account role.");

        return res.redirect("/listings");

    })
);


// =====================================
// CHANGE USER ROLE
// POST /listings/change-role
// =====================================

router.post(
    "/change-role",

    isLoggedIn,

    asyncWrap(async (req, res, next) => {

        const newRole = req.body.role;

        if (!["Owner", "Tenant"].includes(newRole)) {

            req.flash("error", "Invalid role selected.");

            return res.redirect("/listings/dashboard");

        }


        const updatedUser = await User.findByIdAndUpdate(

            req.user._id,

            {
                role: newRole
            },

            {
                new: true,
                runValidators: true
            }

        );


        if (!updatedUser) {

            req.flash("error", "User account not found.");

            return res.redirect("/listings");

        }


        req.login(updatedUser, (err) => {

            if (err) {
                return next(err);
            }

            req.flash(
                "success",
                `Your role has been changed to ${newRole}.`
            );

            return res.redirect("/listings/dashboard");

        });

    })
);


// =====================================
// NEW LISTING PAGE
// GET /listings/new
// =====================================

router.get(
    "/new",

    isLoggedIn,

    isOwnerRole,

    (req, res) => {

        res.render("routeListings/postProperty.ejs");

    }
);


// =====================================
// EDIT LISTING PAGE
// GET /listings/:id/edit
// =====================================

router.get(
    "/:id/edit",

    isLoggedIn,

    isOwnerRole,

    isOwner,

    asyncWrap(async (req, res) => {

        const { id } = req.params;

        const listing = await Listing.findById(id)
            .populate("owner");

        if (!listing) {
            return res.status(404).send("Listing not found");
        }

        res.render("routeListings/edit.ejs", {
            listing
        });

    })
);


// =====================================
// DELETE LISTING
// DELETE /listings/:id
// =====================================

router.delete(
    "/:id",

    isLoggedIn,

    isOwnerRole,

    isOwner,

    asyncWrap(async (req, res) => {

        const { id } = req.params;

        const listing = await Listing.findById(id);

        if (!listing) {
            return res.status(404).send("Listing not found");
        }

        await Listing.findByIdAndDelete(id);

        req.flash("success", "Property deleted successfully.");

        return res.redirect("/listings");

    })
);


// =====================================
// UPDATE LISTING
// PUT /listings/:id
// =====================================

router.put(
    "/:id",

    isLoggedIn,

    isOwnerRole,

    isOwner,

    upload.array("images", 10),

    validateListing,

    asyncWrap(async (req, res) => {

        const { id } = req.params;

        const listing = await Listing.findById(id);

        if (!listing) {
            return res.status(404).send("Listing not found");
        }


        // =====================================
        // UPDATE NORMAL FIELDS
        // =====================================

        const updateData = { ...req.body };

        delete updateData.roommates;
        delete updateData.nearbyLandmarks;
        delete updateData.images;
        delete updateData.deleteImages;
        delete updateData._method;

        Object.assign(listing, updateData);


        // =====================================
        // UPDATE ROOMMATE DETAILS
        // =====================================

        if (req.body.roommateAvailable === "false") {

            listing.roommateAvailable = false;
            listing.roommates = [];

        } else {

            listing.roommateAvailable =
                req.body.roommateAvailable === "true";

            if (req.body.roommates !== undefined) {

                const rawRoommates = Array.isArray(req.body.roommates)
                    ? req.body.roommates
                    : Object.values(req.body.roommates || {});

                listing.roommates = normalizeRoommates(rawRoommates);

            } else {

                // Clean existing database values
                listing.roommates = normalizeRoommates(
                    (listing.roommates || []).map(roommate => ({
                        name: roommate.name,
                        gender: roommate.gender,
                        age: roommate.age
                    }))
                );

            }

        }


        // =====================================
        // UPDATE LANDMARKS
        // =====================================

        if (req.body.nearbyLandmarks !== undefined) {

            const rawLandmarks = Array.isArray(req.body.nearbyLandmarks)
                ? req.body.nearbyLandmarks
                : Object.values(req.body.nearbyLandmarks || {});

            listing.nearbyLandmarks = normalizeLandmarks(rawLandmarks);

        }


        // =====================================
        // UPDATE IMAGES
        // =====================================

        if (req.files && req.files.length > 0) {

      const newImages = req.files.map(file => ({
    filename: file.filename,
    url: file.path
}));

            listing.images = [
                ...listing.images,
                ...newImages
            ];

        }


        // =====================================
        // OWNER DETAILS
        // =====================================

        listing.ownerEmail = req.user.email;


        // =====================================
        // SAVE LISTING
        // =====================================

        await listing.save();


        req.flash(
            "success",
            "Property updated successfully."
        );

        return res.redirect(`/listings/${listing._id}`);

    })
);


// =====================================
// POST NEW LISTING
// POST /listings
// =====================================

router.post(
    "/",

    isLoggedIn,

    isOwnerRole,

    upload.array("images", 10),

    validateListing,

    asyncWrap(async (req, res) => {

        // CHECK USER EMAIL

        if (!req.user || !req.user.email) {

            throw new ExpressError(
                400,
                "Owner email not found. Please login again."
            );

        }


        // CHECK IMAGES

        if (!req.files || req.files.length < 3) {

            throw new ExpressError(
                400,
                "Please upload minimum 3 property images"
            );

        }


        // IMAGE HANDLING

   const imageUrls = req.files.map(file => ({
    filename: file.filename,
    url: file.path
}));

        // LANDMARK FILTER

        const filteredLandmarks = normalizeLandmarks(
            Array.isArray(req.body.nearbyLandmarks)
                ? req.body.nearbyLandmarks
                : []
        );


        // ROOMMATE FILTER

        const filteredRoommates = normalizeRoommates(
            Array.isArray(req.body.roommates)
                ? req.body.roommates
                : []
        );


        // LISTING DATA

        const listingData = {

            owner: req.user._id,

            ownerEmail: req.user.email,

            ownerPhone: req.body.ownerPhone,

            ownerVerified: false,

            responseTime: req.body.responseTime,


            // PROPERTY DETAILS

            title: req.body.title,

            description: req.body.description,

            propertyType: req.body.propertyType,

            bhk: req.body.bhk,

            furnishing: req.body.furnishing,


            // RENTAL PRICING

            rentPrice: Number(req.body.rentPrice),

            securityDeposit: Number(req.body.securityDeposit),

            maintenanceCharge: Number(
                req.body.maintenanceCharge || 0
            ),

            electricityIncluded:
                req.body.electricityIncluded === "true",


            // LOCATION

            area: req.body.area,

            fullAddress: req.body.fullAddress,

            city: req.body.city || "Aligarh",

            country: req.body.country || "India",

            pincode: req.body.pincode,

            googleMapLink:
                req.body.googleMapLink || undefined,

            nearbyLandmarks: filteredLandmarks,


            // BUILDING DETAILS

            floor: Number(req.body.floor),

            totalFloors: Number(req.body.totalFloors),


            // TENANT DETAILS

            preferredTenant: req.body.preferredTenant,

            maxOccupants: Number(req.body.maxOccupants),

            currentOccupants: Number(
                req.body.currentOccupants || 0
            ),


            // ROOMMATE DETAILS

            roommateAvailable:
                req.body.roommateAvailable === "true",

            availableFor: req.body.availableFor,

            roommates: filteredRoommates,


            // AVAILABILITY

            availableFrom: req.body.availableFrom || new Date(),


            // LEASE DETAILS

            minimumLeaseMonths: Number(
                req.body.minimumLeaseMonths
            ),

            maximumLeaseMonths: req.body.maximumLeaseMonths
                ? Number(req.body.maximumLeaseMonths)
                : undefined,


            // STATUS

            status: req.body.status || "Available",


            // IMAGES

            images: imageUrls

        };


        // CREATE LISTING

        const listing = new Listing(listingData);

        await listing.save();


        req.flash(
            "success",
            "Your property has been submitted successfully."
        );

        return res.redirect("/listings");

    })
);


// =====================================
// PROTECTED OWNER DETAILS
// GET /listings/:id/owner
// =====================================

router.get(
    "/:id/owner",

    isLoggedInForOwnerDetails,

    asyncWrap(async (req, res) => {

        const { id } = req.params;

        const listing = await Listing.findById(id);


        if (!listing) {

            return res.status(404).json({
                success: false,
                message: "Property not found."
            });

        }


        if (!listing.owner) {

            return res.status(404).json({
                success: false,
                message: "Owner details not found."
            });

        }


        const owner = await User.findById(listing.owner)
            .select("fullName email phone profileImage");


        if (!owner) {

            return res.status(404).json({
                success: false,
                message: "Owner not found."
            });

        }


        const ownerPhone =
            listing.ownerPhone || owner.phone || "";

        const ownerEmail =
            listing.ownerEmail || owner.email || "";


        res.json({

            success: true,

            owner: {

                fullName: owner.fullName || "Property Owner",

                email: ownerEmail,

                phone: ownerPhone,

                profileImage: owner.profileImage || ""

            },

            responseTime: listing.responseTime,

            ownerVerified: listing.ownerVerified

        });

    })
);


// =====================================
// PROTECTED ROOMMATE DETAILS
// GET /listings/:id/roommates
// =====================================

router.get(
    "/:id/roommates",

    isLoggedInForRoommateDetails,

    asyncWrap(async (req, res) => {

        const listing = await Listing.findById(req.params.id)
            .select("roommates");

        if (!listing) {

            return res.status(404).json({
                success: false,
                message: "Property not found."
            });

        }


        const availableRoommates = (listing.roommates || [])

            .filter(roommate =>
                roommate.name &&
                roommate.name.trim() !== ""
            )

            .map(roommate => ({
                name: roommate.name,
                gender: roommate.gender,
                age: roommate.age
            }));


        if (availableRoommates.length === 0) {

            return res.status(404).json({
                success: false,
                message: "No roommate details are available."
            });

        }


        return res.status(200).json({
            success: true,
            roommates: availableRoommates
        });

    })
);


// =====================================
// SHOW PROPERTY DETAILS
// GET /listings/:id
// KEEP THIS ROUTE LAST
// =====================================

router.get(
    "/:id",

    asyncWrap(async (req, res) => {

        const { id } = req.params;


        const listing = await Listing.findById(id)
            .populate("reviews");


        if (!listing) {

            throw new ExpressError(
                404,
                "Listing not found"
            );

        }


        // FETCH REVIEWS

        const reviews = await Review.find({
            listing: id
        })

            .populate("user")

            .sort({
                createdAt: -1
            });


        const totalReviews = await Review.countDocuments({
            listing: id
        });


        // AVERAGE RATING

        const ratingData = await Review.aggregate([

            {
                $match: {
                    listing: listing._id
                }
            },

            {
                $group: {

                    _id: null,

                    average: {
                        $avg: "$rating"
                    }

                }
            }

        ]);


        let averageRating = 0;

        if (ratingData.length > 0) {

            averageRating = Number(
                ratingData[0].average
            ).toFixed(1);

        }


        // CHECK CURRENT USER IS LISTING OWNER

        const isListingOwner = Boolean(

            req.user &&

            listing.owner &&

            listing.owner.toString() === req.user._id.toString()

        );


        // ROOMMATE DETAILS VISIBILITY

        const availableRoommates = (listing.roommates || []).filter(
            roommate =>
                roommate.name &&
                roommate.name.trim() !== ""
        );


        const hasRoommateDetails = availableRoommates.length > 0;

        const showRoommates =
            Boolean(req.user) &&
            req.query.showRoommates === "1" &&
            hasRoommateDetails;


        // RENDER PROPERTY PAGE

        res.render(
            "routeListings/show.ejs",
            {
                listing,
                reviews,
                totalReviews,
                averageRating,
                isListingOwner,

                hasRoommateDetails,
                showRoommates,

                availableRoommates: showRoommates
                    ? availableRoommates
                    : []
            }
        );

    })
);


// =====================================
// EXPORT ROUTER
// =====================================

module.exports = router;
