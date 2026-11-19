
//index route
// app.get("/listings", asyncWrap(async (req, res) => {
//     try {
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

//         // Available For
//         if (availableFor && availableFor !== "All") {
//             filter.availableFor = availableFor;
//         }

//         // Area Filter
//         if (area) {
//             filter.area = area;
//         }

//         // Property Type Filter

//         if (propertyType) {
//             filter.propertyType = propertyType;
//         }

//         // BHK Filter

//        if(bhk){
//          filter.bhk = {
//          $regex:`^${bhk}$`,
//          $options:"i"
//        };
//       }

//         // Rent Price
//         if (rentPrice) {
//             filter.rentPrice = Number(rentPrice);
//         }

//         // Budget Range
//         if (minPrice && maxPrice) {
//             filter.rentPrice = {
//                 $gte: Number(minPrice),
//                 $lte: Number(maxPrice)
//             };
//         }

//         // Preferred Tenant Filter
//            if(preferredTenant){
//              filter.preferredTenant = {
//              $regex:`^${preferredTenant}$`,
//              $options:"i"
//          };
//       }

//         // FIND LISTINGS
//         const listings = await Listing.find(filter);

//         // AREA PAGE
//         if (area) {
//             const nearbyAreas =
//                 await Listing.distinct("area");
//                     return res.render(
//                    "routeListings/areawise",
//                     {
//                     listings,
//                     selectedArea: area,
//                     nearbyAreas,
//                     totalProperties: listings.length
//                 }
//             );
//         }

//         // PROPERTY TYPE / BUDGET PAGE
//        if(propertyType || minPrice || maxPrice || preferredTenant || preferredTenant || bhk){
//          return res.render("routeListings/tenantswise",{
//         listings,
//         propertyType,
//         minPrice,
//         maxPrice,
//         bhk,
//         preferredTenant,
//         selectedArea: area || "",
//         totalProperties:listings.length
//                });
//          }


//         // HOME PAGE DATA
//         const rentPrices = await Listing.distinct("rentPrice");
//         const areas =  await Listing.distinct("area");
//         const bhkTypes = await Listing.distinct("bhk");
//         const preferredTenants = await Listing.distinct("preferredTenant");
//         const roommates = await Roommate.find({ status: "Open" }).limit(3);
             
//         // PROPERTY BUDGET
//         const propertyBudget =
//             await Listing.aggregate([
//                 {
//                     $group: {
//                         _id: "$propertyType",
//                         maxPrice: {
//                             $max: "$rentPrice"
//                         },
//                         minPrice: {
//                             $min: "$rentPrice"
//                         }
//                     }
//                 }
//             ]);

//         // TOTAL LISTINGS
//         const totalListings = await Listing.countDocuments({});
//         // TOTAL OWNERS
//         const totalOwners = await User.countDocuments({role: "Owner"});
//         // REVIEW STATISTICS
//         const reviewStats = await Review.aggregate([
//                {
//                     $match: {
//                         status: "Published"
//                     }
//                 },

//                 {
//                     $group: {
//                         _id: null,
//                         averageRating: {
//                             $avg: "$rating"
//                         },

//                         totalReviews: {
//                             $sum: 1
//                         }
//                     }
//                 }
//             ]);

//         const ratingData =
//             reviewStats[0] || { averageRating: 0,totalReviews: 0};

//         // LATEST REVIEWS
//         const reviews = await Review.find({ status: "Published"})
//             .populate("user")
//             .sort({createdAt: -1})
//             .limit(6);

//         // HOME PAGE RENDER
//         res.render(
//             "routeListings/index",
//             {
//                 listings,
//                 areas,
//                 bhkTypes,
//                 rentPrices,
//                 preferredTenants,
//                 propertyBudget,
//                 selected:availableFor || "All", selectedArea:area || "",
//                 roommates,
//                 totalListings,
//                 totalOwners,
//                 averageRating:Number(ratingData.averageRating).toFixed(1),
//                 totalReviews:ratingData.totalReviews,
//                 reviews
//             }
//         );
//     }
//     catch (err) {
//         console.log(err);
//         res.status(500)
//             .send("Server Error");
//     }
// }));

// POST CREATE LISTING ROUTE

// app.post(
//     "/listings",
//     upload.array("images", 10),
//     async (req, res, next) => {

//         try {


//             console.log("BODY:", req.body);
//             console.log("FILES:", req.files);



//             // ================================
//             // IMAGE HANDLING
//             // ================================


//             if(!req.files || req.files.length === 0){

//                 throw new ExpressError(
//                     400,
//                     "Please upload at least one property image"
//                 );

//             }


//           const imageUrls = req.files.map(file => ({

//     filename: file.filename,

//     url: "/uploads/" + file.filename

// }));
//             // ================================
//             // LANDMARK FILTER
//             // ================================


//             const filteredLandmarks =

//                 Array.isArray(req.body.nearbyLandmarks)

//                 ?

//                 req.body.nearbyLandmarks.filter(
//                     landmark =>
//                         landmark.landmarkName &&
//                         landmark.distance
//                 )

//                 :

//                 [];
//             // ===============================
//             // ROOMMATE FILTER
//             // ================================


//             const filteredRoommates =

//                 Array.isArray(req.body.roommates)

//                 ?

//                 req.body.roommates.filter(
//                     roommate =>
//                         roommate.name
//                 )

//                 :

//                 [];

//             // ================================
//             // LISTING DATA
//             // ================================

//             const listingData = {


//                 // OWNER INFORMATION

//                 ownerName:
//                     req.body.ownerName,

//                 ownerPhone:
//                     req.body.ownerPhone,

//                 ownerEmail:
//                     req.body.ownerEmail,
//                 responseTime:
//                     req.body.responseTime,


//                 // PROPERTY DETAILS


//                 title:
//                     req.body.title,


//                 description:
//                     req.body.description,

//                 propertyType:
//                     req.body.propertyType,


//                 bhk:
//                     req.body.bhk,


//                 furnishing:
//                     req.body.furnishing,
//                 availableFor:
//                     req.body.availableFor,

//                 // PRICE DETAILS


//                 rentPrice:
//                     Number(req.body.rentPrice),


//                 securityDeposit:
//                     Number(req.body.securityDeposit),


//                 maintenanceCharge: req.body.maintenanceCharge,



//                 electricityIncluded:
//                     req.body.electricityIncluded === "true",







//                 // LOCATION DETAILS


//                 area:
//                     req.body.area,


//                 city:
//                     req.body.city,


//                 country:
//                     req.body.country,


//                 pincode:
//                     req.body.pincode,


//                 fullAddress:
//                     req.body.fullAddress,


//                 googleMapLink:
//                     req.body.googleMapLink || undefined,


//                 // LANDMARKS

//                 nearbyLandmarks:
//                     filteredLandmarks,

//                 // BUILDING DETAILS
//                 totalFloors:
//                     Number(req.body.totalFloors),
//                 floor:
//                     Number(req.body.floor),

//                 // TENANT PREFERENCE


//                 preferredTenant:
//                     req.body.preferredTenant,


//                 maxOccupants:
//                     Number(req.body.maxOccupants),


//                 currentOccupants:
//                     Number(req.body.currentOccupants) || 0,
//                 roommateAvailable:
//                     req.body.roommateAvailable === "true",


//                 roommates:
//                     filteredRoommates,
//                 // LEASE DETAILS


//                 availableFrom:
//                     req.body.availableFrom,


//                 minimumLeaseMonths:
//                     Number(req.body.minimumLeaseMonths),


//                 maximumLeaseMonths:

//                     req.body.maximumLeaseMonths

//                     ?

//                     Number(req.body.maximumLeaseMonths)

//                     :

//                     undefined,








//                 // STATUS


//                 status:
//                     req.body.status,









//                 // IMAGES


//                 images:
//                     imageUrls




//             };









//             // ================================
//             // SAVE LISTING
//             // ================================


//             const listing = new Listing(listingData);



//             await listing.save();







//             req.flash(
//                 "success",
//                 "Your property has been submitted successfully."
//             );



//             res.redirect("/listings");






//         }


//         catch(err){

//             console.log(err);

//             next(err);

//         }

//     }
// );