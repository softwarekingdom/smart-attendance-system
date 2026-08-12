// =====================================
// AI Attendance System
// Teacher Management System
// Version 3.0
// Part 1
// =====================================



// =====================================
// Initialize
// =====================================

window.addEventListener("load", function(){

    loadTeachers();

    updateTeacherCount();

});




// =====================================
// Get Teachers
// =====================================

function getTeachers(){

    return JSON.parse(
        localStorage.getItem("teachers")
    ) || [];

}




// =====================================
// Save Teachers
// =====================================

function saveTeachers(teachers){

    localStorage.setItem(
        "teachers",
        JSON.stringify(teachers)
    );

}





// =====================================
// Add Teacher
// =====================================

function addTeacher(){


    let name =
    document.getElementById("teacherName")
    .value.trim();



    let username =
    document.getElementById("teacherUsername")
    .value.trim();



    let password =
    document.getElementById("teacherPassword")
    .value.trim();



    if(
        name === "" ||
        username === "" ||
        password === ""
    ){

        alert(
            "Please fill required fields"
        );

        return;

    }




    let teachers = getTeachers();




    let exists = teachers.find(
        teacher =>
        teacher.username === username
    );



    if(exists){

        alert(
            "Username already exists"
        );

        return;

    }




    let teacher = {


        id: Date.now(),


        name:name,


        username:username,


        password:password,


        phone:
        document.getElementById(
        "teacherPhone"
        ).value.trim(),



        email:
        document.getElementById(
        "teacherEmail"
        ).value.trim(),



        subject:
        document.getElementById(
        "teacherSubject"
        ).value.trim(),



        role:"Teacher",



        status:"Active",



        classes:[],


        joinDate:
        new Date().toISOString()


    };





    teachers.push(teacher);



    saveTeachers(teachers);



    alert(
        "Teacher Added Successfully"
    );




    clearTeacherForm();



    loadTeachers();


    updateTeacherCount();



}







// =====================================
// Clear Form
// =====================================

function clearTeacherForm(){


    let fields = [

        "teacherName",
        "teacherUsername",
        "teacherPassword",
        "teacherPhone",
        "teacherEmail",
        "teacherSubject"

    ];



    fields.forEach(id=>{


        let element =
        document.getElementById(id);



        if(element){

            element.value="";

        }


    });


}








// =====================================
// Load Teachers
// =====================================

function loadTeachers(){


    let table =
    document.getElementById(
        "teacherList"
    );



    if(!table){

        return;

    }




    table.innerHTML="";




    let teachers =
    getTeachers();





    teachers.forEach(
    (teacher,index)=>{


        let classCount =
        teacher.classes ?
        teacher.classes.length :
        0;





        table.innerHTML += `


        <tr>


        <td>
        ${index+1}
        </td>



        <td>
        ${teacher.name}
        </td>



        <td>
        ${teacher.username}
        </td>



        <td>
        ${teacher.subject || "N/A"}
        </td>



        <td>
        ${teacher.phone || "N/A"}
        </td>



        <td>
        🏫 ${classCount}
        </td>



        <td>
        🟢 ${teacher.status}
        </td>




        <td>


        <button
        class="view-btn"
        onclick="viewTeacher(${teacher.id})">

        👁 View

        </button>




        <button
        class="edit-btn"
        onclick="editTeacher(${teacher.id})">

        ✏️ Edit

        </button>




        <button
        class="action-btn"
        onclick="deleteTeacher(${teacher.id})">

        🗑 Delete

        </button>


        </td>


        </tr>


        `;


    });


}
// =====================================
// Teacher Management System
// Version 3.0
// Part 2
// =====================================




// =====================================
// Search Teacher
// =====================================

function searchTeacher(){


    let value =
    document.getElementById(
        "teacherSearch"
    )
    .value
    .toLowerCase();




    let rows =
    document.querySelectorAll(
        "#teacherList tr"
    );



    rows.forEach(row=>{


        let text =
        row.innerText.toLowerCase();



        if(text.includes(value)){


            row.style.display="";


        }
        else{


            row.style.display="none";


        }


    });


}







// =====================================
// Teacher Count
// =====================================

function updateTeacherCount(){


    let countBox =
    document.getElementById(
        "teacherCount"
    );



    if(countBox){


        countBox.innerText =
        getTeachers().length;


    }


}







// =====================================
// Delete Teacher
// =====================================

function deleteTeacher(id){



    let confirmDelete =
    confirm(
        "Delete this Teacher?"
    );



    if(!confirmDelete){

        return;

    }




    let teachers =
    getTeachers();




    teachers =
    teachers.filter(
        teacher =>
        teacher.id !== id
    );




    saveTeachers(teachers);



    loadTeachers();



    updateTeacherCount();



    alert(
        "Teacher Deleted Successfully"
    );


}








// =====================================
// Edit Teacher
// =====================================

function editTeacher(id){



    let teachers =
    getTeachers();




    let teacher =
    teachers.find(
        t=>t.id===id
    );





    if(!teacher){

        alert(
            "Teacher not found"
        );

        return;

    }






    document.getElementById(
        "teacherName"
    ).value =
    teacher.name;





    document.getElementById(
        "teacherUsername"
    ).value =
    teacher.username;






    document.getElementById(
        "teacherPassword"
    ).value =
    teacher.password;






    document.getElementById(
        "teacherPhone"
    ).value =
    teacher.phone || "";






    document.getElementById(
        "teacherEmail"
    ).value =
    teacher.email || "";






    document.getElementById(
        "teacherSubject"
    ).value =
    teacher.subject || "";





    localStorage.setItem(
        "editingTeacher",
        id
    );



    alert(
        "Edit Mode Enabled. Change details and save."
    );


}








// =====================================
// Update Teacher
// =====================================

function updateTeacher(){



    let id =
    Number(
    localStorage.getItem(
        "editingTeacher"
    )
    );



    if(!id){

        alert(
            "No Teacher Selected"
        );

        return;

    }





    let teachers =
    getTeachers();





    let teacher =
    teachers.find(
        t=>t.id===id
    );





    if(!teacher){

        return;

    }





    teacher.name =
    document.getElementById(
        "teacherName"
    )
    .value.trim();





    teacher.password =
    document.getElementById(
        "teacherPassword"
    )
    .value.trim();





    teacher.phone =
    document.getElementById(
        "teacherPhone"
    )
    .value.trim();





    teacher.email =
    document.getElementById(
        "teacherEmail"
    )
    .value.trim();





    teacher.subject =
    document.getElementById(
        "teacherSubject"
    )
    .value.trim();






    saveTeachers(
        teachers
    );





    localStorage.removeItem(
        "editingTeacher"
    );




    clearTeacherForm();



    loadTeachers();



    alert(
        "Teacher Updated Successfully"
    );


}
// =====================================
// Teacher Management System
// Version 3.0
// Part 3
// =====================================




// =====================================
// View Teacher Profile
// =====================================

function viewTeacher(id){


    let teachers =
    getTeachers();



    let teacher =
    teachers.find(
        t=>t.id===id
    );



    if(!teacher){

        alert(
            "Teacher not found"
        );

        return;

    }





    let popup =
    document.getElementById(
        "teacherProfilePopup"
    );



    let content =
    document.getElementById(
        "teacherProfileContent"
    );




    content.innerHTML = `


    <div class="teacher-avatar">
    👨‍🏫
    </div>



    <h2>
    ${teacher.name}
    </h2>



    <div class="profile-info">



    <p>
    👤 Username :
    ${teacher.username}
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
    📅 Joined :
    ${
    new Date(
    teacher.joinDate
    )
    .toLocaleDateString()
    }
    </p>




    <p>
    🏫 Assigned Classes
    </p>



    <div class="assigned-class-list">

    ${
    getTeacherClasses(
        teacher.username
    )
    }

    </div>



    </div>


    `;




    popup.classList.add(
        "active"
    );



}







// =====================================
// Close Teacher Profile
// =====================================

function closeTeacherProfile(){


    let popup =
    document.getElementById(
        "teacherProfilePopup"
    );



    if(popup){

        popup.classList.remove(
            "active"
        );

    }


}








// =====================================
// Get Teacher Classes
// =====================================

function getTeacherClasses(username){


    let teachers =
    getTeachers();



    let teacher =
    teachers.find(
        t=>t.username===username
    );




    if(
        !teacher ||
        !teacher.classes ||
        teacher.classes.length===0
    ){

        return `
        <p>
        No Classes Assigned
        </p>
        `;

    }






    return teacher.classes
    .map(cls=>`

        <span class="class-tag">

        🏫 ${cls}

        </span>

    `)
    .join("");



}







// =====================================
// Load Teacher Dropdown
// For Class Assignment
// =====================================

function loadTeacherDropdown(){


    let select =
    document.getElementById(
        "assignTeacher"
    );



    if(!select){

        return;

    }




    select.innerHTML = `

    <option value="">
    -- Select Teacher --
    </option>

    `;



    let teachers =
    getTeachers();





    teachers.forEach(
    teacher=>{


        select.innerHTML += `

        <option value="${teacher.username}">

        ${teacher.name}

        </option>


        `;


    });


}







// =====================================
// Assign Classes To Teacher
// =====================================

function assignClasses(){

    let username =
    document.getElementById("assignTeacher").value;


    if(username===""){

        alert("Select Teacher");
        return;

    }


    let selectedClasses=[];


    document.querySelectorAll(".classCheck:checked")
    .forEach(box=>{

        selectedClasses.push(box.value);

    });



    let teachers=getTeachers();


    let teacher =
    teachers.find(
        t=>t.username===username
    );


    if(!teacher){

        alert("Teacher not found");
        return;

    }


    teacher.classes = selectedClasses;


    saveTeachers(teachers);


    loadTeachers();


    alert("Classes Assigned Successfully");

}






// =====================================
// Auto Load Functions
// =====================================

window.addEventListener(
"load",
function(){


    loadTeacherDropdown();


});
// =====================================
// Class Management System
// =====================================



// Get Classes

function getClasses(){

    return JSON.parse(
        localStorage.getItem("classes")
    ) || [];

}





// Save Classes

function saveClasses(classes){

    localStorage.setItem(
        "classes",
        JSON.stringify(classes)
    );

}







// Add New Class

function addClass(){


    let className =
    document.getElementById(
        "newClassName"
    )
    .value
    .trim();




    if(className===""){

        alert(
            "Enter Class Name"
        );

        return;

    }




    let classes =
    getClasses();




    if(classes.includes(className)){


        alert(
            "Class Already Exists"
        );

        return;

    }





    classes.push(
        className
    );




    saveClasses(
        classes
    );




    document.getElementById(
        "newClassName"
    )
    .value="";




    loadClassList();



    loadAssignmentClasses();



    alert(
        "Class Created Successfully"
    );

}








// Display Classes

function loadClassList(){


    let box =
    document.getElementById(
        "classList"
    );



    if(!box){

        return;

    }





    let classes =
    getClasses();



    box.innerHTML="";




    classes.forEach(
    (cls,index)=>{


        box.innerHTML += `


        <div class="class-item">


        <label>


        <input 
        type="checkbox"
        class="classCheck"
        value="${cls}">


        🏫 ${cls}


        </label>



        <button
        onclick="deleteClass(${index})">

        ❌

        </button>


        </div>


        `;


    });


}









// Delete Class

function deleteClass(index){


    let classes =
    getClasses();



    classes.splice(
        index,
        1
    );



    saveClasses(
        classes
    );



    loadClassList();


    loadAssignmentClasses();



}







// Load Classes For Teacher Assignment

function loadAssignmentClasses(){


    loadClassList();

}







// Auto Load

window.addEventListener(
"load",
function(){


    loadClassList();


});