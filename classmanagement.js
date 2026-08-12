/* =====================================
AI SCHOOL
CLASS MANAGEMENT SYSTEM
Version 1.0
===================================== */

/* =====================================
PAGE LOAD
===================================== */

window.addEventListener("load", function(){

loadClasses();
updateClassCount();
updateStudentCount();

});

/* =====================================
GET CLASSES
===================================== */

function getClasses(){

return JSON.parse(
    localStorage.getItem("schoolClasses")
) || [];

}

/* =====================================
SAVE CLASSES
===================================== */

function saveClasses(classes){

localStorage.setItem(
    "schoolClasses",
    JSON.stringify(classes)
);

}

/* =====================================
ADD CLASS
===================================== */

function addClass(){

const input =
    document.getElementById("newClassName");

if(!input){
    return;
}


const className =
    input.value.trim();


if(className === ""){

    alert("Please enter a class name.");

    input.focus();

    return;
}


let classes =
    getClasses();


/* Prevent duplicate class */

const exists =
    classes.some(
        cls =>
            cls.toLowerCase() ===
            className.toLowerCase()
    );


if(exists){

    alert(
        "This class already exists."
    );

    input.focus();

    return;
}


/* Add class */

classes.push(className);


saveClasses(classes);


input.value = "";


loadClasses();
updateClassCount();


alert(
    "Class created successfully!"
);

}

/* =====================================
LOAD CLASS LIST
===================================== */

function loadClasses(){

const table =
    document.getElementById("classList");


if(!table){
    return;
}


table.innerHTML = "";


const classes =
    getClasses();


if(classes.length === 0){

    table.innerHTML = `

        <tr>

            <td colspan="5">

                🏫 No classes created yet.

            </td>

        </tr>

    `;

    return;
}


const students =
    JSON.parse(
        localStorage.getItem("students")
    ) || [];


const teachers =
    JSON.parse(
        localStorage.getItem("teachers")
    ) || [];


classes.forEach(
    (className,index) => {


    /* Count students */

    const studentCount =
        students.filter(
            student =>
                student.className === className
        ).length;


    /* Find teacher */

    const teacher =
        teachers.find(
            teacher =>
                Array.isArray(teacher.classes) &&
                teacher.classes.includes(className)
        );


    const teacherName =
        teacher
            ? teacher.name
            : "Not Assigned";


    table.innerHTML += `

        <tr>

            <td>
                ${index + 1}
            </td>

            <td>
                🏫 ${escapeHTML(className)}
            </td>

            <td>
                👨‍🎓 ${studentCount}
            </td>

            <td>
                ${
                    escapeHTML(
                        teacherName
                    )
                }
            </td>

            <td>

                <button
                    onclick="editClass(${index})">

                    ✏ Edit

                </button>


                <button
                    onclick="deleteClass(${index})">

                    🗑 Delete

                </button>

            </td>

        </tr>

    `;

});

}

/* =====================================
EDIT CLASS
===================================== */

function editClass(index){

let classes =
    getClasses();


if(
    index < 0 ||
    index >= classes.length
){

    return;
}


const oldName =
    classes[index];


const newName =
    prompt(
        "Enter new class name:",
        oldName
    );


if(newName === null){
    return;
}


const trimmedName =
    newName.trim();


if(trimmedName === ""){

    alert(
        "Class name cannot be empty."
    );

    return;
}


/* Check duplicate */

const duplicate =
    classes.some(
        (cls,i) =>
            i !== index &&
            cls.toLowerCase() ===
            trimmedName.toLowerCase()
    );


if(duplicate){

    alert(
        "This class already exists."
    );

    return;
}


/* Update students */

const students =
    JSON.parse(
        localStorage.getItem("students")
    ) || [];


students.forEach(
    student => {

        if(
            student.className === oldName
        ){

            student.className =
                trimmedName;

        }

    }
);


localStorage.setItem(
    "students",
    JSON.stringify(students)
);


/* Update teacher assignments */

const teachers =
    JSON.parse(
        localStorage.getItem("teachers")
    ) || [];


teachers.forEach(
    teacher => {

        if(
            Array.isArray(
                teacher.classes
            )
        ){

            teacher.classes =
                teacher.classes.map(
                    cls =>
                        cls === oldName
                            ? trimmedName
                            : cls
                );

        }

    }
);


localStorage.setItem(
    "teachers",
    JSON.stringify(teachers)
);


/* Update class */

classes[index] =
    trimmedName;


saveClasses(classes);


loadClasses();
updateClassCount();


alert(
    "Class updated successfully!"
);

}

/* =====================================
DELETE CLASS
===================================== */

function deleteClass(index){

let classes =
    getClasses();


if(
    index < 0 ||
    index >= classes.length
){

    return;
}


const className =
    classes[index];


const students =
    JSON.parse(
        localStorage.getItem("students")
    ) || [];


const studentCount =
    students.filter(
        student =>
            student.className === className
    ).length;


let message =
    `Delete "${className}"?`;


if(studentCount > 0){

    message +=
        `\n\nThis class has ${studentCount} student(s).`;
}


if(
    !confirm(message)
){

    return;
}


/* Remove class */

classes.splice(index,1);


saveClasses(classes);


/* Remove class from teachers */

const teachers =
    JSON.parse(
        localStorage.getItem("teachers")
    ) || [];


teachers.forEach(
    teacher => {

        if(
            Array.isArray(
                teacher.classes
            )
        ){

            teacher.classes =
                teacher.classes.filter(
                    cls =>
                        cls !== className
                );

        }

    }
);


localStorage.setItem(
    "teachers",
    JSON.stringify(teachers)
);


loadClasses();
updateClassCount();


alert(
    "Class deleted successfully."
);

}

/* =====================================
SEARCH
===================================== */

function searchClasses(){

const searchInput =
    document.getElementById(
        "classSearch"
    );


const value =
    searchInput.value
        .trim()
        .toLowerCase();


document
    .querySelectorAll(
        "#classList tr"
    )
    .forEach(
        row => {

            const text =
                row.innerText
                    .toLowerCase();


            row.style.display =
                text.includes(value)
                    ? ""
                    : "none";

        }
    );

}

/* =====================================
CLASS COUNT
===================================== */

function updateClassCount(){

const box =
    document.getElementById(
        "classCount"
    );


if(box){

    box.innerText =
        getClasses().length;

}

}

/* =====================================
STUDENT COUNT
===================================== */

function updateStudentCount(){

const box =
    document.getElementById(
        "studentCount"
    );


if(!box){
    return;
}


const students =
    JSON.parse(
        localStorage.getItem("students")
    ) || [];


box.innerText =
    students.length;

}

/* =====================================
HTML SAFETY
===================================== */

function escapeHTML(value){

return String(value)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");

}