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

    // cookie:{

    //     expires:
    //     Date.now() + 
    //     7 * 24 * 60 * 60 * 1000,

    //     maxAge:
    //     7 * 24 * 60 * 60 * 1000,

    //     httpOnly:true

    // }

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





// DEMO USER

// app.get("/demoUser", async(req,res)=>{

//     try{


//         const fakeUser = new User({

//             fullName:"Ilma Gulzar",

//             email:"ilma2@gmail.com",

//             phone:"9876543211",

//             role:"Tenant"

//         });


//         const registeredUser =
//         await User.register(
//             fakeUser,
//             "helloWorld@123"
//         );


//         console.log(registeredUser);


//         res.send(registeredUser);


//     }
//     catch(err){

//         res.send(err);

//     }

// });
app.use((req, res, next) => {
    console.log("REQUEST URL:", req.method, req.originalUrl);
    next();
});
// ROUTES
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


app.listen(port,()=>{

    console.log("server is created");

});










































// const express = require("express");
// const mongoose = require("mongoose");
// const path = require("path");
// const ejsMate = require("ejs-mate");
// const methodOverride = require("method-override");
// const session = require("express-session");
// const flash = require("connect-flash");

// const Listing = require("./models/propertyOwnerListing/listing.js");
// const User = require("./models/userListing/users.js");
// const Roommate = require("./models/roommateListing/roommate.js");
// const Review = require("./models/reviews/reviewListings.js");

// const asyncWrap = require("./utils/asyncWrap.js");
// const ExpressError = require("./utils/ExpressError.js");
// const upload = require("./utils/multer");


// const app = express();

// const port = 8080;

// const url = "mongodb://127.0.0.1:27017/Nestlust";


// // =======================================
// // BASIC MIDDLEWARE
// // =======================================


// app.use(express.json());

// app.use(
//     express.urlencoded({
//         extended:true
//     })
// );



// app.engine(
//     "ejs",
//     ejsMate
// );


// app.set(
//     "view engine",
//     "ejs"
// );


// app.set(
//     "views",
//     path.join(__dirname,"views")
// );



// app.use(
//     express.static(
//         path.join(__dirname,"public")
//     )
// );



// app.use(
//     "/uploads",
//     express.static(
//         path.join(__dirname,"uploads")
//     )
// );



// app.use(
//     methodOverride("_method")
// );




// // =======================================
// // REQUEST LOGGER
// // =======================================


// app.use((req,res,next)=>{

//     console.log("request received");

//     next();

// });





// // =======================================
// // DATABASE CONNECTION
// // =======================================


// main()

// .then(()=>{

//     console.log(
//         "Connection successful"
//     );

// })

// .catch((err)=>{

//     console.log(
//         "Database connection error:",
//         err.message
//     );

// });



// async function main(){

//     await mongoose.connect(url);

// }






// // =======================================
// // GLOBAL VARIABLES MIDDLEWARE
// // =======================================


// const globals = require("./middleware/global.js");


// app.use(globals);







// // =======================================
// // SESSION MIDDLEWARE
// // =======================================


// app.use(

//     session({

//         secret:"aligarhRentalsSecret",

//         resave:false,

//         saveUninitialized:true

//     })

// );






// // =======================================
// // FLASH MIDDLEWARE
// // =======================================


// app.use(
//     flash()
// );
// // ==========================================
// // INDEX / LISTINGS ROUTE
// // ==========================================

// app.get(
//     "/listings",
//     asyncWrap(async (req, res, next) => {

//         const {
//             availableFor,
//             area,
//             propertyType,
//             rentPrice,
//             bhk,
//             preferredTenant,
//             minPrice,
//             maxPrice
//         } = req.query;


//         let filter = {};


//         // AVAILABLE FOR FILTER

//         if (
//             availableFor &&
//             availableFor !== "All"
//         ) {

//             filter.availableFor = availableFor;

//         }



//         // AREA FILTER

//         if(area){

//             filter.area = area;

//         }



//         // PROPERTY TYPE FILTER

//         if(propertyType){

//             filter.propertyType = propertyType;

//         }



//         // BHK FILTER

//         if(bhk){

//             filter.bhk = {
//                 $regex:`^${bhk}$`,
//                 $options:"i"
//             };

//         }



//         // RENT PRICE FILTER

//         if(rentPrice){

//             filter.rentPrice = Number(rentPrice);

//         }



//         // PRICE RANGE FILTER

//         if(
//             minPrice &&
//             maxPrice
//         ){

//             filter.rentPrice = {

//                 $gte:Number(minPrice),

//                 $lte:Number(maxPrice)

//             };

//         }




//         // TENANT FILTER

//         if(preferredTenant){

//             filter.preferredTenant = {

//                 $regex:`^${preferredTenant}$`,

//                 $options:"i"

//             };

//         }



//         // FIND LISTINGS

//         const listings =
//         await Listing.find(filter);



//         // AREA PAGE

//         if(area){


//             const nearbyAreas =
//             await Listing.distinct("area");


//             return res.render(
//                 "routeListings/areawise",
//                 {

//                     listings,

//                     selectedArea:area,

//                     nearbyAreas,

//                     totalProperties:listings.length

//                 }
//             );


//         }




//         // PROPERTY TYPE / FILTER PAGE


//         if(
//             propertyType ||
//             minPrice ||
//             maxPrice ||
//             preferredTenant ||
//             bhk
//         ){


//             return res.render(
//                 "routeListings/tenantswise",
//                 {

//                     listings,

//                     propertyType,

//                     minPrice,

//                     maxPrice,

//                     bhk,

//                     preferredTenant,

//                     selectedArea:
//                     area || "",

//                     totalProperties:
//                     listings.length

//                 }
//             );


//         }






//         // HOME PAGE DATA


//         const rentPrices =
//         await Listing.distinct(
//             "rentPrice"
//         );


//         const areas =
//         await Listing.distinct(
//             "area"
//         );


//         const bhkTypes =
//         await Listing.distinct(
//             "bhk"
//         );


//         const preferredTenants =
//         await Listing.distinct(
//             "preferredTenant"
//         );



//         const roommates =
//         await Roommate.find({
//             status:"Open"
//         })
//         .limit(3);





//         // PROPERTY BUDGET


//         const propertyBudget =
//         await Listing.aggregate([

//             {

//                 $group:{

//                     _id:"$propertyType",

//                     maxPrice:{
//                         $max:"$rentPrice"
//                     },


//                     minPrice:{
//                         $min:"$rentPrice"
//                     }

//                 }

//             }

//         ]);





//         // TOTAL LISTINGS


//         const totalListings =
//         await Listing.countDocuments({});



//         // TOTAL OWNERS


//         const totalOwners =
//         await User.countDocuments({
//             role:"Owner"
//         });





//         // REVIEW STATS


//         const reviewStats =
//         await Review.aggregate([

//             {

//                 $match:{

//                     status:"Published"

//                 }

//             },

//             {

//                 $group:{

//                     _id:null,


//                     averageRating:{
//                         $avg:"$rating"
//                     },


//                     totalReviews:{
//                         $sum:1
//                     }


//                 }

//             }


//         ]);




//         const ratingData =
//         reviewStats[0] ||
//         {
//             averageRating:0,
//             totalReviews:0
//         };





//         // LATEST REVIEWS


//         const reviews =
//         await Review.find({
//             status:"Published"
//         })
//         .populate("user")
//         .sort({
//             createdAt:-1
//         })
//         .limit(6);






//         res.render(
//             "routeListings/index",
//             {

//                 listings,

//                 areas,

//                 bhkTypes,

//                 rentPrices,

//                 preferredTenants,


//                 propertyBudget,


//                 selected:
//                 availableFor || "All",


//                 selectedArea:
//                 area || "",


//                 roommates,


//                 totalListings,


//                 totalOwners,


//                 averageRating:
//                 Number(
//                     ratingData.averageRating
//                 )
//                 .toFixed(1),


//                 totalReviews:
//                 ratingData.totalReviews,


//                 reviews

//             }
//         );



//     })
// );
// // ==========================================
// // CREATE LISTING ROUTE
// // ==========================================


// app.post(
//     "/listings",
//     upload.array("images",10),

//     asyncWrap(async(req,res,next)=>{


//         // IMAGE VALIDATION

//         if(
//             !req.files ||
//             req.files.length === 0
//         ){

//             throw new ExpressError(
//                 400,
//                 "Please upload at least one property image"
//             );

//         }



//         // IMAGE DATA

//         const imageUrls =
//         req.files.map(file=>({

//             filename:file.filename,

//             url:"/uploads/"+file.filename

//         }));





//         // LANDMARK FILTER


//         const filteredLandmarks =

//         Array.isArray(
//             req.body.nearbyLandmarks
//         )

//         ?

//         req.body.nearbyLandmarks.filter(
//             landmark=>

//                 landmark.landmarkName &&
//                 landmark.distance

//         )

//         :

//         [];






//         // ROOMMATE FILTER


//         const filteredRoommates =

//         Array.isArray(
//             req.body.roommates
//         )

//         ?

//         req.body.roommates.filter(
//             roommate=>
//                 roommate.name

//         )

//         :

//         [];







//         // LISTING DATA


//         const listingData = {


//             ownerName:
//             req.body.ownerName,


//             ownerPhone:
//             req.body.ownerPhone,


//             ownerEmail:
//             req.body.ownerEmail,


//             responseTime:
//             req.body.responseTime,



//             title:
//             req.body.title,


//             description:
//             req.body.description,


//             propertyType:
//             req.body.propertyType,


//             bhk:
//             req.body.bhk,


//             furnishing:
//             req.body.furnishing,


//             availableFor:
//             req.body.availableFor,



//             rentPrice:
//             Number(req.body.rentPrice),


//             securityDeposit:
//             Number(req.body.securityDeposit),


//             // maintenanceCharge:
//             // Number(req.body.maintenanceCharge)
//             // || 0,



//             electricityIncluded:
//             req.body.electricityIncluded==="true",





//             area:
//             req.body.area,


//             city:
//             req.body.city,


//             country:
//             req.body.country,


//             pincode:
//             req.body.pincode,


//             fullAddress:
//             req.body.fullAddress,



//             googleMapLink:
//             req.body.googleMapLink || undefined,



//             nearbyLandmarks:
//             filteredLandmarks,




//             totalFloors:
//             Number(req.body.totalFloors),



//             floor:
//             Number(req.body.floor),




//             preferredTenant:
//             req.body.preferredTenant,



//             maxOccupants:
//             Number(req.body.maxOccupants),



//             currentOccupants:
//             Number(req.body.currentOccupants),



//             roommateAvailable:
//             req.body.roommateAvailable==="true",



//             roommates:
//             filteredRoommates,





//             availableFrom:
//             req.body.availableFrom,



//             minimumLeaseMonths:
//             Number(req.body.minimumLeaseMonths),



//             maximumLeaseMonths:
//             Number(req.body.maximumLeaseMonths),




//             status:
//             req.body.status,



//             images:
//             imageUrls



//         };







//         // CREATE LISTING


//         const listing =
//         new Listing(listingData);




//         await listing.save();






//         req.flash(
//             "success",
//             "Your property has been submitted successfully."
//         );



//         res.redirect("/listings");



//     })

// );
// // ==========================================
// // ROOMMATE FINDER ROUTE
// // ==========================================


// app.get(
//     "/listings/roommates",

//     asyncWrap(async(req,res)=>{


//         const roommateProperties =
//         await Listing.find({

//             roommateAvailable:true,

//             isActive:true,

//             status:"Available"

//         })
//         .sort({
//             createdAt:-1
//         });




//         const totalRequirements =
//         await Listing.countDocuments({

//             roommateAvailable:true,

//             isActive:true,

//             status:"Available"

//         });





//         const roommateAreas =
//         await Listing.distinct(
//             "area",
//             {
//                 roommateAvailable:true,
//                 isActive:true
//             }
//         );





//         const preferences =
//         await Listing.distinct(
//             "preferredTenant",
//             {
//                 roommateAvailable:true
//             }
//         );




//         res.render(
//             "routeListings/roommate",
//             {

//                 roommateProperties,

//                 totalRequirements,

//                 roommateAreas,

//                 preferences

//             }
//         );



//     })

// );









// // ==========================================
// // PROPERTY TYPE ROUTE
// // ==========================================


// app.get(
//     "/listings/type/:propertyType",

//     asyncWrap(async(req,res,next)=>{


//         const {
//             propertyType
//         } = req.params;




//         const listings =
//         await Listing.find({

//             propertyType:{

//                 $regex:`^${propertyType}$`,

//                 $options:"i"

//             }

//         });





//         if(
//             listings.length === 0
//         ){

//             throw new ExpressError(
//                 404,
//                 "No properties found for this property type"
//             );

//         }





//         const totalProperties =
//         listings.length;







//         const areas =
//         await Listing.distinct(
//             "area",
//             {

//                 propertyType:{

//                     $regex:`^${propertyType}$`,

//                     $options:"i"

//                 }

//             }
//         );







//         const bhkTypes =
//         await Listing.distinct(
//             "bhk",
//             {

//                 propertyType:{

//                     $regex:`^${propertyType}$`,

//                     $options:"i"

//                 }

//             }
//         );






//         res.render(
//             "routeListings/propertyType",
//             {

//                 listings,

//                 propertyType,

//                 totalProperties,

//                 areas,

//                 bhkTypes

//             }
//         );



//     })

// );









// // ==========================================
// // SEARCH ROUTE
// // ==========================================


// app.get(
//     "/search",

//     asyncWrap(async(req,res)=>{


//         const {
//             location,
//             type,
//             budget
//         }
//         =
//         req.query;




//         // Future search logic

//         res.redirect("/listings");



//     })

// );









// // ==========================================
// // RENT GUIDE ROUTE
// // ==========================================


// app.get(
//     "/listings/guide",

//     asyncWrap(async(req,res)=>{


//         const totalProperties =
//         await Listing.countDocuments({

//             status:"Available"

//         });




//         const areas =
//         await Listing.distinct(
//             "area"
//         );




//         const propertyTypes =
//         await Listing.distinct(
//             "propertyType"
//         );




//         const tenantTypes =
//         await Listing.distinct(
//             "preferredTenant"
//         );





//         const rentRange =
//         await Listing.aggregate([

//             {

//                 $group:{

//                     _id:null,


//                     minimumRent:{
//                         $min:"$rentPrice"
//                     },


//                     maximumRent:{
//                         $max:"$rentPrice"
//                     }


//                 }

//             }

//         ]);





//         const priceData =
//         rentRange[0] ||
//         {

//             minimumRent:0,

//             maximumRent:0

//         };






//         const popularAreas =
//         await Listing.aggregate([

//             {

//                 $group:{

//                     _id:"$area",

//                     count:{
//                         $sum:1
//                     }

//                 }

//             },

//             {

//                 $sort:{

//                     count:-1

//                 }

//             },

//             {

//                 $limit:6

//             }


//         ]);






//         res.render(
//             "routeListings/rentGuide",
//             {

//                 totalProperties,

//                 totalAreas:
//                 areas.length,


//                 propertyTypes,


//                 tenantTypes,


//                 minimumRent:
//                 priceData.minimumRent,


//                 maximumRent:
//                 priceData.maximumRent,


//                 popularAreas


//             }

//         );



//     })

// );









// // ==========================================
// // OWNER BENEFITS ROUTE
// // ==========================================


// app.get(
//     "/listings/OwnerBenifits",

//     asyncWrap(async(req,res)=>{


//         res.render(
//             "routeListings/ownerBenifits"
//         );


//     })

// );









// // ==========================================
// // NEW LISTING PAGE
// // ==========================================


// app.get(
//     "/listings/new",

//     (req,res)=>{


//         res.render(
//             "routeListings/postProperty"
//         );


//     }

// );
// // ==========================================
// // REQUEST LOGGER
// // ==========================================


// app.use((req,res,next)=>{


//     req.time =
//     new Date(Date.now()).toString();



//     console.log(
//         "Time = ",
//         req.time,

//         "\nMethod = ",
//         req.method,

//         "\nHostName = ",
//         req.hostname,

//         "\nPath = ",
//         req.path
//     );



//     next();


// });









// // ==========================================
// // 404 WILDCARD ROUTE
// // ==========================================


// // app.use(
// //     (req,res,next)=>{


// //         next(
// //             new ExpressError(
// //                 404,
// //                 "Page Not Found"
// //             )
// //         );


// //     }
// // );









// // ==========================================
// // GLOBAL ERROR HANDLER
// // ==========================================


// // app.use((err,req,res,next)=>{
// //     console.log(err);
// //     let {statusCode = 500,message = "Something went wrong"} = err;
// //     // MONGOOSE VALIDATION ERROR

// //     if(err.name === "ValidationError"){
// //         statusCode = 400;
// //         message = Object.values(err.errors).map(error=>error.message).join(", ");
// //     }

// //     // INVALID MONGODB ID
// //     if( err.name === "CastError"){
// //         statusCode = 400;
// //          message ="Invalid ID format";
// //      }

// //     // DUPLICATE DATA ERROR
// //     if(err.code === 11000){
// //         statusCode = 400;
// //         let field = Object.keys(err.keyValue)[0];
// //         message =`${field} already exists`;
// //     }                                    
// //     res.status(statusCode).render("routeListings/error.ejs",
// //         { statusCode,message }
// //         );
// //      }
// // );

// // SERVER START
// app.listen( port, ()=>{
//         console.log(`Server is running on port ${port}`);
//     }
// );























































