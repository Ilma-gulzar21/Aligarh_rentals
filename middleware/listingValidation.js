const ExpressError = require("../utils/ExpressError");
const { postPropertyValidation } = require("../validation/postProperty");
//joi validation
const validateListing = (req,res,next) =>{
    let { error } =  postPropertyValidation.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) =>el.message).join(",");
        throw new ExpressError(400,errMsg);
} else {
    next();
}
}

module.exports = validateListing;