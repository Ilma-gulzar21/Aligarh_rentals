

































// =======================================================
// REVIEW FORM
// =======================================================

const reviewForm =
document.getElementById(
    "reviewForm"
);


// =======================================================
// INPUTS
// =======================================================

const reviewTitle =
document.querySelector(
'input[name="review[title]"]'
);


const reviewComment =
document.querySelector(
'textarea[name="review[comment]"]'
);


const reviewRatings =
document.querySelectorAll(
'input[name="review[rating]"]'
);



// =======================================================
// FEEDBACK
// =======================================================

function showReviewFeedback(
    input,
    message,
    type
){

    let parent =
    input.parentElement;


    // Rating ke liye alag feedback nahi
    // Star ke upar green/red nahi dikhana

    if(
        input.name==="review[rating]"
    ){

        return;

    }



    let old =
    parent.querySelector(
        ".ar-review-feedback"
    );


    if(old){

        old.remove();

    }



    let feedback =
    document.createElement("div");


    feedback.className =
    "ar-review-feedback";


    feedback.innerText =
    message;



    parent.appendChild(
        feedback
    );



    if(type==="success"){


        input.classList.add(
            "ar-review-valid"
        );


        input.classList.remove(
            "ar-review-invalid"
        );


        feedback.classList.add(
            "ar-review-success-msg"
        );


    }

    else{


        input.classList.add(
            "ar-review-invalid"
        );


        input.classList.remove(
            "ar-review-valid"
        );


        feedback.classList.add(
            "ar-review-error-msg"
        );


    }


}



// =======================================================
// REMOVE FEEDBACK
// =======================================================

function removeReviewFeedback(
    input
){


    let parent =
    input.parentElement;



    let old =
    parent.querySelector(
        ".ar-review-feedback"
    );



    if(old){

        old.remove();

    }



    input.classList.remove(

        "ar-review-valid",

        "ar-review-invalid"

    );


}



// =======================================================
// FIELD VALIDATION
// =======================================================

function checkReviewField(input){


    let value =
    input.value.trim();


    let name =
    input.name;



// =======================================================
// REVIEW TITLE VALIDATION
// TITLE REQUIRED NAHI HAI
// =======================================================


if(
    name==="review[title]"
){


    // blank allow hai

    if(
        value === ""
    ){

        removeReviewFeedback(input);

        return true;

    }




    // MIN LENGTH

    if(
        value.length < 3
    ){


        showReviewFeedback(

            input,

            "Review title must contain at least 3 characters",

            "error"

        );


        return false;


    }





    // MAX LENGTH

    if(
        value.length > 80
    ){


        showReviewFeedback(

            input,

            "Review title cannot exceed 80 characters",

            "error"

        );


        return false;


    }






    // ONLY LETTERS AND SPACE

    let titlePattern =
    /^[A-Za-z\s]+$/;



    if(
        !titlePattern.test(value)
    ){


        showReviewFeedback(

            input,

            "Review title can contain only letters and spaces",

            "error"

        );


        return false;


    }






    // MULTIPLE SPACES

    if(
        /\s{2,}/.test(value)
    ){


        showReviewFeedback(

            input,

            "Avoid multiple spaces in title",

            "error"

        );


        return false;


    }





    showReviewFeedback(

        input,

        "Review title looks good",

        "success"

    );


    return true;


}






// =======================================================
// COMMENT VALIDATION
// =======================================================

if(
    name==="review[comment]"
){


    if(
        value === ""
    ){


        showReviewFeedback(

            input,

            "Review comment is required",

            "error"

        );


        return false;


    }





    if(
        value.length < 3
    ){


        showReviewFeedback(

            input,

            "Review comment must contain at least 3 characters",

            "error"

        );


        return false;


    }





    if(
        value.length > 1000
    ){


        showReviewFeedback(

            input,

            "Review comment cannot exceed 1000 characters",

            "error"

        );


        return false;


    }





    showReviewFeedback(

        input,

        "Review comment added successfully",

        "success"

    );


    return true;
}

}
// =======================================================
// RATING VALIDATION
// ONLY CHECK ON SUBMIT
// NO GREEN MESSAGE ON STAR CLICK
// =======================================================

function checkRating(){


    let selectedRating =
    document.querySelector(
        'input[name="review[rating]"]:checked'
    );



    let ratingContainer =
    document.querySelector(
        ".ar-stars"
    );



    // old rating error remove

    let old =
    ratingContainer.parentElement.querySelector(
        ".ar-review-feedback"
    );


    if(old){

        old.remove();

    }




    if(!selectedRating){


        let feedback =
        document.createElement("div");


        feedback.className =
        "ar-review-feedback ar-review-error-msg";


        feedback.innerText =
        "Please select your rating";



        ratingContainer.parentElement.appendChild(
            feedback
        );



        return false;


    }




    return true;


}







// =======================================================
// BLUR VALIDATION
// =======================================================


// TITLE

reviewTitle?.addEventListener(

"blur",

()=>{

    checkReviewField(reviewTitle);

}

);




// COMMENT

reviewComment?.addEventListener(

"blur",

()=>{

    checkReviewField(reviewComment);

}

);







// =======================================================
// LIVE INPUT VALIDATION
// =======================================================


// TITLE

reviewTitle?.addEventListener(

"input",

()=>{

    checkReviewField(reviewTitle);

}

);





// COMMENT

reviewComment?.addEventListener(

"input",

()=>{

    checkReviewField(reviewComment);

}

);







// =======================================================
// RATING CHANGE
// NO MESSAGE HERE
// =======================================================


reviewRatings.forEach(

(radio)=>{


    radio.addEventListener(

        "change",

        ()=>{


            // kuch nahi karna
            // sirf star select hoga


            let ratingError =
            document.querySelector(
                ".ar-stars + .ar-review-feedback"
            );


            if(ratingError){

                ratingError.remove();

            }


        }

    );


}

);








// =======================================================
// FORM SUBMIT VALIDATION
// =======================================================


reviewForm?.addEventListener(

"submit",

(e)=>{


    let isValid = true;


    let firstErrorField = null;





    // ===============================
    // TITLE CHECK
    // ===============================

    if(
        reviewTitle &&
        !checkReviewField(reviewTitle)
    ){


        isValid = false;


        firstErrorField =
        reviewTitle;


    }







    // ===============================
    // COMMENT CHECK
    // ===============================


    if(
        reviewComment &&
        !checkReviewField(reviewComment)
    ){


        isValid = false;


        if(!firstErrorField){


            firstErrorField =
            reviewComment;


        }


    }







    // ===============================
    // RATING CHECK
    // ===============================


    if(
        !checkRating()
    ){


        isValid = false;


        if(!firstErrorField){


            firstErrorField =
            document.querySelector(
                ".ar-stars"
            );


        }


    }







    // ===============================
    // STOP SUBMIT
    // ===============================


    if(!isValid){


        e.preventDefault();



        if(firstErrorField){


            firstErrorField.scrollIntoView({

                behavior:"smooth",

                block:"center"

            });


        }


    }



});