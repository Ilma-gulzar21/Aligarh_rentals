const express = require("express");
const router = express.Router();

const User = require("../models/userListing/users.js");
const asyncWrap = require("../utils/asyncWrap.js");
const passport = require("passport");


// =====================================
// SAFE REDIRECT HELPER
// =====================================

const getSafeRedirect = (url) => {

    if (
        typeof url === "string" &&
        url.startsWith("/") &&
        !url.startsWith("//")
    ) {
        return url;
    }

    return "/listings";
};


// =====================================
// SIGNUP FORM
// =====================================

router.get("/signup", (req, res) => {

    if (req.query.redirect) {

        req.session.redirectUrl = getSafeRedirect(
            req.query.redirect
        );
    }

    res.render("users/signup", {
        redirectUrl: req.session.redirectUrl || ""
    });
});


// =====================================
// CREATE ACCOUNT
// =====================================

router.post(
    "/signup",
    asyncWrap(async (req, res, next) => {

        try {

            const {
                fullName,
                email,
                phone,
                password,
                role
            } = req.body;

            if (!email && !phone) {

                req.flash(
                    "error",
                    "Please enter your email address or mobile number."
                );

                return res.redirect("/signup");
            }

            const username = email || phone;

            const newUser = new User({
                username,
                fullName,
                email: email || undefined,
                phone: phone || undefined,
                role
            });

            const registeredUser = await User.register(
                newUser,
                password
            );

            req.login(registeredUser, (err) => {

                if (err) {
                    return next(err);
                }

                req.flash(
                    "success",
                    "Welcome to Aligarh Rentals! Your account has been created successfully."
                );

                const redirectUrl = getSafeRedirect(
                    req.body.redirect ||
                    req.session.redirectUrl
                );

                delete req.session.redirectUrl;

                req.session.save((saveErr) => {

                    if (saveErr) {
                        return next(saveErr);
                    }

                    res.redirect(redirectUrl);
                });
            });

        } catch (err) {

            if (err.name === "UserExistsError") {

                req.flash(
                    "error",
                    "An account already exists with this email or mobile number."
                );

            } else {

                req.flash("error", err.message);
            }

            res.redirect("/signup");
        }
    })
);


// =====================================
// LOGIN PAGE
// =====================================

router.get("/login", (req, res) => {

    if (req.query.redirect) {

        req.session.redirectUrl = getSafeRedirect(
            req.query.redirect
        );
    }

    res.render("users/login", {
        redirectUrl: req.session.redirectUrl || ""
    });
});


// =====================================
// LOGIN USER
// =====================================

router.post(
    "/login",

    passport.authenticate("local", {

        failureRedirect: "/login",
        failureFlash: true

    }),

    (req, res, next) => {

        req.flash(
            "success",
            "Welcome back to ALIGARH RENTALS!"
        );

        // First preference: hidden form input
        // Second preference: saved session URL

        const redirectUrl = getSafeRedirect(
            req.body.redirect ||
            req.session.redirectUrl
        );

        // Clear saved redirect

        delete req.session.redirectUrl;

        // Save session before redirecting

        req.session.save((err) => {

            if (err) {
                return next(err);
            }

            res.redirect(redirectUrl);
        });
    }
);


// =====================================
// LOGOUT
// =====================================

router.get("/logout", (req, res, next) => {

    req.logout((err) => {

        if (err) {
            return next(err);
        }

        req.flash(
            "success",
            "You have been logged out successfully"
        );

        res.redirect("/listings");
    });
});


// =====================================
// EXPORT ROUTER
// =====================================

module.exports = router;