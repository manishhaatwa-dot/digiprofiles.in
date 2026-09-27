/* =========================================================
   DIGIPROFILES.IN
   MAIN JAVASCRIPT
   ========================================================= */


/* =========================================================
   FIREBASE
   PUBLIC WORKS READ ONLY
   ========================================================= */

import {
    getFirestore,
    collection,
    getDocs,
    query,
    where,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

import { app } from "./firebase-config.js";

const db = getFirestore(app);

const WORKS_COLLECTION = "digiprofiles_works";


/* =========================================================
   MAIN
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    const menuToggle =
        document.getElementById("menuToggle");

    const mainNav =
        document.getElementById("mainNav");

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

                menuToggle.textContent =
                    "☰";

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
        document.querySelectorAll(
            "main section[id]"
        );

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
                    href ===
                    `#${currentSection}`
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
        document.querySelector(
            ".profile-preview"
        );

    const heroVisual =
        document.querySelector(
            ".hero-visual"
        );

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

    const footerCopy =
        document.querySelector(
            ".footer-copy"
        );

    if (footerCopy) {

        const currentYear =
            new Date().getFullYear();

        const yearElement =
            document.getElementById(
                "currentYear"
            );

        if (yearElement) {

            yearElement.textContent =
                currentYear;

        }

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
                mainNav.classList.contains(
                    "active"
                )
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


    /* =====================================================
       LOAD DIGIPROFILES WORKS
       ===================================================== */

    loadDigiProfilesWorks();

});


/* =========================================================
   LOAD WORKS FROM FIRESTORE
   ========================================================= */

async function loadDigiProfilesWorks() {

    try {

        const worksQuery =
            query(
                collection(
                    db,
                    WORKS_COLLECTION
                ),
                where(
                    "active",
                    "==",
                    true
                ),
                orderBy(
                    "createdAt",
                    "desc"
                )
            );


        const snapshot =
            await getDocs(
                worksQuery
            );


        /* -------------------------------------------------
           No work yet
           ------------------------------------------------- */

        if (snapshot.empty) {

            return;

        }


        const works =
            snapshot.docs.map(
                (doc) => ({
                    id: doc.id,
                    ...doc.data()
                })
            );


        renderDigiProfilesWorks(
            works
        );


    } catch (error) {

        console.error(
            "DigiProfiles works could not be loaded:",
            error
        );

    }

}


/* =========================================================
   CREATE WORK SECTION
   ========================================================= */

function renderDigiProfilesWorks(works) {

    if (!Array.isArray(works) || !works.length) {
        return;
    }


    /*
       Do not create duplicate section
    */

    if (
        document.getElementById(
            "digiprofilesWorks"
        )
    ) {
        return;
    }


    const main =
        document.querySelector("main");

    if (!main) {
        return;
    }


    /* =====================================================
       SECTION
       ===================================================== */

    const section =
        document.createElement("section");

    section.className =
        "features-section digiprofiles-works-section";

    section.id =
        "works";


    /* =====================================================
       CONTAINER
       ===================================================== */

    const container =
        document.createElement("div");

    container.className =
        "container";


    /* =====================================================
       HEADING
       ===================================================== */

    const heading =
        document.createElement("div");

    heading.className =
        "section-heading";


    heading.innerHTML = `
        <span class="section-label">
            OUR WORK
        </span>

        <h2>
            Websites we've
            <span>created.</span>
        </h2>

        <p>
            Explore professional websites and digital profiles
            created by DigiProfiles.
        </p>
    `;


    /* =====================================================
       WORK GRID
       ===================================================== */

    const grid =
        document.createElement("div");

    grid.className =
        "feature-grid digiprofiles-work-grid";


    works.forEach((work) => {

        const card =
            createWorkCard(work);

        grid.appendChild(card);

    });


    container.appendChild(
        heading
    );

    container.appendChild(
        grid
    );

    section.appendChild(
        container
    );


    /*
       Insert before Contact section.
       This keeps Services, Locations,
       Categories and About in their
       original fixed positions.
    */

    const contactSection =
        document.getElementById(
            "contact"
        );

    if (contactSection) {

        main.insertBefore(
            section,
            contactSection
        );

    } else {

        main.appendChild(
            section
        );

    }


    /* =====================================================
       ADD WORK LINK TO NAV
       ===================================================== */

    addWorksNavigationLink();


    /* =====================================================
       REVEAL ANIMATION FOR NEW CARDS
       ===================================================== */

    setupWorkRevealAnimation(
        grid
    );

}


/* =========================================================
   CREATE SINGLE WORK CARD
   ========================================================= */

function createWorkCard(work) {

    const card =
        document.createElement("article");

    card.className =
        "feature-tile digiprofiles-work-card";


    /* =====================================================
       SAFE VALUES
       ===================================================== */

    const title =
        work.title ||
        "Website";


    const description =
        work.description ||
        "Professional website created by DigiProfiles.";


    const profileLink =
        normalizeWebsiteUrl(
            work.profileLink
        );


    const imageUrl =
        work.imageUrl ||
        "";


    /* =====================================================
       CARD IMAGE
       ===================================================== */

    let imageHtml = "";

    if (imageUrl) {

        imageHtml = `
            <div class="digiprofiles-work-image">
                <img
                    src="${escapeHtml(imageUrl)}"
                    alt="${escapeHtml(title)} website"
                    loading="lazy"
                >
            </div>
        `;

    } else {

        imageHtml = `
            <div class="digiprofiles-work-image digiprofiles-work-placeholder">
                <span>DP</span>
            </div>
        `;

    }


    /* =====================================================
       CARD CONTENT
       ===================================================== */

    card.innerHTML = `
        ${imageHtml}

        <div class="feature-number">
            WORK
        </div>

        <div class="feature-icon">
            ◉
        </div>

        <h3>
            ${escapeHtml(title)}
        </h3>

        <p>
            ${escapeHtml(description)}
        </p>

        ${
            profileLink
                ? `
                    <a
                        class="btn btn-primary digiprofiles-work-button"
                        href="${escapeHtml(profileLink)}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Visit Website →
                    </a>
                  `
                : ""
        }
    `;


    return card;

}


/* =========================================================
   ADD WORK TO NAVIGATION
   ========================================================= */

function addWorksNavigationLink() {

    const mainNav =
        document.getElementById(
            "mainNav"
        );

    if (!mainNav) {
        return;
    }


    if (
        mainNav.querySelector(
            'a[href="#works"]'
        )
    ) {
        return;
    }


    const contactLink =
        mainNav.querySelector(
            'a[href="#contact"]'
        );


    const worksLink =
        document.createElement("a");

    worksLink.href =
        "#works";

    worksLink.textContent =
        "Our Work";


    if (contactLink) {

        mainNav.insertBefore(
            worksLink,
            contactLink
        );

    } else {

        mainNav.appendChild(
            worksLink
        );

    }


    /*
       Smooth navigation must also work
       for dynamically created link.
    */

    worksLink.addEventListener(
        "click",
        (event) => {

            const target =
                document.getElementById(
                    "works"
                );

            if (!target) {
                return;
            }

            event.preventDefault();

            const header =
                document.querySelector(
                    ".site-header"
                );

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


            const menuToggle =
                document.getElementById(
                    "menuToggle"
                );

            if (mainNav.classList.contains("active")) {

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

}


/* =========================================================
   WORK REVEAL ANIMATION
   ========================================================= */

function setupWorkRevealAnimation(
    grid
) {

    if (
        !grid ||
        !"IntersectionObserver" in window
    ) {
        return;
    }


    const cards =
        grid.querySelectorAll(
            ".digiprofiles-work-card"
        );


    if (!cards.length) {
        return;
    }


    const observer =
        new IntersectionObserver(
            (entries, obs) => {

                entries.forEach(
                    (entry) => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }

                        entry.target.classList.add(
                            "reveal-visible"
                        );

                        obs.unobserve(
                            entry.target
                        );

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    cards.forEach((card) => {

        card.classList.add(
            "reveal-ready"
        );

        observer.observe(
            card
        );

    });

}


/* =========================================================
   NORMALIZE WEBSITE URL
   ========================================================= */

function normalizeWebsiteUrl(
    url
) {

    if (
        typeof url !== "string" ||
        !url.trim()
    ) {
        return "";
    }


    const trimmed =
        url.trim();


    if (
        trimmed.startsWith(
            "https://"
        ) ||
        trimmed.startsWith(
            "http://"
        )
    ) {

        return trimmed;

    }


    return `https://${trimmed}`;

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}
