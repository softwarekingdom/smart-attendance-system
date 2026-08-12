// =====================================
// Attendance Edit System
// attendanceedit.js
// =====================================

document.addEventListener(
"DOMContentLoaded",
loadAttendanceRecord
);




// Load Attendance Record

function loadAttendanceRecord(){


let id = Number(

localStorage.getItem(
"editAttendance"
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



// Header Information

document.getElementById(
"attendanceDate"
).innerText =
record.date;


document.getElementById(
"attendanceClass"
).innerText =
record.className;


document.getElementById(
"attendanceTeacher"
).innerText =
record.teacherName;





let table = document.getElementById(
"attendanceTable"
);

table.innerHTML = "";



record.records.forEach((student,index)=>{


table.innerHTML += `

<tr>

<td>

${student.name}

</td>

<td>

<select id="status${index}">

<option value="Present"
${student.status==="Present"?"selected":""}>

Present

</option>

<option value="Absent"
${student.status==="Absent"?"selected":""}>

Absent

</option>

</select>

</td>

</tr>

`;



});


}

// =====================================
// Save Edited Attendance
// =====================================

function saveEditedAttendance(){

let id = Number(

localStorage.getItem(
"editAttendance"
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

return;

}



// Update Student Status

record.records.forEach((student,index)=>{

student.status =

document.getElementById(

"status"+index

).value;

});



// Save Updated Data

localStorage.setItem(

"attendanceHistory",

JSON.stringify(history)

);



// Clear Temporary Data

localStorage.removeItem(
"editAttendance"
);



alert(
"Attendance Updated Successfully"
);



// Back To History

window.location.href =
"attendancehistory.html";

}