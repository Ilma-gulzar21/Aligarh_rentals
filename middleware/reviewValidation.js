const ExpressError = require("../utils/ExpressError");
const { reviewValidation } = require("../validation/postProperty");
//review joi validation
const validateReview = (req, res, next) => {
    console.log("BODY:",req.body);

    console.log("REVIEW:",req.body.review);
    // Body me review object hona chahiye
    if(!req.body || !req.body.review){

        throw new ExpressError(
            400,
            "Review data is required."
        );
    }

    // URL se listing id add kar do
    req.body.review.listing = req.params.id;

    const { error } = reviewValidation.validate(req.body.review);

    if (error) {

        const errMsg = error.details
            .map(el => el.message)
            .join(", ");

        throw new ExpressError(400, errMsg);
    }

    next();
};

module.exports = validateReview;