
(function () {
    const items = document.querySelectorAll(".rm-reveal");
    if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add("rm-in");
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.15 });
        items.forEach(el => io.observe(el));
    } else {
        items.forEach(el => el.classList.add("rm-in"));
    }
})();

