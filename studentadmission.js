// =====================================
// AI SCHOOL
// Student Admission System
// Version 6.1
// Supabase Database Version
// =====================================


// =====================================
// PAGE LOAD
// =====================================

window.addEventListener("load", function () {

    loadStudentClasses();

    loadStudents();

});


// =====================================
// GET SCHOOL CLASSES
// =====================================

function getSchoolClasses() {

    return JSON.parse(
        localStorage.getItem("schoolClasses")
    ) || [];

}


// =====================================
// LOAD CLASSES
// =====================================

function loadStudentClasses() {

    const select =
        document.getElementById(
            "studentClass"
        );


    if (!select) {

        return;

    }


    select.innerHTML = `

        <option value="">
            Select Class
        </option>

    `;


    const classes =
        getSchoolClasses();


    if (classes.length === 0) {

        const option =
            document.createElement(
                "option"
            );


        option.value = "";

        option.textContent =
            "No Classes Created";

        option.disabled = true;


        select.appendChild(
            option
        );

        return;

    }


    classes.forEach(
        function (className) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                String(
                    className
                ).trim();


            option.textContent =
                String(
                    className
                ).trim();


            select.appendChild(
                option
            );

        }
    );

}


// =====================================
// ADD STUDENT
// SUPABASE
// =====================================

async function addStudent() {

    const name =
        document.getElementById(
            "studentName"
        ).value.trim();


    const parentName =
        document.getElementById(
            "parentName"
        ).value.trim();


    const parentPhone =
        document.getElementById(
            "parentPhone"
        ).value.trim();


    const schoolName =
        document.getElementById(
            "schoolName"
        ).value.trim();


    const className =
        document.getElementById(
            "studentClass"
        ).value.trim();


    const gender =
        document.getElementById(
            "gender"
        ).value;


    const birthDate =
        document.getElementById(
            "birthDate"
        ).value;


    const admissionDate =
        document.getElementById(
            "admissionDate"
        ).value;


    // =================================
    // VALIDATION
    // =================================

    if (name === "") {

        alert(
            "Please enter student name."
        );

        return;

    }


    if (parentName === "") {

        alert(
            "Please enter parent name."
        );

        return;

    }


    if (parentPhone === "") {

        alert(
            "Please enter WhatsApp number."
        );

        return;

    }


    if (className === "") {

        alert(
            "Please select a class."
        );

        return;

    }


    if (gender === "") {

        alert(
            "Please select gender."
        );

        return;

    }


    // =================================
    // SAVE TO SUPABASE
    // =================================

    try {

        const { data, error } =
            await supabaseClient
                .from("students")
                .insert([
                    {

                        name:
                            name,

                        parentName:
                            parentName,

                        parentPhone:
                            parentPhone,

                        schoolName:
                            schoolName,

                        class_name:
                            className,

                        gender:
                            gender,

                        birthDate:
                            birthDate,

                        admissionDate:
                            admissionDate

                    }
                ])
                .select();


        // =================================
        // ERROR CHECK
        // =================================

        if (error) {

            console.error(
                "Supabase Insert Error:",
                error
            );


            alert(
                "❌ Student could not be saved.\n\n" +
                error.message
            );


            return;

        }


        // =================================
        // SUCCESS
        // =================================

        console.log(
            "Student saved:",
            data
        );


        clearStudentForm();


        await loadStudents();


        alert(
            "✅ Student Added Successfully"
        );

    }


    catch (error) {

        console.error(
            "Unexpected Error:",
            error
        );


        alert(
            "❌ Something went wrong while saving student."
        );

    }

}


// =====================================
// LOAD STUDENT LIST
// SUPABASE
// =====================================

async function loadStudents() {

    const table =
        document.getElementById(
            "studentList"
        );


    if (!table) {

        return;

    }


    table.innerHTML = "";


    try {

        const { data, error } =
            await supabaseClient
                .from("students")
                .select("*")
                .order(
                    "id",
                    {
                        ascending: true
                    }
                );


        // =================================
        // ERROR CHECK
        // =================================

        if (error) {

            console.error(
                "Supabase Select Error:",
                error
            );


            table.innerHTML = `

                <tr>

                    <td colspan="5">

                        ❌ Unable to load students

                    </td>

                </tr>

            `;


            return;

        }


        const students =
            data || [];


        // =================================
        // NO STUDENTS
        // =================================

        if (
            students.length === 0
        ) {

            table.innerHTML = `

                <tr>

                    <td colspan="5">

                        👨‍🎓 No Students Found

                    </td>

                </tr>

            `;


            return;

        }


        // =================================
        // DISPLAY STUDENTS
        // =================================

        students.forEach(
            function (
                student,
                index
            ) {

                table.innerHTML += `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>


                        <td>
                            ${escapeHTML(
                                student.name || "-"
                            )}
                        </td>


                        <td>
                            ${escapeHTML(
                                student.class_name || "-"
                            )}
                        </td>


                        <td>
                            ${escapeHTML(
                                student.parentPhone || "-"
                            )}
                        </td>


                        <td>

                            <button
                                type="button"
                                onclick="deleteStudent('${student.id}')">

                                🗑 Delete

                            </button>

                        </td>

                    </tr>

                `;

            }
        );

    }


    catch (error) {

        console.error(
            "Unexpected Load Error:",
            error
        );


        table.innerHTML = `

            <tr>

                <td colspan="5">

                    ❌ Unable to load students

                </td>

            </tr>

        `;

    }

}


// =====================================
// CLEAR FORM
// =====================================

function clearStudentForm() {

    const fields = [

        "studentName",

        "parentName",

        "parentPhone",

        "schoolName",

        "birthDate",

        "admissionDate"

    ];


    fields.forEach(
        function (id) {

            const element =
                document.getElementById(
                    id
                );


            if (element) {

                element.value = "";

            }

        }
    );


    const classSelect =
        document.getElementById(
            "studentClass"
        );


    if (classSelect) {

        classSelect.value = "";

    }


    const gender =
        document.getElementById(
            "gender"
        );


    if (gender) {

        gender.value = "";

    }

}


// =====================================
// DELETE STUDENT
// SUPABASE
// =====================================

async function deleteStudent(id) {

    const confirmDelete =
        confirm(
            "Delete this student?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const { error } =
            await supabaseClient
                .from("students")
                .delete()
                .eq(
                    "id",
                    id
                );


        // =================================
        // ERROR CHECK
        // =================================

        if (error) {

            console.error(
                "Supabase Delete Error:",
                error
            );


            alert(
                "❌ Student could not be deleted.\n\n" +
                error.message
            );


            return;

        }


        await loadStudents();


        alert(
            "🗑 Student Deleted"
        );

    }


    catch (error) {

        console.error(
            "Unexpected Delete Error:",
            error
        );


        alert(
            "❌ Something went wrong while deleting student."
        );

    }

}


// =====================================
// HTML SAFETY
// =====================================

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}