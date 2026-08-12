// =====================================
// AI ATTENDANCE MANAGEMENT SYSTEM
// admin.js
// =====================================


// Admin Access Check

function checkAdmin(){


let role = localStorage.getItem(
"userRole"
);



if(role !== "admin"){


window.location.href =
"teacher login.html";


return;

}



loadAdminData();


}





// =====================================
// Load Admin Dashboard Data
// =====================================


function loadAdminData(){



// Students Count

let students = JSON.parse(

localStorage.getItem("students")

) || [];



let studentCount = document.getElementById(

"studentCount"

);



if(studentCount){

studentCount.innerText =
students.length;

}






// Teacher Count

let teachers = JSON.parse(

localStorage.getItem("teachers")

) || [];



let teacherCount = document.getElementById(

"teacherCount"

);



if(teacherCount){

teacherCount.innerText =
teachers.length;

}






// Attendance Count

let attendance = JSON.parse(

localStorage.getItem("attendanceHistory")

) || [];



let attendanceCount = document.getElementById(

"attendanceCount"

);



if(attendanceCount){

attendanceCount.innerText =
attendance.length;

}



}






// =====================================
// Logout System
// =====================================


function logout(){


saveActivity(
"Logout"
);


localStorage.removeItem(
"currentUser"
);


localStorage.removeItem(
"userRole"
);


window.location.href =
"login.html";


}