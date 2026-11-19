/* ==========================================================
   ALIGARH RENTALS
   PREMIUM LOGIN PAGE
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.querySelector(".ar-login-form");
    const emailInput = document.querySelector('input[name="email"]');
    const passwordInput = document.querySelector('input[name="password"]');
    const loginBtn = document.querySelector(".ar-login-btn");



    /* ==========================================
       AUTO FOCUS
    ========================================== */

    if (emailInput) {
        emailInput.focus();
    }



    /* ==========================================
       PASSWORD TOGGLE
    ========================================== */

    if (passwordInput) {

        const inputBox = passwordInput.parentElement;

        const toggle = document.createElement("i");

        toggle.className = "fa-solid fa-eye ar-password-toggle";

        inputBox.appendChild(toggle);

        toggle.addEventListener("click", () => {

            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                toggle.classList.remove("fa-eye");
                toggle.classList.add("fa-eye-slash");

            } else {

                passwordInput.type = "password";

                toggle.classList.remove("fa-eye-slash");
                toggle.classList.add("fa-eye");

            }

        });

    }



    /* ==========================================
       INPUT ACTIVE EFFECT
    ========================================== */

    document.querySelectorAll(".ar-input input").forEach(input => {

        input.addEventListener("focus", () => {

            input.parentElement.classList.add("active");

        });

        input.addEventListener("blur", () => {

            input.parentElement.classList.remove("active");

        });

    });





    /* ==========================================
       PREVENT MULTIPLE SUBMIT
    ========================================== */

    if (loginForm) {

        loginForm.addEventListener("submit", function () {

            loginBtn.disabled = true;

            loginBtn.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Logging In...
            `;

        });

    }

});