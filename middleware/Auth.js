const Listing = require("../models/propertyOwnerListing/listing");

// =====================================
// CHECK LOGIN
// =====================================

module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {

        req.session.redirectUrl = req.originalUrl;

        req.flash(
            "error",
            "You must be logged in to upload your property"
        );

        return req.session.save((err) => {

            if (err) {
                console.error("Session save error:", err);
                return res.redirect("/login");
            }

            res.redirect("/login");
        });
    }

    next();
};


// =====================================
// CHECK OWNER ROLE
// =====================================

module.exports.isOwnerRole = (req, res, next) => {

    if (!req.isAuthenticated()) {

        req.flash("error", "Please login first.");

        return res.redirect("/login");
    }

    if (req.user.role !== "Owner") {

        req.flash(
            "error",
            "Please switch to Owner account to post a property."
        );

        return res.redirect("/listings/dashboard");
    }

    next();
};


// =====================================
// LOGIN REQUIRED FOR OWNER DETAILS
// =====================================

module.exports.isLoggedInForOwnerDetails = (req, res, next) => {

    if (!req.isAuthenticated()) {

        const { id } = req.params;
        const propertyUrl = `/listings/${id}`;

        req.session.redirectUrl = propertyUrl;

        req.flash(
            "error",
            "Please login or create an account to view owner details."
        );

        return req.session.save((err) => {

            if (err) {
                console.error("Session save error:", err);
                return res.redirect("/login");
            }

            res.redirect(
                `/login?redirect=${encodeURIComponent(propertyUrl)}`
            );
        });
    }

    next();
};


// =====================================
// LOGIN REQUIRED FOR ROOMMATE DETAILS
// =====================================

module.exports.isLoggedInForRoommateDetails = (req, res, next) => {

    const { id } = req.params;

    const propertyUrl = `/listings/${id}?showRoommates=1`;

    if (!req.isAuthenticated()) {

        req.session.redirectUrl = propertyUrl;

        req.flash(
            "error",
            "Please login to view roommate details."
        );

        return req.session.save((err) => {

            if (err) {
                console.error("Session save error:", err);
                return res.redirect("/login");
            }

            res.redirect(
                `/login?redirect=${encodeURIComponent(propertyUrl)}`
            );
        });
    }

    next();
};


// =====================================
// SAVE REDIRECT URL
// =====================================

module.exports.redirectSave = (req, res, next) => {

    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
};


// =====================================
// CHECK PROPERTY OWNER
// =====================================

module.exports.isOwner = async (req, res, next) => {

    try {

        const { id } = req.params;

        const listing = await Listing.findById(id);

        if (!listing) {

            req.flash("error", "Listing not found.");

            return res.redirect("/listings");
        }

        if (
            !listing.owner ||
            !req.user ||
            listing.owner.toString() !== req.user._id.toString()
        ) {

            req.flash(
                "error",
                "You are not authorized to modify this listing."
            );

            return res.redirect(`/listings/${id}`);
        }

        next();

    } catch (err) {

        console.log("Owner Authorization Error:", err);

        req.flash("error", "Something went wrong.");

        return res.redirect("/listings");
    }
};