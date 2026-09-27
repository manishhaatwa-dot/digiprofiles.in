/* =========================================================
   DIGIPROFILES.IN
   MAIN JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       MOBILE MENU
       ===================================================== */

    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", () => {

            const isOpen =
                mainNav.classList.toggle("active");

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            menuToggle.textContent =
                isOpen ? "✕" : "☰";
        });


        /* Close menu after clicking a link */

        const navLinks =
            mainNav.querySelectorAll("a");

        navLinks.forEach((link) => {

            link.addEventListener("click", () => {

                mainNav.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.textContent = "☰";
            });

        });

    }


    /* =====================================================
       SMOOTH INTERNAL NAVIGATION
       ===================================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach((link) => {

            link.addEventListener("click", (event) => {

                const targetId =
                    link.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(targetId);

                if (!target) {
                    return;
                }

                event.preventDefault();

                const header =
                    document.querySelector(".site-header");

                const headerHeight =
                    header
                        ? header.offsetHeight
                        : 0;

                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    headerHeight -
                    10;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });

            });

        });


    /* =====================================================
       HEADER SCROLL EFFECT
       ===================================================== */

    const header =
        document.querySelector(".site-header");

    const updateHeader =
        () => {

            if (!header) {
                return;
            }

            if (window.scrollY > 30) {

                header.classList.add(
                    "header-scrolled"
                );

            } else {

                header.classList.remove(
                    "header-scrolled"
                );

            }

        };

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

    updateHeader();


    /* =====================================================
       ACTIVE NAVIGATION
       ===================================================== */

    const sections =
        document.querySelectorAll("main section[id]");

    const navigationLinks =
        document.querySelectorAll(
            '.main-nav a[href^="#"]'
        );

    const updateActiveNavigation =
        () => {

            let currentSection = "";

            const scrollPosition =
                window.scrollY +
                window.innerHeight * 0.35;

            sections.forEach((section) => {

                const sectionTop =
                    section.offsetTop;

                const sectionBottom =
                    sectionTop +
                    section.offsetHeight;

                if (
                    scrollPosition >= sectionTop &&
                    scrollPosition < sectionBottom
                ) {
                    currentSection =
                        section.id;
                }

            });

            navigationLinks.forEach((link) => {

                const href =
                    link.getAttribute("href");

                if (
                    href === `#${currentSection}`
                ) {

                    link.classList.add("active");

                } else {

                    link.classList.remove("active");

                }

            });

        };

    window.addEventListener(
        "scroll",
        updateActiveNavigation,
        { passive: true }
    );

    updateActiveNavigation();


    /* =====================================================
       REVEAL ANIMATION
       ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".feature-tile, .category-card, .about-card, .cta-card"
        );

    if (
        "IntersectionObserver" in window &&
        revealElements.length
    ) {

        const observer =
            new IntersectionObserver(
                (entries, obs) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "reveal-visible"
                        );

                        obs.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.12
                }
            );

        revealElements.forEach((element) => {

            element.classList.add(
                "reveal-ready"
            );

            observer.observe(element);

        });

    }


    /* =====================================================
       3D TILT EFFECT FOR MAIN PROFILE CARD
       ===================================================== */

    const profilePreview =
        document.querySelector(".profile-preview");

    const heroVisual =
        document.querySelector(".hero-visual");

    if (
        profilePreview &&
        heroVisual &&
        window.matchMedia(
            "(hover: hover)"
        ).matches
    ) {

        heroVisual.addEventListener(
            "mousemove",
            (event) => {

                const rect =
                    heroVisual.getBoundingClientRect();

                const x =
                    event.clientX -
                    rect.left;

                const y =
                    event.clientY -
                    rect.top;

                const centerX =
                    rect.width / 2;

                const centerY =
                    rect.height / 2;

                const rotateY =
                    ((x - centerX) /
                        centerX) *
                    4;

                const rotateX =
                    ((centerY - y) /
                        centerY) *
                    4;

                profilePreview.style.transform =
                    `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(-1deg)`;
            }
        );


        heroVisual.addEventListener(
            "mouseleave",
            () => {

                profilePreview.style.transform =
                    "rotateX(0deg) rotateY(0deg) rotateZ(-2deg)";

            }
        );

    }


    /* =====================================================
       CURRENT YEAR
       ===================================================== */

    const footerYear =
        document.querySelector(".footer-copy");

    if (footerYear) {

        const currentYear =
            new Date().getFullYear();

        footerYear.textContent =
            `© ${currentYear} DigiProfiles.in`;

    }


    /* =====================================================
       ESCAPE KEY
       CLOSES MOBILE MENU
       ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                mainNav &&
                mainNav.classList.contains("active")
            ) {

                mainNav.classList.remove(
                    "active"
                );

                if (menuToggle) {

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    menuToggle.textContent =
                        "☰";
                }

            }

        }
    );

});