
let menuBtn = document.getElementById("menuBtn");
let subnavbar = document.getElementById("mobile-subnavbar-items");
function toggleMenu() {
    if (subnavbar.style.display === "block") {
        subnavbar.style.display = "none";
    } else {
        subnavbar.style.display = "block";
    }
}