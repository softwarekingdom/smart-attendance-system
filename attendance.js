/// =====================================
// AI SCHOOL
// Attendance System
// Supabase Version 1.0
// PART 1
// Class + Student Loading
// =====================================


// =====================================
// PAGE LOAD
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadTeacherClasses();

    }
);


// =====================================
// CHECK SUPABASE
// =====================================

function checkSupabase() {

    if (
        typeof supabaseClient === "undefined"
    ) {

        console.error(
            "❌ supabaseClient is not defined."
        );

        return false;
    }

    return true;
}


// =====================================
// LOAD TEACHER CLASSES
// =====================================

async function loadTeacherClasses() {

    const classSelect =
        document.getElementById(
            "attendanceClass"
        );

    if (!classSelect) {

        console.error(
            "❌ attendanceClass element not found."
        );

        return;
    }


    classSelect.innerHTML = `
        <option value="">
            Loading Classes...
        </option>
    `;


    // =================================
    // CHECK SUPABASE
    // =================================

    if (!checkSupabase()) {

        classSelect.innerHTML = `
            <option value="">
                ❌ Supabase Error
            </option>
        `;

        return;
    }


    // =================================
    // GET CURRENT TEACHER
    // =================================

    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );


    if (!currentUser) {

        classSelect.innerHTML = `
            <option value="">
                ❌ Teacher Not Logged In
            </option>
        `;

        return;
    }


    const username =
        currentUser.username;


    if (!username) {

        classSelect.innerHTML = `
            <option value="">
                ❌ Username Not Found
            </option>
        `;

        return;
    }


    try {

        // =================================
        // GET TEACHER
        // =================================

        const {
            data: teacher,
            error
        } =
            await supabaseClient
                .from("teachers")
                .select(
                    "id,name,username,classes"
                )
                .eq(
                    "username",
                    username
                )
                .maybeSingle();


        // =================================
        // ERROR
        // =================================

        if (error) {

            console.error(
                "Teacher Load Error:",
                error
            );

            classSelect.innerHTML = `
                <option value="">
                    ❌ Unable to Load Classes
                </option>
            `;

            return;
        }


        // =================================
        // TEACHER NOT FOUND
        // =================================

        if (!teacher) {

            classSelect.innerHTML = `
                <option value="">
                    ❌ Teacher Not Found
                </option>
            `;

            return;
        }


        // =================================
        // GET CLASSES
        // =================================

        const classes =
            Array.isArray(
                teacher.classes
            )
                ? teacher.classes
                : [];


        // =================================
        // NO CLASSES
        // =================================

        if (classes.length === 0) {

            classSelect.innerHTML = `
                <option value="">
                    No Assigned Classes
                </option>
            `;

            return;
        }


        // =================================
        // CLEAR SELECT
        // =================================

        classSelect.innerHTML = `
            <option value="">
                -- Select Class --
            </option>
        `;


        // =================================
        // ADD CLASSES
        // =================================

        classes.forEach(
            function (className) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    className;

                option.textContent =
                    className;

                classSelect.appendChild(
                    option
                );

            }
        );


        console.log(
            "✅ Teacher Classes:",
            classes
        );

    }
    catch (error) {

        console.error(
            "Unexpected Class Error:",
            error
        );

        classSelect.innerHTML = `
            <option value="">
                ❌ Something Went Wrong
            </option>
        `;

    }

}


// =====================================
// LOAD STUDENTS
// =====================================

async function loadAttendanceStudents() {

    const classSelect =
        document.getElementById(
            "attendanceClass"
        );

    const list =
        document.getElementById(
            "attendanceList"
        );


    if (!classSelect || !list) {

        return;
    }


    const selectedClass =
        classSelect.value.trim();


    // =================================
    // NO CLASS SELECTED
    // =================================

    if (!selectedClass) {

        list.innerHTML = `
            <tr>
                <td
                    colspan="4"
                    class="empty-message">

                    Select a class to load students.

                </td>
            </tr>
        `;

        return;
    }


    list.innerHTML = `
        <tr>
            <td
                colspan="4"
                class="empty-message">

                Loading students...

            </td>
        </tr>
    `;


    // =================================
    // CHECK SUPABASE
    // =================================

    if (!checkSupabase()) {

        list.innerHTML = `
            <tr>
                <td
                    colspan="4"
                    class="empty-message">

                    ❌ Supabase connection error.

                </td>
            </tr>
        `;

        return;
    }


    try {

        // =================================
        // GET STUDENTS
        // =================================

        const {
            data: students,
            error
        } =
            await supabaseClient
                .from("students")
                .select(`
                    id,
                    name,
                    class_name
                `)
                .eq(
                    "class_name",
                    selectedClass
                )
                .order(
                    "name",
                    {
                        ascending: true
                    }
                );


        // =================================
        // ERROR
        // =================================

        if (error) {

            console.error(
                "Student Load Error:",
                error
            );

            list.innerHTML = `
                <tr>
                    <td
                        colspan="4"
                        class="empty-message">

                        ❌ ${escapeHTML(
                            error.message
                        )}

                    </td>
                </tr>
            `;

            return;
        }


        // =================================
        // NO STUDENTS
        // =================================

        if (
            !students ||
            students.length === 0
        ) {

            list.innerHTML = `
                <tr>
                    <td
                        colspan="4"
                        class="empty-message">

                        👨‍🎓 No students found
                        in this class.

                    </td>
                </tr>
            `;

            return;
        }


        // =================================
        // DISPLAY STUDENTS
        // =================================

        list.innerHTML = "";


        students.forEach(
            function (student, index) {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${escapeHTML(
                            student.name
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            student.class_name
                        )}
                    </td>

                    <td>

                        <select
                            class="attendance-status"
                            data-student-id="${student.id}"
                        >

                            <option value="Present">
                                ✅ Present
                            </option>

                            <option value="Absent">
                                ❌ Absent
                            </option>

                        </select>

                    </td>

                `;


                list.appendChild(
                    row
                );

            }
        );


        console.log(
            "✅ Students Loaded:",
            students.length
        );

    }
    catch (error) {

        console.error(
            "Unexpected Student Error:",
            error
        );

        list.innerHTML = `
            <tr>
                <td
                    colspan="4"
                    class="empty-message">

                    ❌ Unable to load students.

                </td>
            </tr>
        `;

    }

}


// =====================================
// SAVE ATTENDANCE
// =====================================

async function saveAttendance() {

    alert(
        "Part 1 completed successfully.\n\n" +
        "Attendance Save will be added in Part 2."
    );

}


// =====================================
// HTML SECURITY
// =====================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";
    }


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
// =====================================
// PART 2
// SAVE ATTENDANCE TO SUPABASE
// =====================================

async function saveAttendance() {

    const classSelect =
        document.getElementById(
            "attendanceClass"
        );

    const list =
        document.getElementById(
            "attendanceList"
        );


    if (!classSelect || !list) {

        alert(
            "❌ Attendance elements not found."
        );

        return;
    }


    const selectedClass =
        classSelect.value.trim();


    if (!selectedClass) {

        alert(
            "⚠️ Please select a class first."
        );

        return;
    }


    // =================================
    // GET CURRENT TEACHER
    // =================================

    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );


    if (!currentUser) {

        alert(
            "❌ Teacher is not logged in."
        );

        return;
    }


    // =================================
    // GET ATTENDANCE STATUS
    // =================================

    const statusElements =
        document.querySelectorAll(
            ".attendance-status"
        );


    if (
        !statusElements ||
        statusElements.length === 0
    ) {

        alert(
            "⚠️ No students found."
        );

        return;
    }


    // =================================
    // PREPARE DATA
    // =================================

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const attendanceData = [];


    statusElements.forEach(
        function (select) {

            const studentId =
                select.dataset.studentId;


            const row =
                select.closest("tr");


            const studentName =
                row.children[1]
                    ?.innerText
                    ?.trim();


            const status =
                select.value;


            attendanceData.push({

                student_id:
                    studentId,

                student_name:
                    studentName || "",

                class_name:
                    selectedClass,

                teacher_id:
                    currentUser.id || null,

                teacher_username:
                    currentUser.username || "",

                attendance_date:
                    today,

                status:
                    status

            });

        }
    );


    if (
        attendanceData.length === 0
    ) {

        alert(
            "⚠️ No attendance data found."
        );

        return;
    }


    // =================================
    // CHECK SUPABASE
    // =================================

    if (!checkSupabase()) {

        alert(
            "❌ Supabase connection not found."
        );

        return;
    }


    // =================================
    // CONFIRM
    // =================================

    const confirmed =
        confirm(
            "Save attendance for " +
            selectedClass +
            "?"
        );


    if (!confirmed) {

        return;
    }


    try {

        // =================================
        // UPSERT ATTENDANCE
        // =================================

        const {
            data,
            error
        } =
            await supabaseClient
                .from("attendance")
                .upsert(
                    attendanceData,
                    {
                        onConflict:
                            "student_id,attendance_date"
                    }
                )
                .select();


        // =================================
        // ERROR
        // =================================

        if (error) {

            console.error(
                "Attendance Save Error:",
                error
            );


            alert(
                "❌ Attendance could not be saved.\n\n" +
                error.message
            );

            return;
        }


        // =================================
        // SUCCESS
        // =================================

        console.log(
            "Saved Attendance:",
            data
        );


        alert(
            "✅ Attendance Saved Successfully!"
        );


    }
    catch (error) {

        console.error(
            "Unexpected Attendance Error:",
            error
        );


        alert(
            "❌ Something went wrong.\n\n" +
            error.message
        );

    }

}
