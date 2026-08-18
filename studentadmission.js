// =====================================
// AI SCHOOL
// Student Admission System
// Supabase Version
// =====================================

window.addEventListener("load", function () {

    loadStudentClasses();
    loadStudents();

});


// =====================================
// GET SCHOOL CLASSES
// =====================================

function getSchoolClasses() {

    try {

        return JSON.parse(
            localStorage.getItem("schoolClasses")
        ) || [];

    } catch (error) {

        console.error(
            "Class Load Error:",
            error
        );

        return [];

    }

}


// =====================================
// LOAD CLASSES
// =====================================

function loadStudentClasses() {

    const select =
        document.getElementById("studentClass");

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
            document.createElement("option");

        option.value = "";
        option.textContent =
            "No Classes Created";
        option.disabled = true;

        select.appendChild(option);

        return;
    }

    classes.forEach(function (className) {

        const cleanClass =
            String(className).trim();

        if (cleanClass === "") {
            return;
        }

        const option =
            document.createElement("option");

        option.value = cleanClass;
        option.textContent = cleanClass;

        select.appendChild(option);

    });

}


// =====================================
// ADD STUDENT
// =====================================

async function addStudent() {

    const name =
        document
            .getElementById("studentName")
            .value
            .trim();

    const parentPhone =
        document
            .getElementById("parentPhone")
            .value
            .trim();

    const schoolName =
        document
            .getElementById("schoolName")
            .value
            .trim();

    const className =
        document
            .getElementById("studentClass")
            .value
            .trim();


    if (name === "") {

        alert(
            "Please enter student name."
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


    try {

        const result =
            await supabaseClient
                .from("students")
                .insert({
                    name: name,
                    parentPhone: parentPhone,
                    schoolName: schoolName,
                    class_name: className
                });


        if (result.error) {

            console.error(
                "Supabase Insert Error:",
                result.error
            );

            alert(
                "❌ Student could not be saved.\n\n" +
                result.error.message
            );

            return;
        }


        clearStudentForm();

        await loadStudents();

        alert(
            "✅ Student Added Successfully"
        );

    }

    catch (error) {

        console.error(
            "Unexpected Insert Error:",
            error
        );

        alert(
            "❌ Something went wrong while saving student."
        );

    }

}


// =====================================
// LOAD STUDENTS
// =====================================

async function loadStudents() {

    const table =
        document.getElementById("studentList");

    if (!table) {
        return;
    }


    table.innerHTML = `
        <tr>
            <td colspan="5">
                ⏳ Loading students...
            </td>
        </tr>
    `;


    try {

        const result =
            await supabaseClient
                .from("students")
                .select(
                    "id,name,parentPhone,schoolName,class_name"
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (result.error) {

            console.error(
                "Supabase Select Error:",
                result.error
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
            result.data || [];


        if (students.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="5">
                        👨‍🎓 No Students Found
                    </td>
                </tr>
            `;

            return;
        }


        table.innerHTML = "";


        students.forEach(
            function (student, index) {

                const row =
                    document.createElement("tr");


                const noCell =
                    document.createElement("td");

                noCell.textContent =
                    index + 1;


                const nameCell =
                    document.createElement("td");

                nameCell.textContent =
                    student.name || "-";


                const classCell =
                    document.createElement("td");

                classCell.textContent =
                    student.class_name || "-";


                const phoneCell =
                    document.createElement("td");

                phoneCell.textContent =
                    student.parentPhone || "-";


                const actionCell =
                    document.createElement("td");


                const deleteButton =
                    document.createElement("button");

                deleteButton.type = "button";

                deleteButton.textContent =
                    "🗑 Delete";


                deleteButton.addEventListener(
                    "click",
                    function () {

                        deleteStudent(
                            student.id
                        );

                    }
                );


                actionCell.appendChild(
                    deleteButton
                );


                row.appendChild(noCell);
                row.appendChild(nameCell);
                row.appendChild(classCell);
                row.appendChild(phoneCell);
                row.appendChild(actionCell);


                table.appendChild(row);

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

    const name =
        document.getElementById("studentName");

    const parentPhone =
        document.getElementById("parentPhone");

    const schoolName =
        document.getElementById("schoolName");

    const classSelect =
        document.getElementById("studentClass");


    if (name) {
        name.value = "";
    }

    if (parentPhone) {
        parentPhone.value = "";
    }

    if (schoolName) {
        schoolName.value = "";
    }

    if (classSelect) {
        classSelect.value = "";
    }

}


// =====================================
// DELETE STUDENT
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

        const result =
            await supabaseClient
                .from("students")
                .delete()
                .eq("id", id);


        if (result.error) {

            console.error(
                "Supabase Delete Error:",
                result.error
            );

            alert(
                "❌ Student could not be deleted.\n\n" +
                result.error.message
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
