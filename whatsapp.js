// =====================================
// AI SCHOOL
// WhatsApp Parent Notification
// Absent Students Only
// =====================================

let students = [];


// =====================================
// PAGE LOAD
// =====================================

window.addEventListener("load", function () {

    loadAbsentStudents();

});


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
                    "absent"
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

function sendWhatsApp() {

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
