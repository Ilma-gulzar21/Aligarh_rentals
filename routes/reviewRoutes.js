const express = require("express");
const router = express.Router();

const Listing = require("../models/propertyOwnerListing/listing.js");
const Review = require("../models/reviews/reviewListings.js");

const asyncWrap = require("../utils/asyncWrap.js");
const ExpressError = require("../utils/ExpressError.js");

const validateReview = require("../middleware/reviewValidation.js");
const { isLoggedIn } = require("../middleware/Auth");


// =====================================
// POST REVIEW
// =====================================

router.post(
    "/:id/reviews",
    isLoggedIn,
    validateReview,

    asyncWrap(async (req, res) => {

        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            throw new ExpressError(404, "Listing not found");
        }

        if (!req.body.review) {
            throw new ExpressError(400, "Review details are required");
        }

        const review = new Review({
            title:
                req.body.review.title ||
                "The user did not provide a review title",

            rating: req.body.review.rating,
            comment: req.body.review.comment,

            listing: listing._id,
            user: req.user._id
        });

        await review.save();

        listing.reviews.push(review._id);

        await listing.save();

        req.flash(
            "success",
            "Thank you for your feedback! Your review has been submitted successfully."
        );

        res.redirect(`/listings/${listing._id}`);

    })
);


// =====================================
// DELETE REVIEW
// Only review owner can delete
// =====================================

router.delete(
    "/:listingId/reviews/:reviewId",
    isLoggedIn,

    asyncWrap(async (req, res) => {

        const { listingId, reviewId } = req.params;

        const listing = await Listing.findById(listingId);

        if (!listing) {
            throw new ExpressError(404, "Listing not found");
        }

        const review = await Review.findById(reviewId);

        if (!review) {
            req.flash("error", "Review not found.");
            return res.redirect(`/listings/${listingId}`);
        }

        // Check whether review belongs to this listing

        if (review.listing.toString() !== listingId) {
            throw new ExpressError(400, "Invalid review request");
        }

        // Check review ownership

        if (review.user.toString() !== req.user._id.toString()) {
            throw new ExpressError(
                403,
                "You are not authorized to delete this review."
            );
        }

        await Review.findByIdAndDelete(reviewId);

        // Remove review reference from listing

        listing.reviews.pull(reviewId);

        await listing.save();

        req.flash(
            "success",
            "Review deleted successfully."
        );

        res.redirect(`/listings/${listingId}`);

    })
);


module.exports = router;