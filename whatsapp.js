// =====================================
// AI SCHOOL
// WhatsApp Parent Notification
// Absent Students Only
// =====================================

let students = [];
let allAbsentStudents = [];

// =====================================
// PAGE LOAD
// =====================================
window.addEventListener("load", function () {

    loadAbsentStudents();
    loadClasses();

});
// =====================================
// LOAD CLASSES
// =====================================

async function loadClasses() {

    const classSelect =
        document.getElementById("classSelect");

    if (!classSelect) return;

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("students")
                .select("class_name");

        if (error) {

            console.error(
                "❌ Class Loading Error:",
                error
            );

            classSelect.innerHTML = `
                <option value="">
                    Unable to load classes
                </option>
            `;

            return;

        }

        const classes = [
            ...new Set(
                (data || [])
                    .map(student => student.class_name)
                    .filter(Boolean)
            )
        ].sort();

        classSelect.innerHTML = `
            <option value="">
                Select Class
            </option>
        `;

        classes.forEach(function (className) {

            classSelect.innerHTML += `
                <option value="${className}">
                    ${className}
                </option>
            `;

        });

        console.log(
            "🏫 Classes Loaded:",
            classes
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
// LOAD TODAY'S ABSENT STUDENTS
// =====================================

async function loadAbsentStudents() {

    const select =
        document.getElementById("studentSelect");

    if (!select) return;


    if (
        typeof supabaseClient === "undefined"
    ) {

        console.error(
            "❌ Supabase client not available."
        );

        return;

    }


    select.innerHTML = `
        <option value="">
            Loading absent students...
        </option>
    `;


    // =================================
    // TODAY
    // =================================

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    console.log(
        "📅 WhatsApp Attendance Date:",
        today
    );


    try {

        // =================================
        // GET TODAY'S ABSENT ATTENDANCE
        // =================================

        const {
            data: attendance,
            error: attendanceError
        } =
            await supabaseClient
                .from("attendance")
                .select(
                    "student_id,student_name,status,attendance_date"
                )
                .eq(
                    "attendance_date",
                    today
                )
                .eq(
                    "status",
                    "Absent"
                );


        if (attendanceError) {

            console.error(
                "❌ Attendance Error:",
                attendanceError
            );

            select.innerHTML = `
                <option value="">
                    Unable to load absent students
                </option>
            `;

            return;

        }


        // =================================
        // NO ABSENT STUDENTS
        // =================================

        if (
            !attendance ||
            attendance.length === 0
        ) {

            select.innerHTML = `
                <option value="">
                    No absent students today
                </option>
            `;

            console.log(
                "✅ No absent students today."
            );

            return;

        }


        // =================================
        // GET STUDENT IDs
        // =================================

        const studentIds =
            attendance
                .map(
                    record =>
                        record.student_id
                )
                .filter(Boolean);


        if (studentIds.length === 0) {

            select.innerHTML = `
                <option value="">
                    No student information found
                </option>
            `;

            return;

        }


        // =================================
        // GET STUDENT DETAILS
        // =================================

        const {
            data: studentData,
            error: studentError
        } =
            await supabaseClient
                .from("students")
                .select(
                    "id,name,parentName,parentPhone,schoolName,class_name"
                )
                .in(
                    "id",
                    studentIds
                );


        if (studentError) {

            console.error(
                "❌ Student Query Error:",
                studentError
            );

            select.innerHTML = `
                <option value="">
                    Unable to load student details
                </option>
            `;

            return;

        }


        students =
            studentData || [];
allAbsentStudents =
    studentData || [];

        // =================================
        // BUILD DROPDOWN
        // =================================

        select.innerHTML = `
            <option value="">
                Select Absent Student
            </option>
        `;


        students.forEach(
            function (student) {

                select.innerHTML += `

                    <option value="${student.id}">

                        ${student.name || "Unknown"}
                        -
                        ${student.class_name || ""}

                    </option>

                `;

            }
        );


        console.log(
            "📱 Absent Students Loaded:",
            students
        );

    }
    catch (error) {

        console.error(
            "❌ Unexpected WhatsApp Error:",
            error
        );

        select.innerHTML = `
            <option value="">
                Unable to load absent students
            </option>
        `;

    }

}


// =====================================
// LOAD SELECTED STUDENT DETAILS
// =====================================

function loadStudentPhone() {

    const select =
        document.getElementById(
            "studentSelect"
        );

    const phoneInput =
        document.getElementById(
            "parentNumber"
        );

    const messageBox =
        document.getElementById(
            "message"
        );

    const previewName =
        document.getElementById(
            "previewStudentName"
        );

    const previewClass =
        document.getElementById(
            "previewClass"
        );

    const previewPhone =
        document.getElementById(
            "previewPhone"
        );


    if (!select) return;


    const student =
        students.find(
            s =>
                String(s.id) ===
                String(select.value)
        );


    if (!student) {

        if (phoneInput)
            phoneInput.value = "";

        if (messageBox)
            messageBox.value = "";

        return;

    }


    // =================================
    // PARENT WHATSAPP NUMBER
    // =================================

    if (phoneInput) {

        phoneInput.value =
            student.parentPhone || "";

    }


    // =================================
    // UPDATE STUDENT DETAILS
    // =================================

    if (previewName) {

        previewName.innerText =
            student.name || "-";

    }


    if (previewClass) {

        previewClass.innerText =
            student.class_name || "-";

    }


    if (previewPhone) {

        previewPhone.innerText =
            student.parentPhone || "-";

    }


    // =================================
    // ABSENT MESSAGE
    // =================================

    if (messageBox) {

        messageBox.value =

`Dear Parent,

This is a notification from ${student.schoolName || "School"}.

Student Name: ${student.name || ""}
Class: ${student.class_name || ""}

Your child was marked ABSENT today.

Please contact me if necessary.

Thank you.`;

    }

}


// =====================================
// SEND WHATSAPP
// =====================================

async function sendWhatsApp() {

    const number =
        document
            .getElementById(
                "parentNumber"
            )
            .value
            .trim();


    const message =
        document
            .getElementById(
                "message"
            )
            .value
            .trim();


    // =================================
    // VALIDATION
    // =================================

    if (number === "") {

        alert(
            "Please select an absent student."
        );

        return;

    }


    if (message === "") {

        alert(
            "Please enter message."
        );

        return;

    }


    // =================================
    // CLEAN PHONE NUMBER
    // =================================

    let phone =
        number.replace(
            /\D/g,
            ""
        );


    // =================================
    // SRI LANKAN NUMBER
    // 0771234567
    // ↓
    // 94771234567
    // =================================

    if (
        phone.length === 10 &&
        phone.startsWith("0")
    ) {

        phone =
            "94" +
            phone.substring(1);

    }


    // =================================
    // VALIDATE NUMBER
    // =================================

    if (
        phone.length < 11
    ) {

        alert(
            "Please enter a valid WhatsApp number."
        );

        return;

    }

// =================================
// SAVE WHATSAPP MESSAGE STATUS
// =================================

const selectedStudent =
    document.getElementById("studentSelect").value;

if (!selectedStudent) {

    alert("Please select an absent student.");

    return;

}


const {
    error: messageError
} = await supabaseClient
    .from("whatsapp_messages")
    .insert({

        student_id: selectedStudent,

        attendance_date:
            new Date()
                .toISOString()
                .split("T")[0],

        sent: true,

        sent_at:
            new Date().toISOString()

    });


if (messageError) {

    console.error(
        "❌ WhatsApp Tracking Error:",
        messageError
    );

}
  else {
    alert("✅ WhatsApp message status saved successfully!");

    // Refresh WhatsApp status table
    await loadWhatsAppStatus();
  }
    // =================================
    // OPEN WHATSAPP
    // =================================

    const whatsappURL =
        "whatsapp://send?phone=" +
        phone +
        "&text=" +
        encodeURIComponent(
            message
        );


    window.location.href =
        whatsappURL;

}
// =====================================
// FILTER ABSENT STUDENTS BY CLASS
// =====================================

function filterStudentsByClass() {

    const classSelect =
        document.getElementById("classSelect");

    const studentSelect =
        document.getElementById("studentSelect");

    if (!classSelect || !studentSelect) return;


    const selectedClass =
        classSelect.value;


    // No class selected
    if (selectedClass === "") {

        studentSelect.innerHTML = `
            <option value="">
                Select Absent Student
            </option>
        `;

        return;

    }


    // Filter today's absent students
    const filteredStudents =
        allAbsentStudents.filter(
            student =>
                student.class_name ===
                selectedClass
        );


    // No absent students in this class
    if (filteredStudents.length === 0) {

        studentSelect.innerHTML = `
            <option value="">
                No absent students in this class
            </option>
        `;

        return;

    }


    // Update global students
    students =
        filteredStudents;


    // Build student dropdown
    studentSelect.innerHTML = `
        <option value="">
            Select Absent Student
        </option>
    `;


    filteredStudents.forEach(
        function (student) {

            studentSelect.innerHTML += `

                <option value="${student.id}">

                    ${student.name || "Unknown"}

                </option>

            `;

        }
    );


    console.log(
        "🏫 Selected Class:",
        selectedClass
    );

    console.log(
        "❌ Absent Students:",
        filteredStudents
    );
loadWhatsAppStatus();
}
// =====================================
// LOAD WHATSAPP MESSAGE STATUS
// =====================================

async function loadWhatsAppStatus() {

    const classSelect =
        document.getElementById("classSelect");

    const tableContainer =
        document.getElementById(
            "whatsappStatusTable"
        );

    if (!classSelect || !tableContainer)
        return;


    const selectedClass =
        classSelect.value;


    if (!selectedClass) {

        tableContainer.innerHTML = `
            <p>
                Select a class to view message status.
            </p>
        `;

        return;

    }


    tableContainer.innerHTML = `
        <p>
            Loading message status...
        </p>
    `;


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    try {

        // =================================
        // GET ABSENT STUDENTS IN CLASS
        // =================================

        const classStudents =
            allAbsentStudents.filter(
                student =>
                    student.class_name ===
                    selectedClass
            );


        if (classStudents.length === 0) {

            tableContainer.innerHTML = `
                <p>
                    No absent students in this class.
                </p>
            `;

            return;

        }


        const studentIds =
            classStudents.map(
                student =>
                    String(student.id)
            );


        // =================================
        // GET WHATSAPP STATUS
        // =================================

        const {
            data: messages,
            error
        } =
            await supabaseClient
                .from("whatsapp_messages")
                .select(
                    "student_id,attendance_date,sent,sent_at"
                )
                .eq(
                    "attendance_date",
                    today
                )
                .in(
                    "student_id",
                    studentIds
                );


        if (error) {

            console.error(
                "❌ WhatsApp Status Error:",
                error
            );

            tableContainer.innerHTML = `
                <p>
                    Unable to load message status.
                </p>
            `;

            return;

        }


        // =================================
        // BUILD TABLE
        // =================================

        let html = `

            <table class="whatsapp-status-table">

                <thead>

                    <tr>

                        <th>
                            Student
                        </th>

                        <th>
                            Class
                        </th>

                        <th>
                            WhatsApp
                        </th>

                        <th>
                            Time
                        </th>

                    </tr>

                </thead>

                <tbody>

        `;


        classStudents.forEach(
            function (student) {

                const record =
                    (messages || []).find(
                        message =>
                            String(
                                message.student_id
                            ) ===
                            String(
                                student.id
                            )
                    );


                const sent =
                    record &&
                    record.sent === true;


                const status =
    sent
        ? `<span class="whatsapp-status sent">
            ✅ Sent
           </span>`
        : `<span class="whatsapp-status pending">
            ⏳ Pending
           </span>`;

                const sentTime =
                    sent &&
                    record.sent_at
                        ? new Date(
                            record.sent_at
                        ).toLocaleTimeString()
                        : "-";


                html += `

                    <tr>

                        <td>
                            ${student.name || "-"}
                        </td>

                        <td>
                            ${student.class_name || "-"}
                        </td>

                        <td>
                            ${status}
                        </td>

                        <td>
                            ${sentTime}
                        </td>

                    </tr>

                `;

            }
        );


        html += `

                </tbody>

            </table>

        `;


        tableContainer.innerHTML =
            html;


        console.log(
            "📋 WhatsApp Status Loaded:",
            messages
        );

    }
    catch (error) {

        console.error(
            "❌ Unexpected WhatsApp Status Error:",
            error
        );

        tableContainer.innerHTML = `
            <p>
                Unable to load message status.
            </p>
        `;

    }

}