// =====================================
// AI Attendance Management System
// Multiple Student ID Card Generator
// Part 1
// =====================================



document.addEventListener(

"DOMContentLoaded",

function(){


loadMultipleIDCards();


}

);








// =====================================
// Load Multiple Students
// =====================================


function loadMultipleIDCards(){



let students = JSON.parse(

localStorage.getItem(
"selectedStudents"
)

) || [];





if(students.length===0){


alert(
"No Students Selected"
);


return;


}





let institution = JSON.parse(

localStorage.getItem(
"institutionInfo"
)

) || {};







let container = document.getElementById(

"cardsContainer"

);






students.forEach(

student => {



let card = createIDCard(

student,

institution

);




container.innerHTML += card;



}

);



}
// =====================================
// Create Student ID Card
// Part 2
// =====================================


function createIDCard(student, institution){



let photo = 

student.photo ||

"images/default-student.png";





let logo =

institution.logo ||

"images/default-logo.png";







let cardID =

"qr_" + student.id;








setTimeout(

function(){

generateCardQR(

student,

cardID

);

},

500

);







return `



<div class="multi-id-card">



<div class="multi-card-header">


<img src="${logo}">


<div>


<h2>

${institution.name || "Institution Name"}

</h2>


<p>

AI Attendance System

</p>


</div>


</div>








<div class="multi-photo">


<img src="${photo}">


</div>







<div class="multi-details">


<h3>

${student.name || "-"}

</h3>




<p>
🆔 ID :
${student.studentID || student.id}

</p>



<p>
🏫 Class :
${student.className || "-"}

</p>



<p>
🏷 Section :
${student.section || "-"}

</p>




<p>
🎫 Roll :
${student.rollNumber || "-"}

</p>




<p>
📅 Date :
${student.admissionDate || "-"}

</p>



</div>






<div id="${cardID}" class="multi-qr">


</div>







<div class="multi-footer">


🤖 AI Student Identity Card


</div>




</div>



`;



}
// =====================================
// Generate QR For Each Student Card
// Part 3
// =====================================


function generateCardQR(student, elementID){



let qrElement = document.getElementById(

elementID

);





if(!qrElement){

return;

}






let token =

student.securityToken ||

student.studentID ||

student.id;






let profileURL =


window.location.origin +

"/studentprofile.html?token=" +

token;







new QRCode(

qrElement,

{

text: profileURL,

width:80,

height:80

}

);



}







// =====================================
// Print All ID Cards
// =====================================


function printAllCards(){



window.print();



}