
document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // PROPERTY GALLERY
    // =====================================

    const gallery = document.querySelector(".ar-gallery-container");

    let propertyImages = [];

    if (gallery) {
        try {
            propertyImages = JSON.parse(gallery.dataset.images || "[]")
                .filter(image => typeof image === "string" && image.trim() !== "");
        } catch (error) {
            console.error("Image loading error:", error);
        }
    }

    let currentIndex = 0;
    let autoSlideInterval = null;
    let touchStartX = 0;
    let touchEndX = 0;


    // =====================================
    // SLIDER ELEMENTS
    // =====================================

    const mainSliderImage = document.getElementById("mainSliderImage");
    const prevSlide = document.getElementById("prevSlide");
    const nextSlide = document.getElementById("nextSlide");
    const sliderCounter = document.getElementById("sliderCounter");

    const indicators = document.querySelectorAll(".ar-slider-indicator");


    // =====================================
    // FULLSCREEN VIEWER ELEMENTS
    // =====================================

    const viewer = document.getElementById("imageViewer");
    const viewerImage = document.getElementById("viewerImage");
    const closeViewer = document.getElementById("closeViewer");
    const nextBtn = document.getElementById("nextImage");
    const prevBtn = document.getElementById("prevImage");
    const imageCounter = document.getElementById("imageCounter");


    // =====================================
    // CHECK VIEWER STATUS
    // =====================================

    function isViewerOpen() {
        return viewer && viewer.classList.contains("active");
    }


    // =====================================
    // UPDATE COUNTERS
    // =====================================

    function updateCounters() {

        if (!propertyImages.length) return;

        const text = `${currentIndex + 1} / ${propertyImages.length}`;

        if (sliderCounter) {
            sliderCounter.textContent = text;
        }

        if (imageCounter) {
            imageCounter.textContent = text;
        }
    }


    // =====================================
    // UPDATE IMAGE
    // =====================================

    function animateImage(imageElement, imageUrl) {

        if (!imageElement || !imageUrl) return;

        imageElement.classList.remove("ar-image-animate");

        void imageElement.offsetWidth;

        imageElement.src = imageUrl;

        imageElement.classList.add("ar-image-animate");
    }


    // =====================================
    // UPDATE SLIDER
    // =====================================

    function updateSlider() {

        if (!propertyImages.length) return;

        const imageUrl = propertyImages[currentIndex];

        animateImage(mainSliderImage, imageUrl);

        if (mainSliderImage) {
            mainSliderImage.dataset.index = currentIndex;
            mainSliderImage.alt = `Property image ${currentIndex + 1}`;
        }

        if (isViewerOpen()) {
            animateImage(viewerImage, imageUrl);
        }

        updateCounters();

        indicators.forEach((indicator, index) => {

            indicator.classList.toggle(
                "active",
                index === currentIndex
            );

        });
    }


    // =====================================
    // NEXT IMAGE
    // =====================================

    function nextImage() {

        if (propertyImages.length <= 1) return;

        currentIndex++;

        if (currentIndex >= propertyImages.length) {
            currentIndex = 0;
        }

        updateSlider();
    }


    // =====================================
    // PREVIOUS IMAGE
    // =====================================

    function previousImage() {

        if (propertyImages.length <= 1) return;

        currentIndex--;

        if (currentIndex < 0) {
            currentIndex = propertyImages.length - 1;
        }

        updateSlider();
    }


    // =====================================
    // GO TO SPECIFIC IMAGE
    // =====================================

    function goToImage(index) {

        if (
            !Number.isInteger(index) ||
            index < 0 ||
            index >= propertyImages.length
        ) {
            return;
        }

        currentIndex = index;

        updateSlider();
    }


    // =====================================
    // AUTOMATIC SLIDER
    // =====================================

    function stopAutoSlide() {

        if (autoSlideInterval !== null) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }


    function startAutoSlide() {

        stopAutoSlide();

        if (propertyImages.length <= 1) return;

        if (isViewerOpen()) return;

        autoSlideInterval = setInterval(() => {
            nextImage();
        }, 4500);
    }


    // =====================================
    // SLIDER BUTTON EVENTS
    // =====================================

    if (nextSlide) {

        nextSlide.addEventListener("click", event => {

            event.preventDefault();
            event.stopPropagation();

            nextImage();

            startAutoSlide();
        });
    }


    if (prevSlide) {

        prevSlide.addEventListener("click", event => {

            event.preventDefault();
            event.stopPropagation();

            previousImage();

            startAutoSlide();
        });
    }


    // =====================================
    // SLIDER INDICATORS
    // =====================================

    indicators.forEach(indicator => {

        indicator.addEventListener("click", () => {

            const index = Number(indicator.dataset.slide);

            goToImage(index);

            startAutoSlide();
        });
    });


    // =====================================
    // OPEN FULLSCREEN VIEWER
    // =====================================

    function openImageViewer(index) {

        if (!viewer || !viewerImage || !propertyImages.length) {
            return;
        }

        goToImage(index);

        viewer.classList.add("active");

        document.body.classList.add("ar-modal-open");

        stopAutoSlide();
    }


    // =====================================
    // CLOSE FULLSCREEN VIEWER
    // =====================================

    function closeImageViewer() {

        if (!viewer) return;

        viewer.classList.remove("active");

        document.body.classList.remove("ar-modal-open");

        startAutoSlide();
    }


    // =====================================
    // MAIN IMAGE CLICK
    // =====================================

    if (mainSliderImage) {

        mainSliderImage.addEventListener("click", () => {
            openImageViewer(currentIndex);
        });
    }


    // =====================================
    // FULLSCREEN BUTTON EVENTS
    // =====================================

    if (closeViewer) {

        closeViewer.addEventListener("click", event => {

            event.stopPropagation();

            closeImageViewer();
        });
    }


    if (nextBtn) {

        nextBtn.addEventListener("click", event => {

            event.stopPropagation();

            nextImage();
        });
    }


    if (prevBtn) {

        prevBtn.addEventListener("click", event => {

            event.stopPropagation();

            previousImage();
        });
    }


    // =====================================
    // KEYBOARD CONTROLS
    // =====================================

    document.addEventListener("keydown", event => {

        if (!isViewerOpen()) return;

        if (event.key === "ArrowRight") {
            nextImage();
        }

        if (event.key === "ArrowLeft") {
            previousImage();
        }

        if (event.key === "Escape") {
            closeImageViewer();
        }
    });


    // =====================================
    // CLICK OUTSIDE VIEWER
    // =====================================

    if (viewer) {

        viewer.addEventListener("click", event => {

            if (event.target === viewer) {
                closeImageViewer();
            }
        });
    }


    // =====================================
    // MOBILE SWIPE SUPPORT
    // =====================================

    function handleSwipe() {

        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) < 50) return;

        if (difference > 0) {
            nextImage();
        } else {
            previousImage();
        }
    }


    if (mainSliderImage) {

        mainSliderImage.addEventListener("touchstart", event => {

            touchStartX = event.changedTouches[0].screenX;

        }, { passive: true });


        mainSliderImage.addEventListener("touchend", event => {

            touchEndX = event.changedTouches[0].screenX;

            if (Math.abs(touchStartX - touchEndX) >= 50) {

                handleSwipe();

                startAutoSlide();
            }

        }, { passive: true });
    }


    if (viewerImage) {

        viewerImage.addEventListener("touchstart", event => {

            touchStartX = event.changedTouches[0].screenX;

        }, { passive: true });


        viewerImage.addEventListener("touchend", event => {

            touchEndX = event.changedTouches[0].screenX;

            if (Math.abs(touchStartX - touchEndX) >= 50) {
                handleSwipe();
            }

        }, { passive: true });
    }


    // =====================================
    // START SLIDER
    // =====================================

    if (propertyImages.length > 0) {

        updateSlider();

        startAutoSlide();
    }


    // =====================================
    // SHARE PROPERTY
    // =====================================

    const shareBtn = document.getElementById("sharePropertyBtn");

    if (shareBtn) {

        shareBtn.addEventListener("click", async () => {

            try {

                if (navigator.share) {

                    await navigator.share({
                        title: document.title,
                        url: window.location.href
                    });

                } else {

                    await navigator.clipboard.writeText(
                        window.location.href
                    );

                    alert("Property link copied successfully!");
                }

            } catch (error) {

                if (error.name !== "AbortError") {
                    console.error("Share error:", error);
                }
            }
        });
    }


    // =====================================
    // SAVE PROPERTY BUTTON
    // =====================================

    const saveBtn = document.querySelector(".ar-save-btn");

    if (saveBtn) {

        saveBtn.addEventListener("click", () => {

            const icon = saveBtn.querySelector("i");

            saveBtn.classList.toggle("active");

            if (!icon) return;

            if (saveBtn.classList.contains("active")) {

                icon.classList.remove("fa-regular");
                icon.classList.add("fa-solid");
                icon.style.color = "#e54865";

            } else {

                icon.classList.remove("fa-solid");
                icon.classList.add("fa-regular");
                icon.style.color = "";
            }
        });
    }


    // =====================================
    // VIEW OWNER DETAILS
    // =====================================

    const ownerBtn = document.getElementById("viewOwnerDetailsBtn");
    const ownerContainer = document.getElementById("ownerDetailsContainer");
    const ownerName = document.getElementById("ownerName");
    const ownerPhone = document.getElementById("ownerPhone");
    const ownerCallButton = document.getElementById("ownerCallButton");
    const ownerMessage = document.getElementById("ownerDetailsMessage");


    if (ownerBtn) {

        ownerBtn.addEventListener("click", async () => {

            const propertyId = ownerBtn.dataset.propertyId;

            if (!propertyId) {
                console.error("Property ID is missing.");
                return;
            }

            // Prevent multiple clicks

            ownerBtn.disabled = true;

            ownerBtn.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Loading...
            `;

            if (ownerMessage) {
                ownerMessage.innerText = "";
            }

            try {

                const response = await fetch(
                    `/listings/${encodeURIComponent(propertyId)}/owner`,
                    {
                        method: "GET",
                        credentials: "same-origin",
                        headers: {
                            "Accept": "application/json"
                        }
                    }
                );


                // =====================================
                // LOGIN REDIRECT HANDLING
                // =====================================

                if (response.redirected) {

                    window.location.assign(response.url);

                    return;
                }


                // =====================================
                // CHECK RESPONSE TYPE
                // =====================================

                const contentType = response.headers.get("content-type") || "";

                if (!contentType.includes("application/json")) {

                    throw new Error(
                        "Invalid server response. Please try again."
                    );
                }


                const data = await response.json();


                // =====================================
                // CHECK API RESPONSE
                // =====================================

                if (!response.ok || !data.success) {

                    throw new Error(
                        data.message || "Unable to load owner details."
                    );
                }


                // =====================================
                // DISPLAY OWNER NAME
                // =====================================

                if (ownerName) {

                    ownerName.innerText =
                        data.owner?.fullName || "Property Owner";
                }


                // =====================================
                // DISPLAY OWNER PHONE
                // =====================================

                const phone = data.owner?.phone
                    ? String(data.owner.phone).trim()
                    : "";


                if (ownerPhone) {

                    ownerPhone.innerText = phone || "Phone number not available";
                }


                // =====================================
                // CALL OWNER BUTTON
                // =====================================

                if (ownerCallButton) {

                    if (phone) {

                        ownerCallButton.href = `tel:${phone}`;

                        ownerCallButton.style.display = "inline-flex";

                    } else {

                        ownerCallButton.style.display = "none";
                    }
                }


                // =====================================
                // SHOW OWNER DETAILS CONTAINER
                // =====================================

                if (ownerContainer) {
                    ownerContainer.style.display = "block";
                }

                // Hide View Owner Details button

                ownerBtn.style.display = "none";


            } catch (error) {

                console.error("Owner details error:", error);

                if (ownerMessage) {

                    ownerMessage.innerText =
                        error.message || "Something went wrong.";
                }

                // Enable button again if request fails

                ownerBtn.disabled = false;

                ownerBtn.innerHTML = `
                    <i class="fa-solid fa-phone"></i>
                    View Owner Details
                `;
            }
        });
    }


    // =====================================
    // VIEW ROOMMATE DETAILS
    // =====================================

    const roommateBtn = document.getElementById(
        "viewRoommateDetailsBtn"
    );

    const roommateContainer = document.getElementById(
        "roommateDetailsSection"
    );

    const roommateGrid = document.getElementById(
        "roommateDetailsGrid"
    );

    const roommateMessage = document.getElementById(
        "roommateDetailsMessage"
    );


    // =====================================
    // LOAD ROOMMATE DETAILS
    // =====================================

    async function loadRoommateDetails() {

        if (!roommateBtn || !roommateContainer || !roommateGrid) {
            return;
        }

        const propertyId = roommateBtn.dataset.propertyId;

        if (!propertyId) {
            console.error("Property ID is missing.");
            return;
        }


        // Prevent multiple clicks

        roommateBtn.disabled = true;

        roommateBtn.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Loading...
        `;

        if (roommateMessage) {
            roommateMessage.innerText = "";
        }


        try {

            const response = await fetch(
                `/listings/${encodeURIComponent(propertyId)}/roommates`,
                {
                    method: "GET",
                    credentials: "same-origin",
                    headers: {
                        "Accept": "application/json"
                    }
                }
            );


            // =====================================
            // LOGIN REDIRECT HANDLING
            // =====================================

            if (response.redirected) {

                window.location.assign(response.url);

                return;
            }


            // =====================================
            // CHECK RESPONSE TYPE
            // =====================================

            const contentType =
                response.headers.get("content-type") || "";

            if (!contentType.includes("application/json")) {

                throw new Error(
                    "Invalid server response. Please try again."
                );
            }


            const data = await response.json();


            // =====================================
            // CHECK API RESPONSE
            // =====================================

            if (!response.ok || !data.success) {

                throw new Error(
                    data.message || "Unable to load roommate details."
                );
            }


            // =====================================
            // CHECK ROOMMATE DATA
            // =====================================

            if (!Array.isArray(data.roommates) || data.roommates.length === 0) {

                throw new Error(
                    "No roommate details are available."
                );
            }


            // =====================================
            // CLEAR OLD DETAILS
            // =====================================

            roommateGrid.replaceChildren();


            // =====================================
            // DISPLAY ROOMMATE CARDS
            // =====================================

            data.roommates.forEach(roommate => {

                const card = document.createElement("div");
                card.className = "ar-roommate-detail-card";


                // Avatar

                const avatar = document.createElement("div");
                avatar.className = "ar-roommate-avatar";

                const avatarIcon = document.createElement("i");
                avatarIcon.className = "fa-solid fa-user";

                avatar.appendChild(avatarIcon);


                // Information container

                const info = document.createElement("div");
                info.className = "ar-roommate-info";


                // Name

                const name = document.createElement("h3");
                name.textContent = roommate.name || "Roommate";

                info.appendChild(name);


                // Gender

                if (roommate.gender) {

                    const gender = document.createElement("p");

                    const genderIcon = document.createElement("i");
                    genderIcon.className = "fa-solid fa-venus-mars";

                    gender.appendChild(genderIcon);
                    gender.append(` ${roommate.gender}`);

                    info.appendChild(gender);
                }


                // Age

                if (roommate.age) {

                    const age = document.createElement("p");

                    const ageIcon = document.createElement("i");
                    ageIcon.className = "fa-solid fa-calendar";

                    age.appendChild(ageIcon);
                    age.append(` ${roommate.age} years old`);

                    info.appendChild(age);
                }


                card.appendChild(avatar);
                card.appendChild(info);

                roommateGrid.appendChild(card);

            });


            // =====================================
            // SHOW ROOMMATE DETAILS
            // =====================================

            roommateContainer.style.display = "block";

            roommateBtn.style.display = "none";


            // Scroll to details

            roommateContainer.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });


        } catch (error) {

            console.error("Roommate details error:", error);

            if (roommateMessage) {

                roommateMessage.innerText =
                    error.message || "Something went wrong.";
            }


            // Enable button again if request fails

            roommateBtn.disabled = false;

            roommateBtn.innerHTML = `
                <i class="fa-solid fa-eye"></i>
                View Roommate Details
            `;
        }
    }


    // =====================================
    // ROOMMATE BUTTON CLICK
    // =====================================

    if (roommateBtn) {

        roommateBtn.addEventListener("click", () => {

            loadRoommateDetails();

        });


        // =====================================
        // AUTO LOAD AFTER LOGIN
        // =====================================

        const urlParams = new URLSearchParams(
            window.location.search
        );

        if (urlParams.get("showRoommates") === "1") {

            loadRoommateDetails();

        }
    }


    // =====================================
    // SHOW ALL REVIEWS
    // =====================================

    const showAllReviewsBtn = document.getElementById(
        "arShowAllReviewsBtn"
    );

    if (showAllReviewsBtn) {

        showAllReviewsBtn.addEventListener("click", () => {

            const hiddenReviews = document.querySelectorAll(
                ".ar-hidden-review"
            );

            hiddenReviews.forEach(review => {
                review.style.display = "block";
            });

            showAllReviewsBtn.style.display = "none";
        });
    }


    // =====================================
    // SHOW MORE / LESS REVIEW COMMENTS
    // =====================================

    const reviewMoreButtons = document.querySelectorAll(
        ".ar-review-more-btn"
    );

    reviewMoreButtons.forEach(button => {

        button.addEventListener("click", () => {

            const comment = button.previousElementSibling;

            if (!comment) return;

            if (comment.classList.contains("collapsed")) {

                comment.classList.remove("collapsed");

                button.innerText = "Show less";

            } else {

                comment.classList.add("collapsed");

                button.innerText = "Show more";
            }
        });
    });

});
