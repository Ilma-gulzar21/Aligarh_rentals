const express = require("express");
const router = express.Router();

const supportController = require("../controllers/helpSupport");

// Help & Support page
router.get(
    "/help-support",
    supportController.renderHelpSupport
);

// Submit support request
router.post(
    "/help-support",
    supportController.createSupportRequest
);

module.exports = router;