const express = require("express");
const router = express.Router();


//User Benifit route
router.get(
    "/OwnerBenifits",
    (req,res)=>{
        res.render(
            "routeListings/ownerBenifits"
        );
    }
);
module.exports = router;