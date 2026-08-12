// =====================================
// Teacher Profile System
// =====================================


document.addEventListener(
"DOMContentLoaded",
loadTeacherProfile
);



function loadTeacherProfile(){


let teacher = JSON.parse(

localStorage.getItem("currentUser")

);



let box = document.getElementById(
"teacherData"
);



if(!teacher || !box){

return;

}



let classes = getTeacherClasses(
teacher.username
);



box.innerHTML = `


<div class="profile-card">


<h2>
👤 ${teacher.name}
</h2>



<p>
🆔 Username :
${teacher.username}
</p>



<p>
👨‍🏫 Role :
${teacher.role}
</p>



<p>
📚 Subject :
${teacher.subject || "N/A"}
</p>



<p>
📱 Phone :
${teacher.phone || "N/A"}
</p>



<p>
📧 Email :
${teacher.email || "N/A"}
</p>



<p>
📅 Join Date :
${teacher.joinDate || "N/A"}
</p>



<p>
🟢 Login Status :
Active
</p>



<h3>
🏫 Assigned Classes
</h3>


<div>

${classes}

</div>



</div>

`;



}







function getTeacherClasses(username){



let data = JSON.parse(

localStorage.getItem("teacherClasses")

) || [];



let result = data.filter(

item => item.teacher === username

);



if(result.length===0){

return "No Classes Assigned";

}



let html="";



result.forEach(item=>{


html += `

<p>
📘 ${item.className}
</p>

`;



});


return html;


}
// =====================================
// Load Teacher Assigned Classes
// =====================================


document.addEventListener(
"DOMContentLoaded",
function(){

loadTeacherClasses();

});





function loadTeacherClasses(){



let currentTeacher = JSON.parse(

localStorage.getItem(
"currentUser"

)

);



if(!currentTeacher){

return;

}





let container =
document.getElementById(
"myClasses"
);





if(!container){

return;

}





let assignments = JSON.parse(

localStorage.getItem(
"teacherClasses"

)

)||[];





let myClasses = assignments.filter(

item =>

item.teacher === currentTeacher.username

);






container.innerHTML="";





if(myClasses.length===0){


container.innerHTML=

"No Classes Assigned";


return;


}







myClasses.forEach(item=>{



container.innerHTML += `


<div class="class-card">


<h3>

🏫 ${item.className}

</h3>



<button onclick="openClass('${item.className}')">

📋 View Students

</button>



<button onclick="takeAttendance('${item.className}')">

✅ Attendance

</button>



</div>


`;



});



}







// Open Class Students


function openClass(className){


localStorage.setItem(

"selectedClass",

className

);



window.location.href=

"studentadmission.html";


}







// Open Attendance


function takeAttendance(className){


localStorage.setItem(

"attendanceClass",

className

);



window.location.href=

"attendance.html";


}