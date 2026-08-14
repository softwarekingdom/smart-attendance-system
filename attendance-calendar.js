"use strict";

/* =========================================================
   ATTENDANCE CALENDAR
   Supabase based
   No LocalStorage
========================================================= */

let currentDate = new Date();

let attendanceRecords = [];
let students = [];
let studentMap = new Map();

/* =========================================================
   DOM ELEMENTS
========================================================= */

const calendarDays = document.getElementById("calendarDays");
const currentMonthElement = document.getElementById("currentMonth");

const prevMonthButton = document.getElementById("prevMonth");
const nextMonthButton = document.getElementById("nextMonth");

const popup = document.getElementById("attendancePopup");
const popupContent = document.getElementById("popupContent");
const closePopupButton = document.getElementById("closePopup");

/* =========================================================
   INITIALIZE
========================================================= */

window.addEventListener("load", function () {

    console.log("📅 Attendance Calendar starting...");

    setupCalendarEvents();

    /*
       Render immediately.
       This means the calendar will still show dates
       even if Supabase takes time or fails.
    */
    renderCalendar();

    /*
       Then load real attendance data.
    */
    loadCalendarData();

});

/* =========================================================
   EVENTS
========================================================= */

function setupCalendarEvents() {

    if (prevMonthButton) {

        prevMonthButton.addEventListener("click", function () {

            currentDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() - 1,
                1
            );

            renderCalendar();

        });

    }


    if (nextMonthButton) {

        nextMonthButton.addEventListener("click", function () {

            currentDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                1
            );

            renderCalendar();

        });

    }


    if (closePopupButton) {

        closePopupButton.addEventListener(
            "click",
            closeAttendancePopup
        );

    }


    if (popup) {

        popup.addEventListener("click", function (event) {

            if (event.target === popup) {

                closeAttendancePopup();

            }

        });

    }


    window.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            closeAttendancePopup();

        }

    });

}


/* =========================================================
   LOAD SUPABASE DATA
========================================================= */

async function loadCalendarData() {

    if (
        typeof supabaseClient === "undefined" ||
        !supabaseClient
    ) {

        console.error(
            "❌ supabaseClient is not available."
        );

        renderCalendar();

        return;

    }


    try {

        showCalendarLoading();


        /* =====================================================
           LOAD STUDENTS
        ===================================================== */

        const {
            data: studentData,
            error: studentError
        } = await supabaseClient
            .from("students")
            .select("*");


        if (studentError) {

            throw studentError;

        }


        students = studentData || [];

        studentMap = new Map();


        students.forEach(function (student) {

            if (
                student &&
                student.id !== undefined &&
                student.id !== null
            ) {

                studentMap.set(
                    String(student.id),
                    student
                );

            }

        });


        /* =====================================================
           LOAD ATTENDANCE
        ===================================================== */

        const {
            data: attendanceData,
            error: attendanceError
        } = await supabaseClient
            .from("attendance")
            .select("*")
            .order(
                "attendance_date",
                {
                    ascending: true
                }
            );


        if (attendanceError) {

            throw attendanceError;

        }


        attendanceRecords =
            attendanceData || [];


        console.log(
            "✅ Students:",
            students.length
        );

        console.log(
            "✅ Attendance:",
            attendanceRecords.length
        );


        renderCalendar();


    }
    catch (error) {

        console.error(
            "❌ Calendar Supabase error:",
            error
        );


        attendanceRecords = [];


        /*
           Important:
           Calendar dates should still display.
        */

        renderCalendar();

    }

} 
/* =========================================================
   RENDER CALENDAR
========================================================= */

function renderCalendar() {

    if (!calendarDays) {

        console.error(
            "❌ #calendarDays not found."
        );

        return;

    }


    calendarDays.innerHTML = "";


    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();


    /* =====================================================
       MONTH TITLE
    ===================================================== */

    if (currentMonthElement) {

        currentMonthElement.textContent =
            new Intl.DateTimeFormat(
                "en-US",
                {
                    month: "long",
                    year: "numeric"
                }
            ).format(currentDate);

    }


    /* =====================================================
       MONTH INFORMATION
    ===================================================== */

    const firstDay =
        new Date(
            year,
            month,
            1
        );


    const lastDay =
        new Date(
            year,
            month + 1,
            0
        );


    const firstWeekday =
        firstDay.getDay();

    const totalDays =
        lastDay.getDate();


    /* =====================================================
       EMPTY DAYS BEFORE FIRST DATE
    ===================================================== */

    for (
        let i = 0;
        i < firstWeekday;
        i++
    ) {

        const emptyDay =
            document.createElement("div");


        emptyDay.className =
            "calendar-day empty-day";


        calendarDays.appendChild(
            emptyDay
        );

    }


    /* =====================================================
       CREATE EACH DATE
    ===================================================== */

    for (
        let day = 1;
        day <= totalDays;
        day++
    ) {

        const date =
            new Date(
                year,
                month,
                day
            );


        const dateString =
            formatDate(date);


        const dayElement =
            document.createElement("div");


        dayElement.className =
            "calendar-day";


        dayElement.dataset.date =
            dateString;


        /* =================================================
           DATE NUMBER
        ================================================= */

        const dateNumber =
            document.createElement("div");


        dateNumber.className =
            "calendar-date-number";


        dateNumber.textContent =
            day;


        dayElement.appendChild(
            dateNumber
        );


        /* =================================================
           TODAY
        ================================================= */

        const today =
            new Date();


        if (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
        ) {

            dayElement.classList.add(
                "today"
            );

        }


        /* =================================================
           ATTENDANCE STATISTICS
        ================================================= */

        const stats =
            getDateStatistics(
                dateString
            );


        const indicator =
            document.createElement("div");


        indicator.className =
            "attendance-indicator";


        /* =================================================
           NO ATTENDANCE
        ================================================= */

        if (stats.total === 0) {

            dayElement.classList.add(
                "no-attendance"
            );


            indicator.textContent =
                "No data";

        }


        /* =================================================
           ATTENDANCE AVAILABLE
        ================================================= */

        else {

            const percentage =
                Math.round(
                    (
                        stats.present /
                        stats.total
                    ) * 100
                );


            indicator.textContent =
                percentage + "%";


            if (percentage >= 80) {

                dayElement.classList.add(
                    "high-attendance"
                );

            }

            else if (percentage >= 50) {

                dayElement.classList.add(
                    "medium-attendance"
                );

            }

            else {

                dayElement.classList.add(
                    "low-attendance"
                );

            }


            /* =============================================
               PRESENT / ABSENT SUMMARY
            ============================================= */

            const summary =
                document.createElement("div");


            summary.className =
                "calendar-day-summary";


            const presentText =
                document.createElement("span");


            presentText.textContent =
                "✓ " + stats.present;


            const absentText =
                document.createElement("span");


            absentText.textContent =
                "✕ " + stats.absent;


            summary.appendChild(
                presentText
            );

            summary.appendChild(
                absentText
            );


            dayElement.appendChild(
                summary
            );

        }


        dayElement.appendChild(
            indicator
        );


        /* =================================================
           CLICK DATE
        ================================================= */

        dayElement.addEventListener(
            "click",
            function () {

                openAttendancePopup(
                    dateString
                );

            }
        );


        calendarDays.appendChild(
            dayElement
        );

    }

}


/* =========================================================
   DATE STATISTICS
========================================================= */

function getDateStatistics(dateString) {

    let present = 0;
    let absent = 0;
    let total = 0;


    attendanceRecords.forEach(
        function (record) {

            const recordDate =
                normalizeDate(
                    record.attendance_date ||
                    record.date
                );


            if (
                recordDate !== dateString
            ) {

                return;

            }


            const status =
                String(
                    record.status || ""
                )
                .trim()
                .toLowerCase();


            total++;


            if (
                status === "present"
            ) {

                present++;

            }

            else if (
                status === "absent"
            ) {

                absent++;

            }

        }
    );


    return {
        present: present,
        absent: absent,
        total: total
    };

}
/* =========================================================
   OPEN ATTENDANCE POPUP
========================================================= */

function openAttendancePopup(dateString) {

    if (!popup || !popupContent) {

        return;

    }


    popup.classList.add("show");


    popupContent.innerHTML = `
        <div class="popup-loading">
            Loading attendance...
        </div>
    `;


    const records =
        attendanceRecords.filter(
            function (record) {

                const recordDate =
                    normalizeDate(
                        record.attendance_date ||
                        record.date
                    );


                return (
                    recordDate ===
                    dateString
                );

            }
        );


    /* =====================================================
       NO DATA
    ===================================================== */

    if (records.length === 0) {

        popupContent.innerHTML = `
            <div class="popup-date">
                📅 ${escapeHTML(
                    formatReadableDate(dateString)
                )}
            </div>

            <div class="popup-empty">

                <div class="empty-icon">
                    📭
                </div>

                <h3>
                    No Attendance Records
                </h3>

                <p>
                    No attendance has been recorded
                    for this date.
                </p>

            </div>
        `;

        return;

    }


    /* =====================================================
       SUMMARY
    ===================================================== */

    let present = 0;
    let absent = 0;
    let other = 0;


    records.forEach(
        function (record) {

            const status =
                String(
                    record.status || ""
                )
                .trim()
                .toLowerCase();


            if (status === "present") {

                present++;

            }

            else if (status === "absent") {

                absent++;

            }

            else {

                other++;

            }

        }
    );


    const total =
        records.length;


    const percentage =
        total > 0
            ? Math.round(
                (present / total) * 100
            )
            : 0;


    /* =====================================================
       STUDENT RECORDS
    ===================================================== */

    let studentHTML = "";


    records.forEach(
        function (record) {

            const student =
                studentMap.get(
                    String(
                        record.student_id
                    )
                );


            const studentName =
                student
                    ? (
                        student.name ||
                        student.student_name ||
                        student.studentName ||
                        "Unknown Student"
                    )
                    : "Unknown Student";


            const className =
                student
                    ? (
                        student.class_name ||
                        student.className ||
                        student.class ||
                        ""
                    )
                    : "";


            const status =
                String(
                    record.status || "Unknown"
                )
                .trim();


            const normalizedStatus =
                status.toLowerCase();


            let statusClass =
                "status-other";


            let statusIcon =
                "•";


            if (
                normalizedStatus ===
                "present"
            ) {

                statusClass =
                    "status-present";

                statusIcon =
                    "✅";

            }

            else if (
                normalizedStatus ===
                "absent"
            ) {

                statusClass =
                    "status-absent";

                statusIcon =
                    "❌";

            }


            studentHTML += `

                <div class="attendance-record">

                    <div class="student-info">

                        <strong>
                            ${escapeHTML(
                                studentName
                            )}
                        </strong>

                        <small>
                            ${escapeHTML(
                                className ||
                                "Class not available"
                            )}
                        </small>

                    </div>

                    <span
                        class="popup-status ${statusClass}"
                    >
                        ${statusIcon}
                        ${escapeHTML(status)}
                    </span>

                </div>

            `;

        }
    );


    /* =====================================================
       POPUP HTML
    ===================================================== */

    popupContent.innerHTML = `

        <div class="popup-date">

            📅 ${escapeHTML(
                formatReadableDate(dateString)
            )}

        </div>


        <div class="popup-summary">

            <div class="summary-card present-card">

                <strong>
                    ${present}
                </strong>

                <span>
                    Present
                </span>

            </div>


            <div class="summary-card absent-card">

                <strong>
                    ${absent}
                </strong>

                <span>
                    Absent
                </span>

            </div>


            <div class="summary-card total-card">

                <strong>
                    ${total}
                </strong>

                <span>
                    Total
                </span>

            </div>


            <div class="summary-card percentage-card">

                <strong>
                    ${percentage}%
                </strong>

                <span>
                    Attendance
                </span>

            </div>

        </div>


        <div class="popup-student-list">

            <h3>
                👨‍🎓 Student Attendance
            </h3>

            <div class="attendance-record-list">

                ${studentHTML}

            </div>

        </div>

    `;

}


/* =========================================================
   CLOSE POPUP
========================================================= */

function closeAttendancePopup() {

    if (!popup) {

        return;

    }


    popup.classList.remove(
        "show"
    );

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(date) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        )
        .padStart(2, "0");


    const day =
        String(
            date.getDate()
        )
        .padStart(2, "0");


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


/* =========================================================
   NORMALIZE DATABASE DATE
========================================================= */

function normalizeDate(value) {

    if (!value) {

        return "";

    }


    const text =
        String(value);


    /*
       Handles:
       2026-08-14
       2026-08-14T00:00:00
       2026-08-14T05:30:00+05:30
    */

    if (
        /^\d{4}-\d{2}-\d{2}/.test(
            text
        )
    ) {

        return text.substring(
            0,
            10
        );

    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    return formatDate(
        date
    );

}
/* =========================================================
   READABLE DATE
========================================================= */

function formatReadableDate(
    dateString
) {

    const parts =
        String(
            dateString
        ).split("-");


    if (parts.length !== 3) {

        return dateString;

    }


    const date =
        new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );


    return new Intl.DateTimeFormat(
        "en-US",
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    ).format(date);

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

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


/* =========================================================
   LOADING STATE
========================================================= */

function showCalendarLoading() {

    if (!calendarDays) {

        return;

    }


    /*
       Don't destroy an already rendered calendar.
       Just show a small loading indicator in console.
    */

    console.log(
        "⏳ Loading attendance from Supabase..."
    );

}


/* =========================================================
   ERROR STATE
========================================================= */

function showCalendarError(
    message
) {

    console.error(
        "❌",
        message
    );

}


/* =========================================================
   DEBUG HELPER
========================================================= */

console.log(
    "📅 attendance-calendar.js loaded successfully."
);