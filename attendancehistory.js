// // =====================================
// AI SCHOOL
// Attendance History System
// Supabase Version 2.0
// =====================================

// =====================================
// PAGE LOAD
// =====================================

window.addEventListener(
"load",
async function () {

    await loadHistoryClasses();

    await loadHistory();

}

);

// =====================================
// CHECK SUPABASE
// =====================================

function checkSupabase() {

if (
    typeof supabaseClient ===
    "undefined" ||
    !supabaseClient
) {

    console.error(
        "❌ supabaseClient is not defined."
    );

    return false;

}

return true;

}

// =====================================
// LOAD CLASSES
// =====================================

async function loadHistoryClasses() {

const select =
    document.getElementById(
        "historyClass"
    );


if (!select) {

    return;

}


if (!checkSupabase()) {

    return;

}


try {

    // Get students because
    // class information is stored
    // with the student.

    const {
        data: students,
        error
    } =
        await supabaseClient
            .from("students")
            .select("*");


    if (error) {

        console.error(
            "❌ Class Loading Error:",
            error
        );

        return;

    }


    const classNames =
        new Set();


    (students || []).forEach(
        function (student) {

            const className =
                student.class_name ||
                student.className ||
                student.class ||
                student.classname;


            if (
                className &&
                String(className).trim()
            ) {

                classNames.add(
                    String(
                        className
                    ).trim()
                );

            }

        }
    );


    select.innerHTML = `
        <option value="">
            All Classes
        </option>
    `;


    Array.from(classNames)
        .sort(
            function (a, b) {

                return a.localeCompare(b);

            }
        )
        .forEach(
            function (className) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    className;

                option.textContent =
                    className;

                select.appendChild(
                    option
                );

            }
        );

}
catch (error) {

    console.error(
        "❌ Unexpected Class Error:",
        error
    );

}

}

// =====================================
// LOAD ATTENDANCE HISTORY
// =====================================

async function loadHistory() {

const table =
    document.getElementById(
        "historyList"
    );


if (!table) {

    return;

}


table.innerHTML = `
    <tr>
        <td colspan="5">
            Loading attendance...
        </td>
    </tr>
`;


if (!checkSupabase()) {

    table.innerHTML = `
        <tr>
            <td colspan="5">
                ❌ Supabase connection error.
            </td>
        </tr>
    `;

    return;

}


const classSelect =
    document.getElementById(
        "historyClass"
    );


const dateInput =
    document.getElementById(
        "historyDate"
    );


const selectedClass =
    classSelect
        ? classSelect.value
        : "";


const selectedDate =
    dateInput
        ? dateInput.value
        : "";


try {

    // =================================
    // GET ATTENDANCE
    // =================================

    let attendanceQuery =
        supabaseClient
            .from("attendance")
            .select("*")
            .order(
                "attendance_date",
                {
                    ascending: false
                }
            );


    if (selectedDate !== "") {

        attendanceQuery =
            attendanceQuery.eq(
                "attendance_date",
                selectedDate
            );

    }


    const {
        data: attendance,
        error: attendanceError
    } =
        await attendanceQuery;


    if (attendanceError) {

        console.error(
            "❌ Attendance History Error:",
            attendanceError
        );

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    ❌ Unable to load attendance.
                </td>
            </tr>
        `;

        return;

    }


    const attendanceList =
        attendance || [];


    // =================================
    // GET STUDENTS
    // =================================

    const {
        data: students,
        error: studentError
    } =
        await supabaseClient
            .from("students")
            .select("*");


    if (studentError) {

        console.error(
            "❌ Student Loading Error:",
            studentError
        );

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    ❌ Unable to load students.
                </td>
            </tr>
        `;

        return;

    }


    const studentList =
        students || [];


    // =================================
    // STUDENT LOOKUP
    // =================================

    const studentMap =
        new Map();


    studentList.forEach(
        function (student) {

            studentMap.set(
                String(student.id),
                student
            );

        }
    );


    // =================================
    // RESET SUMMARY
    // =================================

    let present = 0;

    let absent = 0;

    let total = 0;


    let html = "";


    // =================================
    // PROCESS ATTENDANCE
    // =================================

    attendanceList.forEach(
        function (record) {

            const student =
                studentMap.get(
                    String(
                        record.student_id
                    )
                );


            // Skip orphan attendance
            // records if student no longer exists.

            if (!student) {

                return;

            }


            const className =
                student.class_name ||
                student.className ||
                student.class ||
                student.classname ||
                record.class_name ||
                record.className ||
                "";


            // Class filter

            if (
                selectedClass !== "" &&
                String(className) !==
                String(selectedClass)
            ) {

                return;

            }


            const studentName =
                student.name ||
                student.student_name ||
                student.studentName ||
                "Unknown Student";


            const status =
                String(
                    record.status || ""
                )
                .trim();


            const normalizedStatus =
                status.toLowerCase();


            total++;


            if (
                normalizedStatus ===
                "present"
            ) {

                present++;

            }
            else if (
                normalizedStatus ===
                "absent"
            ) {

                absent++;

            }


            // =================================
            // STATUS DISPLAY
            // =================================

            let statusHTML = "";

            if (
                normalizedStatus ===
                "present"
            ) {

                statusHTML =
                    `<span class="status-badge status-present">
                        ✅ Present
                    </span>`;

            }
            else if (
                normalizedStatus ===
                "absent"
            ) {

                statusHTML =
                    `<span class="status-badge status-absent">
                        ❌ Absent
                    </span>`;

            }
            else {

                statusHTML =
                    `<span class="status-badge status-other">
                        ${escapeHistoryHTML(status)}
                    </span>`;

            }


            // =================================
            // DATE
            // =================================

            const attendanceDate =
                record.attendance_date ||
                record.date ||
                "";


            // =================================
            // DELETE BUTTON
            // =================================

            const recordId =
                record.id;


            html += `
                <tr>

                    <td>
                        ${escapeHistoryHTML(
                            attendanceDate
                        )}
                    </td>

                    <td>
                        ${escapeHistoryHTML(
                            className
                        )}
                    </td>

                    <td>
                        ${escapeHistoryHTML(
                            studentName
                        )}
                    </td>

                    <td>
                        ${statusHTML}
                    </td>

                    <td>

                        <button
                            type="button"
                            onclick="deleteAttendance('${recordId}')"
                            title="Delete attendance"
                        >
                            🗑️
                        </button>

                    </td>

                </tr>
            `;

        }
    );


    // =================================
    // DISPLAY EMPTY STATE
    // =================================

    if (html === "") {

        html = `
            <tr>
                <td colspan="5">
                    No attendance records found.
                </td>
            </tr>
        `;

    }


    table.innerHTML =
        html;


    // =================================
    // UPDATE SUMMARY
    // =================================

    const presentBox =
        document.getElementById(
            "presentTotal"
        );


    const absentBox =
        document.getElementById(
            "absentTotal"
        );


    const totalBox =
        document.getElementById(
            "studentTotal"
        );


    if (presentBox) {

        presentBox.innerText =
            present;

    }


    if (absentBox) {

        absentBox.innerText =
            absent;

    }


    if (totalBox) {

        totalBox.innerText =
            total;

    }


    console.log(
        "📋 Attendance History:",
        attendanceList
    );

}
catch (error) {

    console.error(
        "❌ Attendance History Exception:",
        error
    );

    table.innerHTML = `
        <tr>
            <td colspan="5">
                ❌ Something went wrong.
            </td>
        </tr>
    `;

}

}

// =====================================
// DELETE ATTENDANCE
// =====================================

async function deleteAttendance(
attendanceId
) {

if (!attendanceId) {

    console.error(
        "❌ Attendance ID missing."
    );

    return;

}


const confirmed =
    confirm(
        "Delete this attendance record?"
    );


if (!confirmed) {

    return;

}


if (!checkSupabase()) {

    return;

}


try {

    console.log(
        "🗑️ Deleting attendance:",
        attendanceId
    );


    const {
        error
    } =
        await supabaseClient
            .from("attendance")
            .delete()
            .eq(
                "id",
                attendanceId
            );


    if (error) {

        console.error(
            "❌ Delete Attendance Error:",
            error
        );

        alert(
            "Unable to delete attendance."
        );

        return;

    }


    console.log(
        "✅ Attendance deleted."
    );


    await loadHistory();

}
catch (error) {

    console.error(
        "❌ Delete Exception:",
        error
    );

    alert(
        "Something went wrong while deleting."
    );

}

}

// =====================================
// CLEAR FILTERS
// =====================================

function clearFilters() {

const classSelect =
    document.getElementById(
        "historyClass"
    );


const dateInput =
    document.getElementById(
        "historyDate"
    );


if (classSelect) {

    classSelect.value = "";

}


if (dateInput) {

    dateInput.value = "";

}


loadHistory();

}

// =====================================
// HTML ESCAPE
// =====================================

function escapeHistoryHTML(
value
) {

return String(
    value ?? ""
)
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
