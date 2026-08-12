// =====================================
// AI SCHOOL
// Attendance History System
// Version 1.0
// =====================================



window.addEventListener(
"load",
function(){

loadHistoryClasses();

loadHistory();

});







// Load Classes


function loadHistoryClasses(){



let select =
document.getElementById(
"historyClass"
);



if(!select){

return;

}



let classes = JSON.parse(

localStorage.getItem(
"classes"

)

)||[];





classes.forEach(cls=>{


let name = typeof cls==="string"

?

cls

:

cls.className;





select.innerHTML += `

<option value="${name}">

${name}

</option>

`;

});


}









// Load History


function loadHistory(){



let table =
document.getElementById(
"historyList"
);



if(!table){

return;

}



table.innerHTML="";






let history = JSON.parse(

localStorage.getItem(
"attendanceHistory"

)

)||[];






let selectedClass =
document.getElementById(
"historyClass"
).value;





let selectedDate =
document.getElementById(
"historyDate"
).value;







let present=0;

let absent=0;

let total=0;







history.forEach(day=>{





let dayDate = new Date(
day.date
)
.toLocaleDateString();







if(

selectedClass!=="" &&

day.className!==selectedClass

){

return;

}






if(

selectedDate!=="" &&

day.date!==selectedDate

){

return;

}







day.records.forEach(student=>{



total++;




if(student.status==="Present"){

present++;

}

else{

absent++;

}







table.innerHTML += `


<tr>


<td>

${day.date}

</td>



<td>

${student.className}

</td>




<td>

${student.studentName}

</td>




<td>

${student.status}

</td>





<td>


<button

onclick="deleteAttendance('${day.id}','${student.studentId}')">

🗑

</button>


</td>



</tr>



`;



});




});







document.getElementById(
"presentTotal"
).innerText=present;





document.getElementById(
"absentTotal"
).innerText=absent;





document.getElementById(
"studentTotal"
).innerText=total;



}









// Delete Attendance


function deleteAttendance(dayId,studentId){



let history = JSON.parse(

localStorage.getItem(
"attendanceHistory"

)

)||[];






history.forEach(day=>{


if(day.id==dayId){


day.records = day.records.filter(

student =>

student.studentId!=studentId

);


}



});







localStorage.setItem(

"attendanceHistory",

JSON.stringify(history)

);






loadHistory();



}









// Clear Filter


function clearFilters(){



document.getElementById(
"historyClass"
).value="";



document.getElementById(
"historyDate"
).value="";





loadHistory();



}