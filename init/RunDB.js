const mongoose = require("mongoose");

const initdata = require("./dbCollectionData/propertiesData.js");

const Listing = require("../models/propertyOwnerListing/listing.js");


const url = "mongodb://127.0.0.1:27017/Nestlust";



// DATABASE CONNECTION

main()
.then(()=>{

    console.log("Connection successfull");

})
.catch((err)=>{

    console.log("Database connection error:", err);

});



async function main(){

    await mongoose.connect(url);

}




// INITIALIZE DATABASE

const initDB = async()=>{


    try{


        await Listing.deleteMany({});


        await Listing.insertMany(initdata.data);


        console.log("Data was initialized successfully");


    }

    catch(err){

        console.log("Error while inserting data:", err);

    }

    finally{

        mongoose.connection.close();

    }


};




initDB();

// const mongoose = require("mongoose");
// const userData = require("./dbCollectionData/usersData.js");
// const User = require("../models/userListing/users.js");
// let url = "mongodb://127.0.0.1:27017/Nestlust";

// //connection of mongodb
// main().then((res)=>{
//     console.log("Connection successfull");
// }).catch((err)=>{
//     console.log("error occured in database");
// });

// async function main(){
//   await mongoose.connect(url);
// }

// const initDB = async() =>{
//   await User.deleteMany({});
//   await User.insertMany(userData.users);
//   console.log("data was initilize");
// }

//   initDB();






// const mongoose = require("mongoose");
// const roommateData = require("./dbCollectionData/roommateData.js");
// const roommate = require("../models/roommateListing/roommate.js");
// let url = "mongodb://127.0.0.1:27017/Nestlust";

// //connection of mongodb
// main().then((res)=>{
//     console.log("Connection successfull");
// }).catch((err)=>{
//     console.log("error occured in database");
// });

// async function main(){
//   await mongoose.connect(url);
// }

// const initroommate = async() =>{
//   await roommate.deleteMany({});
//   await roommate.insertMany(roommateData.roommates);
//   console.log("data was initilize");
// }
// initroommate();








// const mongoose = require("mongoose");
// const reviewsData = require("./dbCollectionData/reviewData.js");
// const reviews = require("../models/reviews/reviewListings.js");
// let url = "mongodb://127.0.0.1:27017/Nestlust";

// //connection of mongodb
// main().then((res)=>{
//     console.log("Connection successfull");
// }).catch((err)=>{
//     console.log("error occured in database");
// });

// async function main(){
//   await mongoose.connect(url);
// }

// const showReviews = async() =>{
//   await reviews.deleteMany({});
//   await reviews.insertMany(reviewsData.reviewData);
//   console.log("data was initilize");
// }
// showReviews();