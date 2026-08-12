// =====================================
// AI School
// Student Profile System
// Clean Version 1.0
// =====================================



// Page Load

window.addEventListener(
"load",
function(){

loadStudentProfile();

});





// =====================================
// Load Student Profile
// =====================================


function loadStudentProfile(){



let studentId =

localStorage.getItem(
"selectedStudent"
);





let students = JSON.parse(

localStorage.getItem(
"students"

)

)||[];






let student = students.find(

s =>

s.id == studentId

);






if(!student){


alert(
"Student Not Found"
);


return;


}







// Display Data



document.getElementById(
"studentName"
).innerText =

student.name || "-";






document.getElementById(
"parentName"
).innerText =

student.parentName || "-";






document.getElementById(
"whatsappNumber"
).innerText =

student.parentPhone || "-";






document.getElementById(
"schoolName"
).innerText =

student.schoolName || "AI School";






document.getElementById(
"studentClass"
).innerText =

student.className || "-";






document.getElementById(
"gender"
).innerText =

student.gender || "-";






document.getElementById(
"birthDate"
).innerText =

student.birthDate || "-";






document.getElementById(
"admissionDate"
).innerText =

student.admissionDate || "-";




}







// =====================================
// WhatsApp Parent
// =====================================


function openStudentWhatsApp(){



let number =

document.getElementById(
"whatsappNumber"
)
.innerText;





if(
number === "-" ||
number === ""

){


alert(
"WhatsApp Number Not Available"
);


return;


}





let message =

"Hello Parent, This is AI School Management System";





let url =

"https://wa.me/"
+
number
+
"?text="
+
encodeURIComponent(message);





window.open(
url,
"_blank"
);



}







// =====================================
// Edit Student
// =====================================


function editStudentProfile(){


let id =

localStorage.getItem(
"selectedStudent"
);




localStorage.setItem(

"editStudent",

id

);




window.location.href =

"studentadmission.html";


}








// =====================================
// Print Profile
// =====================================


function printProfile(){


window.print();


}