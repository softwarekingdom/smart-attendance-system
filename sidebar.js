// =====================================
// Sidebar Toggle System
// =====================================


function toggleSidebar(){


let sidebar =
document.getElementById("sidebar");


let overlay =
document.querySelector(".overlay");



sidebar.classList.toggle(
"active"
);



overlay.classList.toggle(
"active"
);



}