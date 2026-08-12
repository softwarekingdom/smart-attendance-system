// =====================================
// AI Attendance Management System
// Student ID Card JavaScript
// Part 1
// =====================================



document.addEventListener(
"DOMContentLoaded",
function(){


loadInstitutionData();


loadStudentData();


});
// =====================================
// Load Institution Information
// =====================================


function loadInstitutionData(){


let institution = JSON.parse(

localStorage.getItem(
"institutionInfo"
)

);



if(!institution){

return;

}




let schoolName =
document.getElementById(
"schoolName"
);



let idSchoolName =
document.getElementById(
"idSchoolName"
);



let schoolLogo =
document.getElementById(
"schoolLogo"
);



let schoolPhone =
document.getElementById(
"idSchoolPhone"
);



let signature =
document.getElementById(
"principalSignature"
);





if(schoolName)

schoolName.innerText =
institution.name || "Institution Name";





if(idSchoolName)

idSchoolName.innerText =
institution.name || "Institution Name";





if(schoolLogo && institution.logo)

schoolLogo.src =
institution.logo;





if(schoolPhone)

schoolPhone.innerText =
institution.phone || "-";





if(signature && institution.signature)

signature.src =
institution.signature;



}
// =====================================
// Load Student Information
// Part 2
// =====================================


function loadStudentData(){



let selectedStudent = JSON.parse(

localStorage.getItem(
"selectedStudent"
)

);





if(!selectedStudent){


console.log(
"No Student Selected"
);


return;


}







// Student Name


setText(

"studentName",

selectedStudent.name

);







// Student ID


setText(

"studentID",

selectedStudent.studentID || 
selectedStudent.id || 
"-"

);







// Class


setText(

"studentClass",

selectedStudent.className

);







// Section


setText(

"studentSection",

selectedStudent.section || "-"

);







// Roll Number


setText(

"rollNumber",

selectedStudent.rollNumber || "-"

);







// Admission Date


setText(

"admissionDate",

selectedStudent.admissionDate || "-"

);








// Parent Details


setText(

"fatherName",

selectedStudent.fatherName || "-"

);





setText(

"motherName",

selectedStudent.motherName || "-"

);







setText(

"parentWhatsapp",

selectedStudent.phone || "-"

);







setText(

"emergencyContact",

selectedStudent.emergencyContact || "-"

);







setText(

"studentAddress",

selectedStudent.address || "-"

);







// Student Photo


let photo = document.getElementById(

"studentPhoto"

);




if(photo && selectedStudent.photo){



photo.src = selectedStudent.photo;



}





// Generate QR

generateStudentQR(selectedStudent);



}








// =====================================
// Safe Text Function
// =====================================


function setText(id,value){



let element = document.getElementById(id);



if(element){


element.innerText = value || "-";


}



}
// =====================================
// Student QR Code Generator
// Part 3
// =====================================


function generateStudentQR(student){


let qrContainer = document.querySelector(
".qr-box"
);



if(!qrContainer){

return;

}



qrContainer.innerHTML="";



let studentID = 
student.studentID || student.id;



let profileURL =

window.location.origin +

"/studentprofile.html?id=" +

studentID;





new QRCode(

qrContainer,

{

text: profileURL,

width:100,

height:100

}

);


}




// Clear old QR


qrContainer.innerHTML="";







new QRCode(

qrContainer,

{

text:qrText,

width:90,

height:90

}

);




}









// =====================================
// Print ID Card
// =====================================


function printIDCard(){



window.print();



}









// =====================================
// Check Missing Data
// =====================================


function checkStudentData(){



let student = localStorage.getItem(

"selectedStudent"

);



if(!student){


alert(

"Please Select Student First"

);


return false;


}



return true;



}