/* =========================================================
   ALIGARH RENTALS - NAVBAR JS
   Breakpoint CSS ke saath same: 1200px
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    /* ---------- ELEMENTS ---------- */

    const menuToggle  = document.getElementById("menuToggle");
    const navLinks    = document.getElementById("navLinks");
    const profileBtn  = document.getElementById("profileBtn");
    const profileMenu = document.getElementById("profileMenu");

    if (!navLinks) {
        return;
    }

    const profileTrigger = profileBtn
        ? profileBtn.querySelector(".profile-trigger")
        : null;

    const dropdowns = navLinks.querySelectorAll(":scope > .dropdown");


    /* ---------- SCREEN CHECK ---------- */

    const MOBILE_BREAKPOINT = 1200;

    const mobileQuery = window.matchMedia(
        "(max-width: " + MOBILE_BREAKPOINT + "px)"
    );

    const hoverQuery = window.matchMedia("(hover: hover)");

    function isMobile() {
        return mobileQuery.matches;
    }

    /* Desktop + mouse par dropdown CSS hover se khulta hai */
    function isDesktopHover() {
        return !mobileQuery.matches && hoverQuery.matches;
    }


    /* ---------- NAV DROPDOWNS ---------- */

    function getTrigger(dropdown) {
        return dropdown.querySelector(":scope > .dropdown-trigger");
    }

    function closeDropdown(dropdown) {
        dropdown.classList.remove("open");

        const trigger = getTrigger(dropdown);

        if (trigger) {
            trigger.setAttribute("aria-expanded", "false");
        }
    }

    function closeAllDropdowns(except) {
        dropdowns.forEach(function (dropdown) {
            if (dropdown !== except) {
                closeDropdown(dropdown);
            }
        });
    }

    function openDropdown(dropdown) {
        closeAllDropdowns(dropdown);
        closeProfileMenu();

        dropdown.classList.add("open");

        const trigger = getTrigger(dropdown);

        if (trigger) {
            trigger.setAttribute("aria-expanded", "true");
        }
    }

    function toggleDropdown(dropdown) {
        if (dropdown.classList.contains("open")) {
            closeDropdown(dropdown);
        } else {
            openDropdown(dropdown);
        }
    }


    /* ---------- PROFILE MENU ---------- */

    function closeProfileMenu() {
        if (!profileBtn || !profileMenu) {
            return;
        }

        profileMenu.classList.remove("show");
        profileBtn.classList.remove("open");

        if (profileTrigger) {
            profileTrigger.setAttribute("aria-expanded", "false");
        }
    }

    function openProfileMenu() {
        if (!profileBtn || !profileMenu) {
            return;
        }

        closeAllDropdowns();

        if (isMobile()) {
            closeMobileMenu();
        }

        profileMenu.classList.add("show");
        profileBtn.classList.add("open");

        if (profileTrigger) {
            profileTrigger.setAttribute("aria-expanded", "true");
        }
    }

    function toggleProfileMenu() {
        if (profileMenu.classList.contains("show")) {
            closeProfileMenu();
        } else {
            openProfileMenu();
        }
    }


    /* ---------- BURGER / CROSS BUTTON ---------- */

    function closeMobileMenu() {
        navLinks.classList.remove("active");
        document.body.classList.remove("nav-menu-open");

        if (menuToggle) {
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");
        }

        closeAllDropdowns();
    }

    function openMobileMenu() {
        closeProfileMenu();

        navLinks.classList.add("active");
        document.body.classList.add("nav-menu-open");

        if (menuToggle) {
            menuToggle.classList.add("active");
            menuToggle.setAttribute("aria-expanded", "true");
            menuToggle.setAttribute("aria-label", "Close navigation menu");
        }
    }

    if (menuToggle) {
        menuToggle.addEventListener("click", function (event) {
            event.preventDefault();

            if (navLinks.classList.contains("active")) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }


    /* ---------- DROPDOWN CLICK (mobile tap) ---------- */

    dropdowns.forEach(function (dropdown) {

        const trigger = getTrigger(dropdown);

        if (!trigger) {
            return;
        }

        trigger.setAttribute("role", "button");
        trigger.setAttribute("aria-expanded", "false");

        trigger.addEventListener("click", function (event) {
            event.preventDefault();

            if (isDesktopHover()) {
                return;
            }

            toggleDropdown(dropdown);
        });

        trigger.addEventListener("keydown", function (event) {

            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleDropdown(dropdown);
            }

            if (event.key === "Escape") {
                closeDropdown(dropdown);
            }
        });
    });

    /* Dropdown ke andar kisi link par click hone par menu band */
    navLinks.addEventListener("click", function (event) {

        if (!event.target.closest(".mega-menu a")) {
            return;
        }

        if (isMobile()) {
            closeMobileMenu();
        } else {
            closeAllDropdowns();
        }
    });


    /* ---------- PROFILE CLICK ---------- */

    if (profileTrigger && profileMenu) {

        profileTrigger.setAttribute("role", "button");
        profileTrigger.setAttribute("aria-expanded", "false");

        profileTrigger.addEventListener("click", function (event) {
            event.preventDefault();

            if (isDesktopHover()) {
                return;
            }

            toggleProfileMenu();
        });

        profileTrigger.addEventListener("keydown", function (event) {

            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleProfileMenu();
            }

            if (event.key === "Escape") {
                closeProfileMenu();
            }
        });

        profileMenu.addEventListener("click", function (event) {
            if (event.target.closest("a")) {
                closeProfileMenu();
            }
        });
    }


    /* ---------- BAHAR CLICK KARNE PAR BAND ---------- */

    document.addEventListener("click", function (event) {

        const target = event.target;

        if (profileBtn && !profileBtn.contains(target)) {
            closeProfileMenu();
        }

        if (!navLinks.contains(target)) {
            closeAllDropdowns();
        }

        if (
            isMobile() &&
            navLinks.classList.contains("active") &&
            !navLinks.contains(target) &&
            !(menuToggle && menuToggle.contains(target))
        ) {
            closeMobileMenu();
        }
    });


    /* ---------- ESCAPE KEY ---------- */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            closeAllDropdowns();
            closeProfileMenu();
            closeMobileMenu();
        }
    });


    /* ---------- SCREEN SIZE BADALNE PAR RESET ---------- */

    function onBreakpointChange() {
        closeMobileMenu();
        closeProfileMenu();
    }

    if (mobileQuery.addEventListener) {
        mobileQuery.addEventListener("change", onBreakpointChange);
    } else if (mobileQuery.addListener) {
        mobileQuery.addListener(onBreakpointChange);
    }

});