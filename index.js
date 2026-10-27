
"use strict";

/* Smart Attendance System
   Official Landing Page JavaScript
*/


/* Current Year */

const yearElement = document.getElementById("currentYear");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


/* Mobile Navigation */

const menuToggle = document.getElementById("menuToggle");
const navbar = document.querySelector(".navbar");
const navContent = document.getElementById("navContent");

if (menuToggle && navbar && navContent) {

    menuToggle.addEventListener("click", () => {

        const isExpanded =
            menuToggle.getAttribute("aria-expanded") === "true";

        menuToggle.setAttribute(
            "aria-expanded",
            String(!isExpanded)
        );

        navbar.classList.toggle("menu-open", !isExpanded);

        menuToggle.setAttribute(
            "aria-label",
            isExpanded
                ? "Open navigation menu"
                : "Close navigation menu"
        );

    });


    /* Close the menu after navigation */

    navContent.querySelectorAll("a").forEach((link) => {

        link.addEventListener("click", () => {

            navbar.classList.remove("menu-open");

            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

        });

    });


    /* Close when tapping outside the navigation */

    document.addEventListener("click", (event) => {

        if (
            navbar.classList.contains("menu-open") &&
            !navbar.contains(event.target)
        ) {

            navbar.classList.remove("menu-open");

            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

        }

    });


    /* Close the menu if switching to desktop layout */

    window.addEventListener("resize", () => {

        if (window.innerWidth > 760) {

            navbar.classList.remove("menu-open");

            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

        }

    });

}


/* Smooth Scrolling */

document.querySelectorAll('a[href^="#"]').forEach((link) => {

    link.addEventListener("click", (event) => {

        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") {
            return;
        }

        const target = document.querySelector(targetId);

        if (target) {

            event.preventDefault();

            target.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",

                block: "start"
            });

        }

    });

});
