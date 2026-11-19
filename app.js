const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const supportRoutes = require("./routes/helpSupport");
const User = require("./models/userListing/users.js");
const ExpressError = require("./utils/ExpressError.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const app = express();

const port = 8080;
const url = "mongodb://127.0.0.1:27017/Nestlust";


// DATABASE CONNECTION

main()
.then(()=>{
    console.log("Connection successfull");
})
.catch((err)=>{
    console.log(err);
});


async function main(){
    await mongoose.connect(url);
}



// ROUTES REQUIRE

const listingRoutes = require("./routes/listingsRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const roommateRoutes = require("./routes/roommateRoutes");
const propertyTypeRoutes = require("./routes/propertyTypeRoutes");
const guideRoutes = require("./routes/guideRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const signInRoutes = require("./routes/signIn-Login.js");
const myPropertyRoutes = require("./routes/navOptions/MyPropertyRoutes");


// BASIC CONFIG

app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set(
    "views",
    path.join(__dirname,"views")
);


app.use(
    express.static(
        path.join(__dirname,"public")
    )
);


app.use(
    "/uploads",
    express.static(
        path.join(__dirname,"uploads")
    )
);


app.use(methodOverride("_method"));




// SESSION

const sessionOptions = {

    secret:"aligarhRentalsSecret",

    resave:false,

    saveUninitialized:false,


};


app.use(session(sessionOptions));

app.use(flash());




// PASSPORT CONFIG


app.use(passport.initialize());

app.use(passport.session());



passport.use(

    new LocalStrategy(

        {
            usernameField:"email",
            passwordField:"password"
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




// GLOBAL MIDDLEWARE

const globals = require("./middleware/global.js");


app.use(globals);



// FLASH MESSAGE LOCALS

app.use((req,res,next)=>{

    res.locals.success = req.flash("success");

    res.locals.error = req.flash("error");


    res.locals.currentUser = req.user;


    next();

});




app.use((req, res, next) => {
    console.log("REQUEST URL:", req.method, req.originalUrl);
    next();
});
// ROUTES

app.use("/listings", myPropertyRoutes);
app.use("/listings", supportRoutes);

// GUIDE ROUTE
app.use("/listings", guideRoutes);
app.use("/listings", propertyTypeRoutes);
app.use("/listings", roommateRoutes);
app.use("/listings", reviewRoutes);
app.use("/listings", ownerRoutes);
app.use("/listings", listingRoutes)
app.use("/", signInRoutes);


// 404 ERROR

app.use((req,res,next)=>{

    next(
        new ExpressError(
            404,
            "Page Not Found"
        )
    );

});



// ERROR HANDLER

app.use((err,req,res,next)=>{

    let {
        statusCode=500,
        message="Something went wrong"

    } = err;


    console.log(err);


    res.status(statusCode)
    .render(
        "routeListings/error.ejs",
        {err}
    );

});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});



