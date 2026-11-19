// ================= LISTING SLIDER =================
document.addEventListener("DOMContentLoaded", function () {

    const slider = document.getElementById("slider");
    const prevBtn = document.getElementById("slidePrev");
    const nextBtn = document.getElementById("slideNext");

    if (!slider) {
        return;
    }

    // ek card + gap ki width
    function getStep() {
        const card = slider.querySelector(".pc-card");
        if (!card) return slider.clientWidth;

        const gap = parseInt(getComputedStyle(slider).columnGap) || 22;
        return card.offsetWidth + gap;
    }

    function isAtEnd() {
        return slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 5;
    }

    function slideNext() {
        if (isAtEnd()) {
            slider.scrollLeft = 0;
        } else {
            slider.scrollLeft += getStep();
        }
    }

    function slidePrev() {
        if (slider.scrollLeft <= 5) {
            slider.scrollLeft = slider.scrollWidth;
        } else {
            slider.scrollLeft -= getStep();
        }
    }

    if (nextBtn) nextBtn.addEventListener("click", slideNext);
    if (prevBtn) prevBtn.addEventListener("click", slidePrev);


    // auto slide: har 4 second
    let timer = setInterval(slideNext, 4000);

    function stopAuto() {
        clearInterval(timer);
    }

    function startAuto() {
        stopAuto();
        timer = setInterval(slideNext, 4000);
    }

    slider.addEventListener("mouseenter", stopAuto);
    slider.addEventListener("mouseleave", startAuto);


    // mobile swipe
    let startX = 0;

    slider.addEventListener("touchstart", function (e) {
        startX = e.touches[0].clientX;
        stopAuto();
    }, { passive: true });

    slider.addEventListener("touchend", function (e) {
        const diff = startX - e.changedTouches[0].clientX;

        if (diff > 50) slideNext();
        if (diff < -50) slidePrev();

        startAuto();
    });

});