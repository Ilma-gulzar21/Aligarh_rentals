

    document.addEventListener("DOMContentLoaded", function () {

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


    /* ---------- Count-up numbers (values come from database) ---------- */

    function countUp(el) {

        var raw = el.getAttribute("data-count") || "0";
        var target = parseFloat(raw);

        if (isNaN(target)) {
            el.textContent = raw;
            return;
        }

        // decimals: "4.3" -> 1 decimal, "120" -> 0 decimals
        var decimals = raw.indexOf(".") > -1 ? raw.split(".")[1].length : 0;

        if (reduceMotion) {
            el.textContent = target.toFixed(decimals);
            return;
        }

        var duration = 1600;
        var start = null;

        function step(timestamp) {

            if (!start) start = timestamp;

            var progress = Math.min((timestamp - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);   // easeOutCubic

            el.textContent = (target * eased).toFixed(decimals);

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target.toFixed(decimals);
            }
        }

        requestAnimationFrame(step);
    }


    /* ---------- Scroll reveal ---------- */

    var groups = [
        { selector: ".reviews-header",        stagger: 0 },
        { selector: ".review-stat-card",      stagger: 0.12 },
        { selector: ".customer-review-heading", stagger: 0 },
        { selector: ".overall-rating",        stagger: 0 },
        { selector: ".review-card",           stagger: 0.12 }
    ];

    var items = [];

    groups.forEach(function (group) {

        document.querySelectorAll(group.selector).forEach(function (el, index) {

            // cards in the same row get a small stagger
            var position = index % (group.selector === ".review-card" ? 3 : 4);
            el.style.setProperty("--delay", (position * group.stagger) + "s");

            el.classList.add("reveal");
            items.push(el);
        });
    });

    function reveal(el) {

        el.classList.add("show");

        el.querySelectorAll(".count-up").forEach(countUp);

        // overall rating number is inside .overall-rating
        if (el.classList.contains("overall-rating")) {
            el.querySelectorAll(".count-up").forEach(countUp);
        }
    }

    if (!("IntersectionObserver" in window)) {
        items.forEach(reveal);
        return;
    }

    var observer = new IntersectionObserver(function (entries) {

        entries.forEach(function (entry) {

            if (entry.isIntersecting) {
                reveal(entry.target);
                observer.unobserve(entry.target);
            }
        });

    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
    });

    items.forEach(function (el) {
        observer.observe(el);
    });

});
