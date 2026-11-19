// =====================================
// ALIGARH RENTALS FLASH MESSAGE
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    const overlay = document.querySelector(".ar-flash-overlay");

    if (!overlay) return;



    const closeBtn = overlay.querySelector(".ar-flash-close");

    const actionBtn = overlay.querySelector(".ar-flash-btn");



    function closeFlash() {

        overlay.style.opacity = "0";

        overlay.style.visibility = "hidden";

        overlay.style.pointerEvents = "none";

        overlay.style.transition = "all .35s ease";

        const card = overlay.querySelector(".ar-flash-card");

        if (card) {

            card.style.transform = "translateY(-30px) scale(.9)";

            card.style.opacity = "0";

            card.style.transition = "all .35s ease";

        }

        setTimeout(() => {

            overlay.remove();

        }, 350);

    }



    // Close Button

    if (closeBtn) {

        closeBtn.addEventListener("click", closeFlash);

    }



    // Continue / Try Again Button

    if (actionBtn) {

        actionBtn.addEventListener("click", closeFlash);

    }



    // ESC Key

    document.addEventListener("keydown", (e) => {

        if (e.key === "Escape") {

            closeFlash();

        }

    });



    // Click Outside Card

    overlay.addEventListener("click", (e) => {

        if (e.target === overlay) {

            closeFlash();

        }

    });



    // Auto Close After 5 Seconds

    setTimeout(() => {

        if (document.body.contains(overlay)) {

            closeFlash();

        }

    }, 5000);

});