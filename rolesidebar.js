// =====================================
// Role Based Sidebar
// =====================================


document.addEventListener(
"DOMContentLoaded",
loadSidebarRole
);



function loadSidebarRole(){


let role = localStorage.getItem(
"userRole"
);



let teacherMenu =
document.getElementById(
"teacherMenu"
);



let adminMenu =
document.getElementById(
"adminMenu"
);





if(role === "admin"){


if(teacherMenu)
teacherMenu.style.display="none";



if(adminMenu)
adminMenu.style.display="block";


}





else if(role === "teacher"){


if(adminMenu)
adminMenu.style.display="none";



if(teacherMenu)
teacherMenu.style.display="block";


}



else{


window.location.href =
"teacher login.html";


}


}
// =====================================
// Role Based Sidebar
// =====================================

document.addEventListener(
"DOMContentLoaded",
loadSidebarRole
);

function loadSidebarRole(){

let role = localStorage.getItem("userRole");

let teacherMenu = document.getElementById("teacherMenu");
let adminMenu = document.getElementById("adminMenu");

let teacherProfile =
document.getElementById("teacherProfileMenu");

let adminProfile =
document.getElementById("adminProfileMenu");


if(role === "admin"){

    if(teacherMenu)
    teacherMenu.style.display="none";

    if(adminMenu)
    adminMenu.style.display="block";

    if(teacherProfile)
    teacherProfile.style.display="none";

    if(adminProfile)
    adminProfile.style.display="block";

}

else if(role === "teacher"){

    if(adminMenu)
    adminMenu.style.display="none";

    if(teacherMenu)
    teacherMenu.style.display="block";

    if(adminProfile)
    adminProfile.style.display="none";

    if(teacherProfile)
    teacherProfile.style.display="block";

}

else{

    window.location.href =
    "teacher login.html";

}

}