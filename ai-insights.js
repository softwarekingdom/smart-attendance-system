"use strict";

/* ============================================================
   AI INSIGHTS ENGINE — PART 1
   ============================================================ */

(function () {

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function getRecords() {

        return Array.isArray(attendanceRecords)
            ? attendanceRecords
            : [];

    }


    function getStudents() {

        return Array.isArray(students)
            ? students
            : [];

    }


    function statusOf(record) {

        return String(
            record?.status || ""
        )
        .trim()
        .toLowerCase();

    }


    function studentIdOf(student) {

        return String(
            student?.id ?? ""
        );

    }


    function studentNameOf(student) {

        return (
            student?.name ||
            student?.student_name ||
            student?.studentName ||
            "Unknown Student"
        );

    }


    function classNameOf(student) {

        return (
            student?.class_name ||
            student?.className ||
            student?.class ||
            student?.classname ||
            "Not Assigned"
        );

    }


    window.renderAIInsightsPart1 =
        function () {

            console.log(
                "🤖 AI Insights Part 1 ready."
            );

        };


    console.log(
        "🤖 AI Insights Engine Part 1 loaded."
    );

})();


/* ============================================================
   AI INSIGHTS — PART 2
   ATTENDANCE TREND
   ============================================================ */

function renderAttendanceTrendAI() {

    const el =
        document.getElementById("attendanceTrend");

    if (!el) return;


    const records =
        Array.isArray(attendanceRecords)
            ? attendanceRecords
            : [];


    const validRecords =
        records.filter(
            function (record) {

                const status =
                    String(
                        record?.status || ""
                    )
                    .trim()
                    .toLowerCase();

                return (
                    status === "present" ||
                    status === "absent"
                );

            }
        );


    if (!validRecords.length) {

        el.innerHTML = `
            <div class="ai-empty">
                No attendance trend data available.
            </div>
        `;

        return;

    }


    const dateMap =
        new Map();


    validRecords.forEach(
        function (record) {

            const date =
                record.attendance_date ||
                record.date ||
                "Unknown";


            if (!dateMap.has(date)) {

                dateMap.set(
                    date,
                    {
                        present: 0,
                        absent: 0
                    }
                );

            }


            const data =
                dateMap.get(date);


            const status =
                String(
                    record.status || ""
                )
                .trim()
                .toLowerCase();


            if (status === "present") {

                data.present++;

            }
            else {

                data.absent++;

            }

        }
    );


    const dates =
        Array.from(
            dateMap.keys()
        )
        .sort()
        .slice(-7);


    el.innerHTML =
        dates.map(
            function (date) {

                const data =
                    dateMap.get(date);


                const total =
                    data.present +
                    data.absent;


                const percentage =
                    total > 0
                        ? Math.round(
                            data.present /
                            total *
                            100
                        )
                        : 0;


                return `
                    <div class="trend-row">

                        <div class="trend-date">
                            ${escapeAIHTML(date)}
                        </div>

                        <div class="trend-bar">

                            <div
                                class="trend-fill"
                                style="width:${percentage}%"
                            ></div>

                        </div>

                        <div class="trend-value">
                            ${percentage}%
                        </div>

                    </div>
                `;

            }
        )
        .join("");

}


console.log(
    "📈 AI Insights Part 2 loaded."
);



/* ============================================================
   AI INSIGHTS — PART 3
   CLASS PERFORMANCE
   ============================================================ */

function renderClassPerformanceAI() {

    const el =
        document.getElementById("classPerformance");

    if (!el) return;


    const studentData =
        Array.isArray(students)
            ? students
            : [];


    const attendanceData =
        Array.isArray(attendanceRecords)
            ? attendanceRecords
            : [];


    const classMap =
        new Map();


    studentData.forEach(
        function (student) {

            const className =
                student.class_name ||
                student.className ||
                student.class ||
                student.classname ||
                "Not Assigned";


            const studentId =
                String(
                    student.id ?? ""
                );


            if (!classMap.has(className)) {

                classMap.set(
                    className,
                    {
                        students: 0,
                        present: 0,
                        absent: 0
                    }
                );

            }


            const classData =
                classMap.get(className);


            classData.students++;


            attendanceData.forEach(
                function (record) {

                    if (
                        String(
                            record.student_id
                        ) !== studentId
                    ) {

                        return;

                    }


                    const status =
                        String(
                            record.status || ""
                        )
                        .trim()
                        .toLowerCase();


                    if (
                        status === "present"
                    ) {

                        classData.present++;

                    }
                    else if (
                        status === "absent"
                    ) {

                        classData.absent++;

                    }

                }
            );

        }
    );


    const classes =
        Array.from(
            classMap.entries()
        );


    if (!classes.length) {

        el.innerHTML = `
            <div class="ai-empty">
                No class performance data available.
            </div>
        `;

        return;

    }


    el.innerHTML =
        classes.map(
            function ([className, data]) {

                const total =
                    data.present +
                    data.absent;


                const percentage =
                    total > 0
                        ? Math.round(
                            data.present /
                            total *
                            100
                        )
                        : 0;


                return `
                    <div class="class-row">

                        <div>
                            <strong>
                                ${escapeAIHTML(
                                    className
                                )}
                            </strong>

                            <small>
                                ${data.students}
                                students
                            </small>
                        </div>

                        <div class="class-score">
                            ${percentage}%
                        </div>

                    </div>
                `;

            }
        )
        .join("");

}


console.log(
    "🏫 AI Insights Part 3 loaded."
);



/* ============================================================
   AI INSIGHTS — PART 4
   TOP ATTENDANCE
   AI RECOMMENDATIONS
   ============================================================ */


/* ============================================================
   TOP ATTENDANCE
   ============================================================ */

function renderTopAttendanceAI() {

    const el =
        document.getElementById("topStudents");

    if (!el) return;


    const studentData =
        Array.isArray(students)
            ? students
            : [];


    const attendanceData =
        Array.isArray(attendanceRecords)
            ? attendanceRecords
            : [];


    const result =
        studentData.map(
            function (student) {

                const id =
                    String(
                        student.id ?? ""
                    );


                let present = 0;
                let absent = 0;


                attendanceData.forEach(
                    function (record) {

                        if (
                            String(
                                record.student_id
                            ) !== id
                        ) {

                            return;

                        }


                        const status =
                            String(
                                record.status || ""
                            )
                            .trim()
                            .toLowerCase();


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


                const total =
                    present + absent;


                const percentage =
                    total > 0
                        ? Math.round(
                            present /
                            total *
                            100
                        )
                        : 0;


                return {

                    name:
                        student.name ||
                        student.student_name ||
                        student.studentName ||
                        "Unknown Student",

                    percentage:
                        percentage,

                    total:
                        total

                };

            }
        )
        .filter(
            function (student) {

                return student.total > 0;

            }
        )
        .sort(
            function (a, b) {

                return (
                    b.percentage -
                    a.percentage
                );

            }
        )
        .slice(0, 5);


    if (!result.length) {

        el.innerHTML = `
            <div class="ai-empty">
                No student attendance data available.
            </div>
        `;

        return;

    }


    el.innerHTML =
        result.map(
            function (student, index) {

                return `
                    <div class="student-insight-item">

                        <div class="student-rank">
                            #${index + 1}
                        </div>

                        <div class="student-info">

                            <strong>
                                ${escapeAIHTML(
                                    student.name
                                )}
                            </strong>

                            <small>
                                Attendance
                            </small>

                        </div>

                        <div class="student-score">
                            ${student.percentage}%
                        </div>

                    </div>
                `;

            }
        )
        .join("");

}


/* ============================================================
   AI RECOMMENDATIONS
   ============================================================ */

function renderAIRecommendationsAI() {

    const el =
        document.getElementById(
            "aiRecommendations"
        );

    if (!el) return;


    const studentData =
        Array.isArray(students)
            ? students
            : [];


    const attendanceData =
        Array.isArray(attendanceRecords)
            ? attendanceRecords
            : [];


    let critical = 0;
    let high = 0;
    let medium = 0;


    studentData.forEach(
        function (student) {

            const id =
                String(
                    student.id ?? ""
                );


            let present = 0;
            let absent = 0;


            attendanceData.forEach(
                function (record) {

                    if (
                        String(
                            record.student_id
                        ) !== id
                    ) {

                        return;

                    }


                    const status =
                        String(
                            record.status || ""
                        )
                        .trim()
                        .toLowerCase();


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


            const total =
                present + absent;


            if (!total) return;


            const percentage =
                present /
                total *
                100;


            if (percentage < 50) {

                critical++;

            }
            else if (percentage < 65) {

                high++;

            }
            else if (percentage < 75) {

                medium++;

            }

        }
    );


    const recommendations = [];


    if (critical > 0) {

        recommendations.push(
            `🚨 ${critical} student(s) need immediate attendance intervention.`
        );

    }


    if (high > 0) {

        recommendations.push(
            `⚠️ ${high} student(s) are in the high-risk attendance group.`
        );

    }


    if (medium > 0) {

        recommendations.push(
            `📊 Monitor ${medium} student(s) with medium attendance risk.`
        );

    }


    if (!recommendations.length) {

        recommendations.push(
            "✅ Attendance performance is currently healthy. Continue regular monitoring."
        );

    }


    el.innerHTML =
        recommendations.map(
            function (text) {

                return `
                    <div class="recommendation-item">
                        ${escapeAIHTML(text)}
                    </div>
                `;

            }
        )
        .join("");

}


/* ============================================================
   MAIN AI INSIGHTS RENDERER
   ============================================================ */

function renderAIInsights() {

    renderAttendanceTrendAI();

    renderClassPerformanceAI();

    renderTopAttendanceAI();

    renderAIRecommendationsAI();

}


window.renderAIInsights =
    renderAIInsights;


console.log(
    "🤖 AI Insights Engine Part 4 loaded successfully."
);

