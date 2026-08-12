// =====================================
// AI ATTENDANCE MANAGEMENT SYSTEM
// dashboard.js
// =====================================



document.addEventListener(
"DOMContentLoaded",
loadDashboard
);


function loadDashboard(){

    checkTeacher();

    showDate();

    attendanceSummary();

    loadTeacherInfo();

    loadAssignedClass();

    aiPrediction();

    loadRecentActivity();

    loadAIReport();

    loadWeeklyAttendance();

    loadAttendancePieChart();

    loadAITrend();

    loadAttendanceRanking();
}



function aiPrediction(){

    let students =
    JSON.parse(localStorage.getItem("students")) || [];

    let attendance = getTodayAttendance();

    let total = students.length;

    let present =
    attendance.filter(
        s => s.status === "Present"
    ).length;

    let absent =
    attendance.filter(
        s => s.status === "Absent"
    ).length;

    let rate = 0;

    if(total > 0){
        rate = (present / total) * 100;
    }

    let message = "";

    if(total === 0){

        message =
`🤖 AI Status

No student data available yet.

Please add students first.`;

    }

    else if(rate >= 95){

        message =
`🟢 Excellent Attendance

Attendance Rate : ${rate.toFixed(1)}%

Prediction:
Tomorrow's attendance is likely to remain excellent.

Recommendation:
Keep following the current routine.`;

    }

    else if(rate >= 80){

        message =
`🟡 Good Attendance

Attendance Rate : ${rate.toFixed(1)}%

Prediction:
Attendance is stable.

Recommendation:
Follow up with today's absent students.`;

    }

    else{

        message =
`🔴 Attendance Alert

Attendance Rate : ${rate.toFixed(1)}%

Prediction:
Attendance may decrease if this trend continues.

Recommendation:
Contact parents through WhatsApp and investigate the reasons for absence.`;

    }

    document.getElementById("prediction").innerText = message;

}





let summary =

`
📊 AI Attendance Analysis


👨‍🎓 Total Students : ${total}


✅ Present Today : ${present}


❌ Absent Today : ${absent}


📈 Attendance Rate : ${percentage}%



🤖 AI Recommendation:

${percentage >= 80 
? 
"Attendance is good. Keep maintaining it."
:
"Attendance is low. Contact absent students."
}

`;






let box =

document.getElementById(
"aiSummary"
);



if(box){

box.innerText = summary;

}



}
function aiPrediction(){


let attendance =

JSON.parse(

localStorage.getItem("attendance")

) || [];



let present =

attendance.filter(

item=>item.status==="Present"

).length;



let total = attendance.length;



let predictionText = "";





if(total===0){


predictionText =

"📌 No attendance data available yet.";


}

else{


let rate =

(present/total)*100;



if(rate>=80){


predictionText =

`
Tomorrow Expected Attendance:

🟢 Good Attendance


AI Recommendation:

Students attendance is healthy.
Maintain the same performance.
`;



}

else{


predictionText =

`
Tomorrow Expected Attendance:

🔴 Low Attendance Risk


AI Recommendation:

Contact absent students through WhatsApp.
`;



}


}



document.getElementById(
"prediction"
).innerText = predictionText;

}
function loadRecentActivity(){

    let attendance = JSON.parse(
        localStorage.getItem("attendance")
    ) || [];

    let list = document.getElementById("recentActivity");

    if(!list) return;

    list.innerHTML = "";

    if(attendance.length === 0){

        list.innerHTML = "<li>No Recent Activity</li>";

        return;

    }

    attendance.slice().reverse().forEach(student=>{

        let icon =
        student.status === "Present"
        ? "🟢"
        : "🔴";

        list.innerHTML +=
        `<li>${icon} ${student.name} - ${student.status}</li>`;

    });

}
function loadAIReport(){

    let students =
    JSON.parse(localStorage.getItem("students")) || [];

    let attendance =
    JSON.parse(localStorage.getItem("attendance")) || [];

    let total = students.length;

    let present =
    attendance.filter(
        s=>s.status==="Present"
    ).length;

    let absent =
    attendance.filter(
        s=>s.status==="Absent"
    ).length;

    let rate = 0;

    if(total>0){

        rate =
        ((present/total)*100).toFixed(1);

    }

    document.getElementById("reportStudents").innerText = total;

    document.getElementById("reportPresent").innerText = present;

    document.getElementById("reportAbsent").innerText = absent;

    document.getElementById("reportRate").innerText = rate + "%";



    // Best Class

    let classes = {};

    students.forEach(student=>{

        if(!classes[student.className]){

            classes[student.className]=0;

        }

        classes[student.className]++;

    });

    let best="No Data";

    let max=0;

    for(let cls in classes){

        if(classes[cls]>max){

            max=classes[cls];

            best=cls;

        }

    }

    document.getElementById("bestClass").innerText = best;



    // Risk Students

    document.getElementById(
        "riskStudents"
    ).innerText = absent;

}
function getTodayAttendance(){


    let history = JSON.parse(

        localStorage.getItem("attendanceHistory")

    ) || [];



    let today = new Date()
    .toLocaleDateString();



    let todayData = history.find(

        day => day.date === today

    );



    if(todayData){

        return todayData.records;

    }


    return [];

}
// =====================================
// Teacher Dashboard Profile
// =====================================


function loadTeacherInfo(){


    let teacher = JSON.parse(

        localStorage.getItem("currentUser")

    );



    let nameBox = document.getElementById(

        "welcomeTeacher"

    );



    let roleBox = document.getElementById(

        "teacherRole"

    );




    if(teacher && nameBox){


        nameBox.innerHTML =

        "Welcome, " + teacher.name + " 👨‍🏫";


    }




    if(teacher && roleBox){


        roleBox.innerHTML =

        "Role : " + teacher.role;


    }


};

// =====================================
// Load Teacher Assigned Class
// =====================================


function loadAssignedClass(){


    let teacher = JSON.parse(

        localStorage.getItem("currentUser")

    );



    if(!teacher){

        return;

    }




    let classes = JSON.parse(

        localStorage.getItem("teacherClasses")

    ) || [];





    let assigned = classes.find(

        c => c.teacher === teacher.username

    );





    let classBox = document.getElementById(
        "assignedClass"
    );





    if(assigned && classBox){


        classBox.innerHTML =

        assigned.className;



    }

    else if(classBox){


        classBox.innerHTML =

        "No Class Assigned";


    }


}
// =====================================
// Teacher Information
// =====================================


function loadTeacherInfo(){


let user = JSON.parse(

localStorage.getItem("currentUser")

);



if(!user){

window.location.href =
"teacher login.html";

return;

}



let nameBox =
document.getElementById(
"teacherName"
);



if(nameBox){

nameBox.innerText =
user.name;

}



loadTeacherClass();


}







// =====================================
// Load Assigned Class
// =====================================


function loadTeacherClass(){


let user = JSON.parse(

localStorage.getItem("currentUser")

);



let classes = JSON.parse(

localStorage.getItem("teacherClasses")

) || [];




let assignedClass = classes.find(

item =>

item.teacher === user.username

);





let classBox =
document.getElementById(
"teacherClass"
);





if(classBox){


if(assignedClass){


classBox.innerHTML =

"🏫 Class : " +
assignedClass.className;


}

else{


classBox.innerHTML =

"🏫 No Class Assigned";


}


}



}


function checkTeacher(){


let role = localStorage.getItem(
"userRole"
);



if(role !== "teacher"){


window.location.href =
"teacher login.html";


}


}
// =====================================
// Load Assigned Class
// =====================================


// =====================================
// Load Multiple Assigned Classes
// =====================================

function loadAssignedClass(){


    let teacher = JSON.parse(

        localStorage.getItem("currentUser")

    );



    let classBox = document.getElementById(

        "assignedClass"

    );



    if(!teacher || !classBox){

        return;

    }




    let assignments = JSON.parse(

        localStorage.getItem("classes")

    ) || [];





    let myClasses = assignments.filter(

        item => item.teacher === teacher.username

    );





    if(myClasses.length === 0){


        classBox.innerHTML =

        "No Class Assigned";


        return;


    }






    let output = "";



    myClasses.forEach(item=>{


        output +=

        "✅ " + item.className + "<br>";


    });





    classBox.innerHTML = output;


}
/// =====================================
// Weekly Attendance Analytics
// =====================================

function loadWeeklyAttendance(){

    let history = JSON.parse(

        localStorage.getItem("attendanceHistory")

    ) || [];



    let box = document.getElementById(

        "weeklyAttendance"

    );



    if(!box) return;



    if(history.length===0){

        box.innerHTML=

        "<p>No Attendance History</p>";

        return;

    }



    box.innerHTML="";



    history.forEach(day=>{

        let present=0;

        let total=0;



        day.records.forEach(student=>{

            total++;

            if(student.status==="Present"){

                present++;

            }

        });



        let percentage=0;

        if(total>0){

            percentage=

            ((present/total)*100).toFixed(1);

        }



        // Day Name

        let dayName =

        new Date(day.date)

        .toLocaleDateString(

            "en-US",

            { weekday:"long" }

        );



        // Progress Color

        let color="progress-red";



        if(percentage>=90){

            color="progress-green";

        }

        else if(percentage>=75){

            color="progress-yellow";

        }



        box.innerHTML += `

<div class="chart-row">

<span>${dayName}</span>

<div class="progress">

<div class="progress-bar ${color}"

style="width:${percentage}%">

</div>

</div>

<b>${percentage}%</b>

</div>

`;



    });

}
// =====================================
// Attendance Line Chart
// =====================================


function loadAttendanceLineChart(){


let history = JSON.parse(

localStorage.getItem("attendanceHistory")

) || [];



let labels=[];

let data=[];



history.forEach(day=>{


let present=0;

let total=day.records.length;



day.records.forEach(student=>{


if(student.status==="Present"){

present++;

}


});



let percentage=0;


if(total>0){

percentage=

((present/total)*100).toFixed(1);

}



labels.push(day.date);

data.push(percentage);



});





new Chart(

document.getElementById(
"attendanceLineChart"
),

{

type:"line",


data:{

labels:labels,


datasets:[{

label:"Attendance %",

data:data,

tension:0.4

}]


}

}

);


}







// =====================================
// Present vs Absent Pie Chart
// =====================================


function loadAttendancePieChart(){


let history = JSON.parse(

localStorage.getItem("attendanceHistory")

) || [];



let present=0;

let absent=0;



history.forEach(day=>{


day.records.forEach(student=>{


if(student.status==="Present"){

present++;

}

else{

absent++;

}


});


});





new Chart(

document.getElementById(
"attendancePieChart"
),

{

type:"pie",


data:{

labels:[

"Present",

"Absent"

],


datasets:[{

data:[

present,

absent

]


}]


}

}

);


}
// =====================================
// AI Trend Analysis
// =====================================

function loadAITrend(){

    let history = JSON.parse(

        localStorage.getItem("attendanceHistory")

    ) || [];



    let box = document.getElementById(

        "aiTrend"

    );



    if(!box) return;



    if(history.length < 2){

        box.innerHTML =

        "📊 Not enough attendance data to analyse trends.";

        return;

    }



    let percentages = [];



    history.forEach(day=>{

        let present = 0;

        let total = day.records.length;



        day.records.forEach(student=>{

            if(student.status === "Present"){

                present++;

            }

        });



        let percentage =

        total > 0 ?

        (present/total)*100 : 0;



        percentages.push(percentage);

    });



    let first = percentages[0];

    let last = percentages[percentages.length-1];



    let trend = "";



    if(last > first + 5){

        trend =

        "📈 Attendance is improving.<br><br>" +

        "🤖 AI Recommendation: Continue the current attendance strategy and appreciate students with regular attendance.";

    }

    else if(last < first - 5){

        trend =

        "📉 Attendance has decreased.<br><br>" +

        "🤖 AI Recommendation: Contact absent students, inform parents if necessary, and identify the reasons for repeated absences.";

    }

    else{

        trend =

        "➡️ Attendance is stable.<br><br>" +

        "🤖 AI Recommendation: Continue monitoring attendance and encourage students to maintain regular participation.";

    }



    box.innerHTML = trend;

}
// =====================================
// Student Attendance Ranking
// =====================================

function loadAttendanceRanking(){

    let history = JSON.parse(

        localStorage.getItem("attendanceHistory")

    ) || [];



    let topBox = document.getElementById(

        "topStudents"

    );



    let lowBox = document.getElementById(

        "lowStudents"

    );



    if(!topBox || !lowBox){

        return;

    }



    if(history.length===0){

        topBox.innerHTML="No Data";

        lowBox.innerHTML="No Data";

        return;

    }



    let stats={};



    history.forEach(day=>{

        day.records.forEach(student=>{

            if(!stats[student.name]){

                stats[student.name]={

                    present:0,

                    total:0

                };

            }



            stats[student.name].total++;



            if(student.status==="Present"){

                stats[student.name].present++;

            }

        });

    });



    let list=[];



    for(let name in stats){

        let percentage=(

            stats[name].present/

            stats[name].total

        )*100;



        list.push({

            name:name,

            percentage:percentage

        });

    }



    list.sort(

        (a,b)=>

        b.percentage-a.percentage

    );



    topBox.innerHTML="";



    list.slice(0,5).forEach(student=>{

        topBox.innerHTML += `

<div class="student-rank">

<span>${student.name}</span>

<b>${student.percentage.toFixed(1)}%</b>

</div>

`;

    });



    lowBox.innerHTML="";



    list.reverse().slice(0,5).forEach(student=>{

        lowBox.innerHTML += `

<div class="student-rank">

<span>${student.name}</span>

<b>${student.percentage.toFixed(1)}%</b>

</div>

`;

    });

}