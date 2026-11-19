
// =================================================
// ADD LANDMARK
// =================================================

let landmarkIndex = 0;

const landmarkAddButton =
    document.getElementById("apnListAddLandmark");

const landmarkContainer =
    document.getElementById("apnListLandmarkContainer");


function createLandmarkRow(index) {

    console.log("CREATING LANDMARK INDEX:", index);

    return `
        <div class="apn-list-landmark-row">

            <div>
                <label>Landmark Name</label>

                <input
                    type="text"
                    name="nearbyLandmarks[${index}][landmarkName]"
                    class="apn-list-input"
                    placeholder="Example: AMU Gate"
                >
            </div>

            <div class="apn-list-landmark-distance-box">
                <label>Distance</label>

                <input
                    type="number"
                    step="0.1"
                    min="0"
                    name="nearbyLandmarks[${index}][distance]"
                    class="apn-list-input landmark-distance"
                    placeholder="Example: 1.5"
                    oninput="if(this.value < 0) this.value = ''"
                >
            </div>

            <div class="apn-list-landmark-unit-box">
                <label>Unit</label>

                <select
                    name="nearbyLandmarks[${index}][distanceUnit]"
                    class="apn-list-select landmark-unit"
                >
                    <option value="">Select Unit</option>
                    <option value="km">km</option>
                    <option value="meter">Meter</option>
                </select>
            </div>

        </div>
    `;
}


landmarkAddButton?.addEventListener("click", () => {

    landmarkContainer.insertAdjacentHTML(
        "beforeend",
        createLandmarkRow(landmarkIndex)
    );

    landmarkIndex++;

});


// =================================================
// ADD ROOMMATE
// =================================================

let roommateIndex = 1;

const roommateAddButton =
    document.getElementById("apnListAddRoommate");

const roommateContainer =
    document.getElementById("apnListRoommateContainer");


function createRoommateRow(index) {

    return `
        <div class="apn-list-roommate-row">

            <div>
                <label>Name</label>

                <input
                    type="text"
                    name="roommates[${index}][name]"
                    class="apn-list-input"
                    placeholder="Example: Sana"
                >
            </div>

            <div>
                <label>Gender</label>

                <select
                    name="roommates[${index}][gender]"
                    class="apn-list-select"
                >
                    <option value="">Select Gender</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                </select>
            </div>

            <div>
                <label>Age</label>

                <input
                    type="number"
                    name="roommates[${index}][age]"
                    class="apn-list-input"
                    placeholder="Example: 22"
                >
            </div>

        </div>
    `;
}


roommateAddButton?.addEventListener("click", () => {

    roommateContainer.insertAdjacentHTML(
        "beforeend",
        createRoommateRow(roommateIndex)
    );

    roommateIndex++;

});


// =================================================
// FEEDBACK FUNCTION
// =================================================

function showFeedback(input, message, type) {

    let oldFeedback =
        input.parentElement.querySelector(".apn-list-feedback");

    if (oldFeedback) {
        oldFeedback.remove();
    }

    let feedback = document.createElement("div");

    feedback.className = "apn-list-feedback";
    feedback.innerText = message;

    input.parentElement.appendChild(feedback);

    if (type === "success") {

        input.classList.add("apn-list-valid");
        input.classList.remove("apn-list-invalid");

        feedback.classList.add("apn-list-success-msg");

    } else {

        input.classList.add("apn-list-invalid");
        input.classList.remove("apn-list-valid");

        feedback.classList.add("apn-list-error-msg");

    }

}


// =================================================
// REMOVE FEEDBACK
// =================================================

function removeFeedback(input) {

    let feedback =
        input.parentElement.querySelector(".apn-list-feedback");

    if (feedback) {
        feedback.remove();
    }

    input.classList.remove(
        "apn-list-valid",
        "apn-list-invalid"
    );

}


// =================================================
// FIELD VALIDATION
// =================================================

function checkField(input) {

    let value = input.value.trim();
    let name = input.name;


    // =========================================
    // AGE VALIDATION
    // =========================================

    if (name.includes("[age]")) {

        let ageValue = Number(value);

        if (
            value === "" ||
            isNaN(ageValue) ||
            ageValue <= 0 ||
            ageValue > 100
        ) {

            showFeedback(
                input,
                "Age must be between 1 and 100",
                "error"
            );

            return false;

        }

        showFeedback(
            input,
            "Age added successfully",
            "success"
        );

        return true;

    }


    // =========================================
    // REQUIRED CHECK
    // =========================================

    if (input.required && value === "") {

        showFeedback(
            input,
            "This field is required",
            "error"
        );

        return false;

    }


    // =========================================
    // OPTIONAL EMPTY FIELD
    // =========================================

    if (!input.required && value === "") {

        removeFeedback(input);

        return true;

    }


    // =========================================
    // COUNTRY VALIDATION
    // =========================================

    if (name === "country") {

        if (value !== "India") {

            showFeedback(
                input,
                "Only India is allowed",
                "error"
            );

            return false;

        }

        showFeedback(
            input,
            "Country selected",
            "success"
        );

        return true;

    }


    // =========================================
    // EMAIL VALIDATION
    // =========================================

    if (input.type === "email") {

        let emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(value)) {

            showFeedback(
                input,
                "Enter a valid email address",
                "error"
            );

            return false;

        }

        showFeedback(
            input,
            "Email address verified",
            "success"
        );

        return true;

    }


    // =========================================
    // TITLE VALIDATION
    // =========================================

    if (name === "title") {

        if (value.length < 5) {

            showFeedback(
                input,
                "Property title must contain at least 5 characters",
                "error"
            );

            return false;

        }

        if (value.length > 100) {

            showFeedback(
                input,
                "Property title cannot exceed 100 characters",
                "error"
            );

            return false;

        }

        showFeedback(
            input,
            "Property title looks good",
            "success"
        );

        return true;

    }


    // =========================================
    // DESCRIPTION VALIDATION
    // =========================================

    if (name === "description") {

        if (value.length < 20) {

            showFeedback(
                input,
                "Description must contain at least 20 characters",
                "error"
            );

            return false;

        }

        if (value.length > 2000) {

            showFeedback(
                input,
                "Description cannot exceed 2000 characters",
                "error"
            );

            return false;

        }

        showFeedback(
            input,
            "Property description added",
            "success"
        );

        return true;

    }


    // =========================================
    // FULL ADDRESS VALIDATION
    // =========================================

    if (name === "fullAddress") {

        if (value.length < 10) {

            showFeedback(
                input,
                "Complete address must contain at least 10 characters",
                "error"
            );

            return false;

        }

        showFeedback(
            input,
            "Property address added",
            "success"
        );

        return true;

    }


    // =========================================
    // MOBILE VALIDATION
    // =========================================

    if (name === "ownerPhone") {

        let mobilePattern = /^[6-9]\d{9}$/;

        if (!mobilePattern.test(value)) {

            showFeedback(
                input,
                "Enter valid 10 digit mobile number",
                "error"
            );

            return false;

        }

        showFeedback(
            input,
            "Mobile number verified",
            "success"
        );

        return true;

    }


    // =========================================
    // PINCODE VALIDATION
    // =========================================

    if (name === "pincode") {

        let aligarhPincodes = [
            "202001",
            "202002",
            "202125",
            "202122",
            "202124",
            "202128",
            "202129",
            "202140"
        ];

        if (!/^\d{6}$/.test(value)) {

            showFeedback(
                input,
                "Enter valid 6 digit pincode",
                "error"
            );

            return false;

        }

        if (!aligarhPincodes.includes(value)) {

            showFeedback(
                input,
                "Invalid Aligarh pincode",
                "error"
            );

            return false;

        }

        showFeedback(
            input,
            "Pincode verified",
            "success"
        );

        return true;

    }


    // =========================================
    // FLOOR VALIDATION
    // =========================================

    if (
        name === "totalFloors" ||
        name === "floor"
    ) {

        let floorValue = Number(value);

        if (floorValue < 1) {

            showFeedback(
                input,
                "Floor must be at least 1",
                "error"
            );

            return false;

        }

        if (floorValue > 10) {

            showFeedback(
                input,
                "Maximum 10 floors are allowed",
                "error"
            );

            return false;

        }

        let totalFloors = Number(
            document.querySelector(
                'input[name="totalFloors"]'
            )?.value
        );

        let availableFloor = Number(
            document.querySelector(
                'input[name="floor"]'
            )?.value
        );

        if (
            name === "floor" &&
            totalFloors > 0 &&
            availableFloor > totalFloors
        ) {

            showFeedback(
                input,
                "Available floor cannot be greater than total floors",
                "error"
            );

            return false;

        }

        showFeedback(
            input,
            "Floor information added",
            "success"
        );

        return true;

    }


    // =========================================
    // DISTANCE VALIDATION
    // =========================================

    if (name.includes("[distance]")) {

        let distanceValue = Number(value);

        if (value !== "" && distanceValue < 0) {

            showFeedback(
                input,
                "Distance cannot be negative",
                "error"
            );

            return false;

        }

        showFeedback(
            input,
            "Distance added successfully",
            "success"
        );

        return true;

    }


    // =========================================
    // PRICE VALIDATION
    // =========================================

    if (name === "rentPrice") {

        if (Number(value) < 1) {

            showFeedback(
                input,
                "Monthly rent must be at least ₹1",
                "error"
            );

            return false;

        }

        showFeedback(
            input,
            "Monthly rent added",
            "success"
        );

        return true;

    }


    if (
        name === "securityDeposit" ||
        name === "maintenanceCharge"
    ) {

        if (Number(value) < 0) {

            showFeedback(
                input,
                "Amount cannot be negative",
                "error"
            );

            return false;

        }

        showFeedback(
            input,
            "Amount added successfully",
            "success"
        );

        return true;

    }


    // =========================================
    // MAX OCCUPANTS
    // =========================================

    if (name === "maxOccupants") {

        let max = Number(value);

        let current = Number(
            document.querySelector(
                'input[name="currentOccupants"]'
            )?.value
        );

        if (max < 1) {

            showFeedback(
                input,
                "Maximum occupants must be at least 1",
                "error"
            );

            return false;

        }

        if (current > max) {

            showFeedback(
                input,
                "Maximum occupants cannot be less than current occupants",
                "error"
            );

            return false;

        }

        showFeedback(
            input,
            "Maximum occupants added",
            "success"
        );

        return true;

    }


    // =========================================
    // CURRENT OCCUPANTS
    // =========================================

    if (name === "currentOccupants") {

        const roommateAvailable =
            document.getElementById(
                "apnListRoommateAvailable"
            )?.value;

        let current =
            value === "" ? "" : Number(value);

        let max = Number(
            document.querySelector(
                'input[name="maxOccupants"]'
            )?.value
        );

        if (
            roommateAvailable === "true" &&
            value === ""
        ) {

            showFeedback(
                input,
                "Current occupants are required because roommate is available",
                "error"
            );

            return false;

        }

        if (
            roommateAvailable !== "true" &&
            value === ""
        ) {

            removeFeedback(input);

            return true;

        }

        if (current < 1) {

            showFeedback(
                input,
                "Current occupants must be at least 1",
                "error"
            );

            return false;

        }

        if (max > 0 && current > max) {

            showFeedback(
                input,
                "Current occupants cannot exceed maximum occupants",
                "error"
            );

            return false;

        }

        showFeedback(
            input,
            "Current occupants added",
            "success"
        );

        return true;

    }


    // =========================================
    // MINIMUM LEASE PERIOD
    // =========================================

    if (name === "minimumLeaseMonths") {

        let minimumMonths = Number(value);

        let maximumMonths = Number(
            document.querySelector(
                'input[name="maximumLeaseMonths"]'
            )?.value
        );

        if (minimumMonths < 1) {

            showFeedback(
                input,
                "Minimum lease period must be at least 1 month",
                "error"
            );

            return false;

        }

        if (
            maximumMonths > 0 &&
            minimumMonths > maximumMonths
        ) {

            showFeedback(
                input,
                "Minimum lease months cannot be greater than maximum lease months",
                "error"
            );

            return false;

        }

        showFeedback(
            input,
            "Minimum lease period added",
            "success"
        );

        return true;

    }


    // =========================================
    // MAXIMUM LEASE PERIOD
    // =========================================

    if (name === "maximumLeaseMonths") {

        let maximumMonths = Number(value);

        let minimumMonths = Number(
            document.querySelector(
                'input[name="minimumLeaseMonths"]'
            )?.value
        );

        if (
            maximumMonths < 1 ||
            maximumMonths > 11
        ) {

            showFeedback(
                input,
                "Maximum lease period must be between 1 and 11 months",
                "error"
            );

            return false;

        }

        if (
            minimumMonths > 0 &&
            maximumMonths < minimumMonths
        ) {

            showFeedback(
                input,
                "Maximum lease months cannot be less than minimum lease months",
                "error"
            );

            return false;

        }

        showFeedback(
            input,
            "Maximum lease period added",
            "success"
        );

        return true;

    }


    // =========================================
    // SUCCESS MESSAGE
    // =========================================

    let successMessages = {

        ownerName: "Owner name added successfully",
        ownerEmail: "Email address verified",
        responseTime: "Response time selected",
        propertyType: "Property type selected",
        bhk: "BHK configuration selected",
        furnishing: "Furnishing type selected",
        availableFor: "Rental category selected",
        rentPrice: "Monthly rent added",
        securityDeposit: "Security deposit added",
        maintenanceCharge: "Maintenance charge added",
        electricityIncluded: "Electricity option selected",
        area: "Property area added",
        city: "City selected",
        country: "Country selected",
        fullAddress: "Property address added",
        googleMapLink: "Google Map link added",
        floor: "Floor information added",
        preferredTenant: "Tenant preference selected",
        maxOccupants: "Maximum occupants added",
        currentOccupants: "Current occupants added",
        roommateAvailable: "Roommate option selected",
        minimumLeaseMonths: "Minimum lease period added",
        maximumLeaseMonths: "Maximum lease period added",
        status: "Property status selected"

    };

    showFeedback(
        input,
        successMessages[name] || "Information added successfully",
        "success"
    );

    return true;

}


// =================================================
// BLUR VALIDATION
// =================================================

document
    .querySelectorAll(
        ".apn-list-input, .apn-list-select, .apn-list-textarea"
    )
    .forEach(input => {

        input.addEventListener("blur", () => {

            checkField(input);

        });

    });


// =================================================
// FORM VALIDATION
// =================================================

const apnForm =
    document.getElementById("apnListPropertyForm");

const roommateSelect =
    document.getElementById("apnListRoommateAvailable");

const roommateSection =
    document.getElementById("apnListRoommateSection");


// =================================================
// DETECT NEW OR EDIT PROPERTY PAGE
// =================================================

function isEditListingPage() {

    if (!apnForm) {
        return false;
    }

    // Explicit page identification, if supplied by EJS
    if (apnForm.dataset.page === "edit") {
        return true;
    }

    if (apnForm.dataset.page === "new") {
        return false;
    }

    // Fallback: detect edit form URL
    return /^\/listings\/[^/]+/.test(
        window.location.pathname
    );

}


// =================================================
// IMAGE VALIDATION
// =================================================

function validateListingImages() {

    if (!apnForm) {
        return true;
    }

    const imageInput =
        apnForm.querySelector(".apn-list-file-input");

    // If no image input exists, do not block submission
    if (!imageInput) {
        return true;
    }

    const images = imageInput.files;

    const isEditPage = isEditListingPage();

    // Minimum 3 images ONLY for new listing
    if (!isEditPage && images.length < 3) {

        alert(
            "Please upload at least 3 property images."
        );

        return false;

    }

    // Maximum 10 new images
    if (images.length > 10) {

        alert(
            "Maximum 10 images are allowed."
        );

        return false;

    }

    // Validate image size and file type
    for (let i = 0; i < images.length; i++) {

        const file = images[i];

        const size = file.size / (1024 * 1024);

        if (!file.type.startsWith("image/")) {

            alert(
                "Please select valid image files."
            );

            return false;

        }

        if (size > 5) {

            alert(
                "Each image should be smaller than 5MB."
            );

            return false;

        }

    }

    return true;

}


// =================================================
// FORM SUBMIT VALIDATION
// =================================================

apnForm?.addEventListener("submit", (e) => {

    let isValid = true;


    // =========================================
    // CURRENT OCCUPANTS REQUIRED WHEN ROOMMATE YES
    // =========================================

    if (
        roommateSelect &&
        roommateSelect.value === "true"
    ) {

        const currentInput =
            apnForm.querySelector(
                'input[name="currentOccupants"]'
            );

        if (
            currentInput &&
            currentInput.value.trim() === ""
        ) {

            showFeedback(
                currentInput,
                "Current occupants are required because roommate is available",
                "error"
            );

            isValid = false;

            currentInput.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            currentInput.focus();

        }

    }


    // =========================================
    // ROOMMATE VALIDATION
    // =========================================

    if (
        roommateSection &&
        roommateSection.style.display !== "none"
    ) {

        let roommateRows =
            roommateSection.querySelectorAll(
                ".apn-list-roommate-row"
            );

        roommateRows.forEach(row => {

            let name = row.querySelector(
                'input[name*="[name]"]'
            );

            let gender = row.querySelector(
                'select[name*="[gender]"]'
            );

            let age = row.querySelector(
                'input[name*="[age]"]'
            );

            if (
                name &&
                gender &&
                age &&
                name.value.trim() !== ""
            ) {

                if (gender.value === "") {

                    showFeedback(
                        gender,
                        "Please select gender",
                        "error"
                    );

                    isValid = false;

                }

                if (age.value.trim() === "") {

                    showFeedback(
                        age,
                        "Please enter age",
                        "error"
                    );

                    isValid = false;

                }

            }

        });

    }


    // =========================================
    // REMOVE EMPTY LANDMARK ROW
    // =========================================

    let landmarkRows =
        document.querySelectorAll(
            ".apn-list-landmark-row"
        );

    landmarkRows.forEach(row => {

        let name = row.querySelector(
            'input[name*="[landmarkName]"]'
        );

        if (
            name &&
            name.value.trim() === ""
        ) {

            row.remove();

        }

    });


    // =========================================
    // IMAGE VALIDATION
    // =========================================

    if (!validateListingImages()) {

        isValid = false;

    }


    // =========================================
    // STOP FORM SUBMISSION IF INVALID
    // =========================================

    if (!isValid) {

        e.preventDefault();

        let firstError =
            apnForm.querySelector(".apn-list-invalid");

        if (firstError) {

            firstError.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }

    }

});


// =================================================
// ROOMMATE SHOW / HIDE
// =================================================

function toggleRoommateSection() {

    if (
        !roommateSelect ||
        !roommateSection
    ) {

        return;

    }

    if (roommateSelect.value === "true") {

        roommateSection.style.display = "block";

    } else {

        roommateSection.style.display = "none";

        let fields =
            roommateSection.querySelectorAll(
                "input, select"
            );

        fields.forEach(field => {

            field.value = "";

            removeFeedback(field);

        });

    }

    updateStepNumbers();

}


roommateSelect?.addEventListener(
    "change",
    toggleRoommateSection
);


// =================================================
// STEP NUMBER UPDATE
// =================================================

function updateStepNumbers() {

    let sections =
        document.querySelectorAll(
            ".apn-list-step-section"
        );

    let step = 1;

    sections.forEach(section => {

        if (section.style.display !== "none") {

            let number =
                section.querySelector(
                    ".apn-list-step-number"
                );

            if (number) {

                number.innerText =
                    String(step).padStart(2, "0");

            }

            step++;

        }

    });

}


// =================================================
// PAGE LOAD
// =================================================

toggleRoommateSection();

updateStepNumbers();


// =================================================
// LANDMARK CONDITIONAL VALIDATION
// =================================================

function handleLandmark(row) {

    let nameInput =
        row.querySelector(
            'input[name*="[landmarkName]"]'
        );

    let distanceInput =
        row.querySelector(
            'input[name*="[distance]"]'
        );

    let unitSelect =
        row.querySelector(
            'select[name*="[distanceUnit]"]'
        );

    if (
        !nameInput ||
        !distanceInput ||
        !unitSelect
    ) {

        return;

    }

    nameInput.addEventListener("input", () => {

        if (nameInput.value.trim() !== "") {

            distanceInput.required = true;
            unitSelect.required = true;

        } else {

            distanceInput.required = false;
            unitSelect.required = false;

            distanceInput.value = "";
            unitSelect.value = "";

        }

    });

}


// =================================================
// EXISTING LANDMARK LISTENER
// =================================================

document
    .querySelectorAll(".apn-list-landmark-row")
    .forEach(row => {

        handleLandmark(row);

    });


// =================================================
// NEW LANDMARK LISTENER
// =================================================

const observer = new MutationObserver(() => {

    document
        .querySelectorAll(".apn-list-landmark-row")
        .forEach(row => {

            if (!row.dataset.checked) {

                handleLandmark(row);

                row.dataset.checked = "true";

            }

        });

});


if (landmarkContainer) {

    observer.observe(
        landmarkContainer,
        {
            childList: true
        }
    );

}


// =================================================
// DOM CONTENT LOADED
// =================================================

document.addEventListener("DOMContentLoaded", function () {

    const roommateSelect =
        document.getElementById(
            "apnListRoommateAvailable"
        );

    const roommateSection =
        document.getElementById(
            "apnListRoommateSection"
        );

    if (!roommateSelect || !roommateSection) {
        return;
    }

    function toggleRoommateSection() {

        if (roommateSelect.value === "true") {

            roommateSection.style.display = "block";

        } else {

            roommateSection.style.display = "none";

        }

    }

    roommateSelect.addEventListener(
        "change",
        toggleRoommateSection
    );

    toggleRoommateSection();

});