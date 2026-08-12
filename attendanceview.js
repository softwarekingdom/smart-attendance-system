// =====================================
// AI Attendance System
// Attendance View System
// attendanceview.js
// =====================================


document.addEventListener(

"DOMContentLoaded",

loadAttendanceView

);





function loadAttendanceView(){



let id = Number(

localStorage.getItem(

"viewAttendance"

)

);





let history = JSON.parse(

localStorage.getItem(

"attendanceHistory"

)

) || [];





let record = history.find(

item => item.id === id

);





if(!record){


alert(

"Attendance Record Not Found"

);



window.location.href =

"attendancehistory.html";


return;


}






// Display Information


document.getElementById(

"viewTeacher"

).innerText =

record.teacherName;





document.getElementById(

"viewClass"

).innerText =

record.className;





document.getElementById(

"viewDate"

).innerText =

record.date;






// Display Students


let table = document.getElementById(

"viewAttendanceList"

);



table.innerHTML = "";





record.records.forEach((student,index)=>{



let status =

student.status === "Present"

?

"✅ Present"

:

"❌ Absent";





table.innerHTML += `


<tr>


<td>

${index + 1}

</td>


<td>

${student.name}

</td>



<td>

${status}

</td>



</tr>


`;



});




}