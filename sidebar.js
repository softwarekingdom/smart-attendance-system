// ===============================
// Sidebar Elements
// ===============================

const sidebar = document.getElementById("sidebar");
const overlay = document.querySelector(".overlay");

// ===============================
// Open / Close Sidebar
// ===============================

function toggleSidebar() {

    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");

}

function closeSidebar() {

    sidebar.classList.remove("active");
    overlay.classList.remove("active");

}

// ===============================
// Close when overlay clicked
// ===============================

if (overlay) {

    overlay.addEventListener("click", closeSidebar);

}

// ===============================
// Close when ESC key pressed
// ===============================

document.addEventListener("keydown", function(e){

    if(e.key === "Escape"){

        closeSidebar();

    }

});

// ===============================
// Close after clicking a menu
// ===============================

document.querySelectorAll(".sidebar a").forEach(link => {

    link.addEventListener("click", function(){

        closeSidebar();

    });

});

// ===============================
// Active Page Highlight
// ===============================

const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll(".sidebar a").forEach(link => {

    const file = link.getAttribute("href");

    if(file === currentPage){

        link.classList.add("active");

    }

});

// ===============================
// Logout
// ===============================

function logout(){

    if(confirm("Are you sure you want to logout?")){

        localStorage.removeItem("currentUser");
        localStorage.removeItem("userRole");

        window.location.href = "index.html";

    }

}