
let menuBtn = document.getElementById("menuBtn");
let subnavbar = document.getElementById("mobile-subnavbar-items");
function toggleMenu() {
    if (subnavbar.style.display === "block") {
        subnavbar.style.display = "none";
    } else {
        subnavbar.style.display = "block";
    }
}

window.addEventListener("pageshow", (event) => {
    const isSessionAwarePage = document.body.dataset.sessionAware === "true";
    const navigationEntries = window.performance.getEntriesByType("navigation");
    const isBackForwardNavigation = navigationEntries.length > 0 && navigationEntries[0].type === "back_forward";

    if (isSessionAwarePage && (event.persisted || isBackForwardNavigation)) {
        window.location.reload();
    }
});
