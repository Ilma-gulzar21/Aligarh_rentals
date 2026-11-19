require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/userListing/users.js");
const ExpressError = require("./utils/ExpressError.js");

// ROUTES
const supportRoutes = require("./routes/helpSupport");
const listingRoutes = require("./routes/listingsRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const roommateRoutes = require("./routes/roommateRoutes");
const propertyTypeRoutes = require("./routes/propertyTypeRoutes");
const guideRoutes = require("./routes/guideRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const signInRoutes = require("./routes/signIn-Login.js");
const myPropertyRoutes = require("./routes/navOptions/MyPropertyRoutes");

const app = express();

// SERVER CONFIGURATION
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;


// =====================================
// DATABASE CONNECTION
// =====================================

async function main() {

    if (!MONGO_URL) {
        throw new Error("MONGO_URL is missing in environment variables");
    }

    await mongoose.connect(MONGO_URL);

    console.log("MongoDB Atlas connected successfully");
}


// =====================================
// BASIC CONFIGURATION
// =====================================

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");

app.set(
    "views",
    path.join(__dirname, "views")
);


// =====================================
// STATIC FILES
// =====================================

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);

app.use(methodOverride("_method"));


// =====================================
// SESSION CONFIGURATION
// =====================================

const sessionOptions = {

    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

};

app.use(session(sessionOptions));

app.use(flash());


// =====================================
// PASSPORT CONFIGURATION
// =====================================

app.use(passport.initialize());

app.use(passport.session());

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password"
        },
        User.authenticate()
    )
);

passport.serializeUser(
    User.serializeUser()
);

passport.deserializeUser(
    User.deserializeUser()
);


// =====================================
// DEFAULT EJS LOCALS
// =====================================

app.use((req, res, next) => {

    res.locals.areas = [];

    res.locals.propertyBudget = [];

    res.locals.preferredTenants = [];

    res.locals.bhkTypes = [];

    res.locals.currentUser = req.user || null;

    res.locals.success = req.flash("success");

    res.locals.error = req.flash("error");

    next();

});


// =====================================
// GLOBAL MIDDLEWARE
// =====================================

const globals = require("./middleware/global.js");

app.use(globals);


// =====================================
// REQUEST LOGGER
// =====================================

app.use((req, res, next) => {

    console.log(
        "REQUEST URL:",
        req.method,
        req.originalUrl
    );

    next();

});


// =====================================
// ROUTES
// =====================================

app.use("/listings", myPropertyRoutes);

app.use("/listings", supportRoutes);

app.use("/listings", guideRoutes);

app.use("/listings", propertyTypeRoutes);

app.use("/listings", roommateRoutes);

app.use("/listings", reviewRoutes);

app.use("/listings", ownerRoutes);

app.use("/listings", listingRoutes);

app.use("/", signInRoutes);


// =====================================
// 404 ERROR
// =====================================

app.use((req, res, next) => {

    next(
        new ExpressError(
            404,
            "Page Not Found"
        )
    );

});


// =====================================
// ERROR HANDLER
// =====================================

app.use((err, req, res, next) => {

    const {
        statusCode = 500,
        message = "Something went wrong"
    } = err;

    console.error(err);

    res.status(statusCode).render(
        "routeListings/error.ejs",
        {
            err: {
                statusCode,
                message
            }
        }
    );

});


// =====================================
// START SERVER AFTER DB CONNECTION
// =====================================

main()
    .then(() => {

        app.listen(PORT, "0.0.0.0", () => {

            console.log(
                `Server running on port ${PORT}`
            );

        });

    })
    .catch((err) => {

        console.error(
            "Database connection failed:",
            err
        );

        process.exit(1);

    });
