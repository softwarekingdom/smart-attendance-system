// =====================================
// AI SCHOOL
// WhatsApp Parent Notification
// =====================================

let students = [];

let allAbsentStudents = [];


// =====================================
// PAGE LOAD
// =====================================

window.addEventListener("load", function () {

    loadClasses();

    loadAbsentStudents();

});


// =====================================
// LOAD CLASSES
// =====================================

async function loadClasses() {

    const classSelect =
        document.getElementById("classSelect");


    if (!classSelect) {

        return;

    }


    classSelect.innerHTML = `
        <option value="">
            Loading classes...
        </option>
    `;


    try {

        const {
            data,
            error
        } = await supabaseClient
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


        // =================================
        // GET UNIQUE CLASSES
        // =================================

        const classes = [
            ...new Set(
                (data || [])
                    .map(function (student) {

                        return String(
                            student.class_name || ""
                        ).trim();

                    })
                    .filter(function (className) {

                        return className !== "";

                    })
            )
        ];


        console.log(
            "🏫 Classes Loaded:",
            classes
        );


        // =================================
        // NO CLASSES
        // =================================

        if (classes.length === 0) {

            classSelect.innerHTML = `
                <option value="">
                    No Classes Found
                </option>
            `;

            return;

        }


        // =================================
        // BUILD CLASS DROPDOWN
        // =================================

        classSelect.innerHTML = `
            <option value="">
                Select Class
            </option>
        `;


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

    }


    catch (error) {

        console.error(
            "❌ Unexpected Class Error:",
            error
        );


        classSelect.innerHTML = `
            <option value="">
                Unable to load classes
            </option>
        `;

    }

}
// =====================================
// LOAD TODAY'S ABSENT STUDENTS
// =====================================

async function loadAbsentStudents() {

    const studentSelect =
        document.getElementById(
            "studentSelect"
        );


    if (!studentSelect) {

        return;

    }


    studentSelect.innerHTML = `
        <option value="">
            Loading absent students...
        </option>
    `;


    try {

        // =================================
        // TODAY'S DATE
        // =================================

        const today =
            new Date()
                .toISOString()
                .split("T")[0];


        console.log(
            "📅 Attendance Date:",
            today
        );


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


        // =================================
        // ATTENDANCE ERROR
        // =================================

        if (attendanceError) {

            console.error(
                "❌ Attendance Error:",
                attendanceError
            );


            studentSelect.innerHTML = `
                <option value="">
                    Unable to load absent students
                </option>
            `;


            return;

        }


        console.log(
            "❌ Today's Absent Attendance:",
            attendance
        );


        // =================================
        // NO ABSENT STUDENTS
        // =================================

        if (
            !attendance ||
            attendance.length === 0
        ) {

            studentSelect.innerHTML = `
                <option value="">
                    No absent students today
                </option>
            `;


            return;

        }


        // =================================
        // GET STUDENT IDs
        // =================================

        const studentIds =
            attendance
                .map(function (record) {

                    return record.student_id;

                })
                .filter(function (id) {

                    return id !== null &&
                           id !== undefined;

                });


        if (studentIds.length === 0) {

            studentSelect.innerHTML = `
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
                    "id,name,parentPhone,schoolName,class_name"
                )
                .in(
                    "id",
                    studentIds
                );


        // =================================
        // STUDENT ERROR
        // =================================

        if (studentError) {

            console.error(
                "❌ Student Query Error:",
                studentError
            );


            studentSelect.innerHTML = `
                <option value="">
                    Unable to load student details
                </option>
            `;


            return;

        }


        // =================================
        // SAVE STUDENTS
        // =================================

        students =
            studentData || [];


        allAbsentStudents =
            studentData || [];


        // =================================
        // NO STUDENT DETAILS
        // =================================

        if (students.length === 0) {

            studentSelect.innerHTML = `
                <option value="">
                    No absent students found
                </option>
            `;


            return;

        }


        // =================================
        // BUILD STUDENT DROPDOWN
        // =================================

        studentSelect.innerHTML = `
            <option value="">
                Select Absent Student
            </option>
        `;


        students.forEach(
            function (student) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    student.id;


                option.textContent =
                    (
                        student.name ||
                        "Unknown"
                    ) +
                    " - " +
                    (
                        student.class_name ||
                        ""
                    );


                studentSelect.appendChild(
                    option
                );

            }
        );


        console.log(
            "📱 Absent Students Loaded:",
            students
        );

    }


    catch (error) {

        console.error(
            "❌ Unexpected Absent Student Error:",
            error
        );


        studentSelect.innerHTML = `
            <option value="">
                Unable to load absent students
            </option>
        `;

    }

}
// =====================================
// FILTER ABSENT STUDENTS BY CLASS
// =====================================

function filterStudentsByClass() {

    const classSelect =
        document.getElementById(
            "classSelect"
        );


    const studentSelect =
        document.getElementById(
            "studentSelect"
        );


    if (
        !classSelect ||
        !studentSelect
    ) {

        return;

    }


    const selectedClass =
        classSelect.value;


    // =================================
    // NO CLASS SELECTED
    // =================================

    if (selectedClass === "") {

        studentSelect.innerHTML = `
            <option value="">
                Select Absent Student
            </option>
        `;

        students =
            allAbsentStudents;

        return;

    }


    // =================================
    // FILTER STUDENTS
    // =================================

    const filteredStudents =
        allAbsentStudents.filter(
            function (student) {

                return (
                    student.class_name ===
                    selectedClass
                );

            }
        );


    // =================================
    // NO ABSENT STUDENTS
    // =================================

    if (
        filteredStudents.length === 0
    ) {

        studentSelect.innerHTML = `
            <option value="">
                No absent students in this class
            </option>
        `;

        return;

    }


    // =================================
    // UPDATE CURRENT STUDENTS
    // =================================

    students =
        filteredStudents;


    // =================================
    // BUILD DROPDOWN
    // =================================

    studentSelect.innerHTML = `
        <option value="">
            Select Absent Student
        </option>
    `;


    filteredStudents.forEach(
        function (student) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                student.id;


            option.textContent =
                student.name || "Unknown";


            studentSelect.appendChild(
                option
            );

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


    // Refresh WhatsApp status
    loadWhatsAppStatus();

}


// =====================================
// LOAD SELECTED STUDENT DETAILS
// =====================================

function loadStudentPhone() {

    const studentSelect =
        document.getElementById(
            "studentSelect"
        );


    if (!studentSelect) {

        return;

    }


    const selectedId =
        studentSelect.value;


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


    // =================================
    // NOTHING SELECTED
    // =================================

    if (!selectedId) {

        if (phoneInput)
            phoneInput.value = "";


        if (messageBox)
            messageBox.value = "";


        if (previewName)
            previewName.textContent = "-";


        if (previewClass)
            previewClass.textContent = "-";


        if (previewPhone)
            previewPhone.textContent = "-";


        return;

    }


    // =================================
    // FIND STUDENT
    // =================================

    const student =
        students.find(
            function (item) {

                return String(item.id) ===
                    String(selectedId);

            }
        );


    if (!student) {

        return;

    }


    // =================================
    // PHONE
    // =================================

    if (phoneInput) {

        phoneInput.value =
            student.parentPhone || "";

    }


    // =================================
    // STUDENT NAME
    // =================================

    if (previewName) {

        previewName.textContent =
            student.name || "-";

    }


    // =================================
    // CLASS
    // =================================

    if (previewClass) {

        previewClass.textContent =
            student.class_name || "-";

    }


    // =================================
    // PARENT PHONE
    // =================================

    if (previewPhone) {

        previewPhone.textContent =
            student.parentPhone || "-";

    }


    // =================================
    // MESSAGE
    // =================================

    if (messageBox) {

        const today =
            new Date();


        const todayDate =
            today.toLocaleDateString(
                "en-GB",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                }
            );


        messageBox.value =
`Dear Parent,

${student.name || "[Student Name]"} was absent from today’s English class (${todayDate}). Please let me know the reason for missing class.

Thank you,
${student.schoolName || "[School name]"}`;

    }

}
 // =====================================
// SEND WHATSAPP
// =====================================

async function sendWhatsApp() {

    const studentSelect =
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


    if (
        !studentSelect ||
        !phoneInput ||
        !messageBox
    ) {

        return;

    }


    // =================================
    // SELECTED STUDENT
    // =================================

    const studentId =
        studentSelect.value;


    if (!studentId) {

        alert(
            "Please select an absent student."
        );

        return;

    }


    // =================================
    // PHONE
    // =================================

    const number =
        phoneInput.value.trim();


    if (number === "") {

        alert(
            "Parent WhatsApp number is missing."
        );

        return;

    }


    // =================================
    // MESSAGE
    // =================================

    const message =
        messageBox.value.trim();


    if (message === "") {

        alert(
            "Please enter a message."
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
    // 0761234567
    // ↓
    // 94761234567
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
    // PHONE VALIDATION
    // =================================

    if (
        phone.length < 11
    ) {

        alert(
            "Please enter a valid WhatsApp number."
        );

        return;

    }


    try {

        // =================================
        // GET TODAY
        // =================================

        const today =
            new Date()
                .toISOString()
                .split("T")[0];


        // =================================
        // SAVE MESSAGE STATUS
        // =================================

        const {
            error
        } =
            await supabaseClient
                .from("whatsapp_messages")
                .insert({

                    student_id:
                        studentId,

                    attendance_date:
                        today,

                    sent:
                        true,

                    sent_at:
                        new Date().toISOString()

                });


        if (error) {

            console.error(
                "❌ WhatsApp Status Error:",
                error
            );

            alert(
                "❌ Unable to save WhatsApp status.\n\n" +
                error.message
            );

            return;

        }


        console.log(
            "✅ WhatsApp status saved."
        );


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


    catch (error) {

        console.error(
            "❌ WhatsApp Error:",
            error
        );


        alert(
            "❌ Something went wrong while sending WhatsApp message."
        );

    }

}
// =====================================
// LOAD WHATSAPP MESSAGE STATUS
// =====================================

async function loadWhatsAppStatus() {

    const classSelect =
        document.getElementById(
            "classSelect"
        );

    const tableContainer =
        document.getElementById(
            "whatsappStatusTable"
        );


    if (
        !classSelect ||
        !tableContainer
    ) {

        return;

    }


    const selectedClass =
        classSelect.value;


    // =================================
    // NO CLASS
    // =================================

    if (selectedClass === "") {

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


    try {

        // =================================
        // TODAY
        // =================================

        const today =
            new Date()
                .toISOString()
                .split("T")[0];


        // =================================
        // STUDENTS IN SELECTED CLASS
        // =================================

        const classStudents =
            allAbsentStudents.filter(
                function (student) {

                    return (
                        student.class_name ===
                        selectedClass
                    );

                }
            );


        if (
            classStudents.length === 0
        ) {

            tableContainer.innerHTML = `
                <p>
                    No absent students in this class.
                </p>
            `;

            return;

        }


        // =================================
        // STUDENT IDs
        // =================================

        const studentIds =
            classStudents.map(
                function (student) {

                    return student.id;

                }
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
        // TABLE
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
                        function (message) {

                            return (
                                String(
                                    message.student_id
                                ) ===
                                String(
                                    student.id
                                )
                            );

                        }
                    );


                // =================================
                // STATUS
                // =================================

                const sent =
                    record &&
                    record.sent === true;


                const status =
                    sent
                        ? `
                            <span class="whatsapp-status sent">
                                ✅ Sent
                            </span>
                          `
                        : `
                            <span class="whatsapp-status pending">
                                ⏳ Pending
                            </span>
                          `;


                // =================================
                // TIME
                // =================================

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
            "❌ Unexpected Status Error:",
            error
        );


        tableContainer.innerHTML = `
            <p>
                Unable to load message status.
            </p>
        `;

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


// =====================================
// PAGE LOAD
// =====================================

