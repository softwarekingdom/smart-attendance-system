// =====================================
// AI Attendance System
// Activity Log System
// =====================================



// Get Activity Logs

function getActivityLogs(){


return JSON.parse(

localStorage.getItem(
"activityLogs"
)

) || [];

}




// Save Activity

function saveActivity(
action
){



let user = JSON.parse(

localStorage.getItem(
"currentUser"
)

);



if(!user) return;



let logs = getActivityLogs();




logs.push({

id:Date.now(),

user:user.name,

username:user.username,

role:user.role,

action:action,

time:new Date().toLocaleString()

});




localStorage.setItem(

"activityLogs",

JSON.stringify(logs)

);



}






// Load Activity Table

function loadActivityLogs(){


let table = document.getElementById(
"activityList"
);



if(!table) return;



let logs=getActivityLogs();



table.innerHTML="";



logs.reverse().forEach((log,index)=>{


table.innerHTML += `

<tr>

<td>${index+1}</td>

<td>${log.user}</td>

<td>${log.role}</td>

<td>${log.action}</td>

<td>${log.time}</td>

</tr>

`;



});


}