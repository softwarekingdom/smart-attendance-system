// =====================================
// AI Attendance Management System
// Database Manager
// Version 1.0
// =====================================

// ---------- Generic ----------

function dbGet(key){

    return JSON.parse(

        localStorage.getItem(key)

    ) || [];

}



function dbSave(key,data){

    localStorage.setItem(

        key,

        JSON.stringify(data)

    );

}



// ---------- Students ----------

function getStudents(){

    return dbGet("students");

}



function saveStudents(data){

    dbSave("students",data);

}



// ---------- Teachers ----------

function getTeachers(){

    return dbGet("teachers");

}



function saveTeachers(data){

    dbSave("teachers",data);

}



// ---------- Attendance History ----------

function getAttendanceHistory(){

    return dbGet("attendanceHistory");

}



function saveAttendanceHistory(data){

    dbSave("attendanceHistory",data);

}



// ---------- Teacher Classes ----------

function getTeacherClasses(){

    return dbGet("teacherClasses");

}



function saveTeacherClasses(data){

    dbSave("teacherClasses",data);

}



// ---------- Login Activity ----------

function getLoginActivity(){

    return dbGet("loginActivity");

}



function saveLoginActivity(data){

    dbSave("loginActivity",data);

}



// ---------- Current User ----------

function getCurrentUser(){

    return JSON.parse(

        localStorage.getItem("currentUser")

    );

}



function saveCurrentUser(user){

    localStorage.setItem(

        "currentUser",

        JSON.stringify(user)

    );

}