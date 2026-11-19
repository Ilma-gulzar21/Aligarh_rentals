const SupportRequest = require("../models/helpSupport");
// ======================================
// SHOW HELP & SUPPORT PAGE
// ======================================

// SHOW HELP & SUPPORT PAGE
module.exports.renderHelpSupport = (req, res) => {
    res.render("support/helpSupport", {
        pageTitle: "Help & Support | Aligarh Rentals",
        currUser: req.user || null
    });
};


// ======================================
// SUBMIT SUPPORT REQUEST
// ======================================

module.exports.createSupportRequest = async (req, res, next) => {
    try {
        const {
            name,
            email,
            category,
            subject,
            message
        } = req.body;

        // Basic validation
        if (
            !name?.trim() ||
            !email?.trim() ||
            !category ||
            !subject?.trim() ||
            !message?.trim()
        ) {
            req.flash("error", "Please fill in all required fields.");
            return res.redirect("/listings/help-support#contact");
        }
const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
        if (!validEmail) {
            req.flash("error", "Please enter a valid email address.");
            return res.redirect("/listings/help-support#contact");
        }

        if (name.trim().length > 80 ||
            subject.trim().length > 150 ||
            message.trim().length > 2000) {
            req.flash("error", "Please check the length of your information.");
            return res.redirect("/listings/help-support#contact");
        }

        const allowedCategories = [
            "Account & Login",
            "Property Listing",
            "Property Search",
            "Roommate & Flatmate",
            "Technical Issue",
            "Other"
        ];

        if (!allowedCategories.includes(category)) {
            req.flash("error", "Please select a valid support category.");
            return res.redirect("/listings/help-support#contact");
        }

        await SupportRequest.create({
            name: name.trim(),
            email: email.trim(),
            category,
            subject: subject.trim(),
            message: message.trim()
        });

        req.flash(
            "success",
            "Your support request has been submitted successfully. Thank you for contacting Aligarh Rentals!"
        );

        res.redirect("/listings/help-support#contact");

    } catch (error) {
        next(error);
    }
};