// ============================================================
// AI ATTENDANCE ANALYTICS DASHBOARD
// PART 1 / 4
// Supabase Live Data Engine
// ============================================================

"use strict";


// ============================================================
// GLOBAL STATE
// ============================================================

let students = [];

let attendanceRecords = [];

let studentMap = new Map();


// ============================================================
// DOM ELEMENTS
// ============================================================

const aiStudents =
    document.getElementById("aiStudents");

const aiClasses =
    document.getElementById("aiClasses");

const aiPresent =
    document.getElementById("aiPresent");

const aiAbsent =
    document.getElementById("aiAbsent");

const aiPrediction =
    document.getElementById("aiPrediction");

const riskStudents =
    document.getElementById("riskStudents");


// ============================================================
// INITIALIZE
// ============================================================

window.addEventListener(
    "load",
    function () {

        console.log(
            "🤖 AI Dashboard starting..."
        );

        initializeAIDashboard();

    }
);


// ============================================================
// MAIN INITIALIZATION
// ============================================================

async function initializeAIDashboard() {

    try {

        // ----------------------------------------------------
        // CHECK SUPABASE
        // ----------------------------------------------------

        if (
            typeof supabaseClient === "undefined" ||
            !supabaseClient
        ) {

            console.error(
                "❌ supabaseClient not found."
            );

            showDashboardError(
                "Supabase connection is not available."
            );

            return;

        }


        // ----------------------------------------------------
        // LOAD DATA
        // ----------------------------------------------------

        await loadAIData();


        // ----------------------------------------------------
        // BUILD STUDENT MAP
        // ----------------------------------------------------

        buildStudentMap();


        // ----------------------------------------------------
        // BASIC ANALYTICS
        // ----------------------------------------------------

        calculateBasicAnalytics();


        console.log(
            "✅ AI Dashboard initialized successfully."
        );


    }
    catch (error) {

        console.error(
            "❌ AI Dashboard initialization failed:",
            error
        );

        showDashboardError(
            "Unable to load AI analytics."
        );

    }

}


// ============================================================
// LOAD DATA FROM SUPABASE
// ============================================================

async function loadAIData() {

    console.log(
        "📡 Loading AI analytics data..."
    );


    // ========================================================
    // STUDENTS
    // ========================================================

    const {
        data: studentData,
        error: studentError
    } =
        await supabaseClient
            .from("students")
            .select("*");


    if (studentError) {

        console.error(
            "❌ Student query failed:",
            studentError
        );

        throw studentError;

    }


    students =
        studentData || [];


    // ========================================================
    // ATTENDANCE
    // ========================================================

    const {
        data: attendanceData,
        error: attendanceError
    } =
        await supabaseClient
            .from("attendance")
            .select("*")
            .order(
                "attendance_date",
                {
                    ascending: true
                }
            );


    if (attendanceError) {

        console.error(
            "❌ Attendance query failed:",
            attendanceError
        );

        throw attendanceError;

    }


    attendanceRecords =
        attendanceData || [];


    console.log(
        "👨‍🎓 Students:",
        students.length
    );

    console.log(
        "📋 Attendance records:",
        attendanceRecords.length
    );


    // ========================================================
    // AI BACKEND ANALYSIS
    // ========================================================

    try {

        const response =
            await fetch(
                "http://127.0.0.1:8000/ai-analysis"
            );


        if (!response.ok) {

            throw new Error(
                "AI backend returned HTTP " +
                response.status
            );

        }


        const result =
            await response.json();


        window.aiBackendAnalysis =
            result;


        console.log(
            "🤖 AI Backend analysis:",
            result
        );

    }
    catch (error) {

        console.warn(
            "⚠️ AI backend unavailable. Using local analytics:",
            error
        );


        window.aiBackendAnalysis =
            null;

    }

}


// ============================================================
// BUILD STUDENT MAP
// ============================================================

function buildStudentMap() {

    studentMap =
        new Map();


    students.forEach(
        function (student) {

            if (
                !student ||
                student.id === undefined ||
                student.id === null
            ) {

                return;

            }


            studentMap.set(
                String(student.id),
                student
            );

        }
    );


    console.log(
        "🗺 Student map created:",
        studentMap.size
    );

}


// ============================================================
// BASIC ANALYTICS
// ============================================================

function calculateBasicAnalytics() {

    // --------------------------------------------------------
    // TOTAL STUDENTS
    // --------------------------------------------------------

    const totalStudents =
        students.length;


    // --------------------------------------------------------
    // TOTAL CLASSES
    // --------------------------------------------------------

    const classSet =
        new Set();


    students.forEach(
        function (student) {

            const className =
                student.class_name ||
                student.className ||
                student.class ||
                student.classname ||
                "";


            if (
                String(className).trim() !== ""
            ) {

                classSet.add(
                    String(className).trim()
                );

            }

        }
    );


    // --------------------------------------------------------
    // PRESENT / ABSENT
    // --------------------------------------------------------

    let present = 0;

    let absent = 0;


    attendanceRecords.forEach(
        function (record) {

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


    // --------------------------------------------------------
    // UPDATE DASHBOARD
    // --------------------------------------------------------

    if (aiStudents) {

        aiStudents.textContent =
            totalStudents;

    }


    if (aiClasses) {

        aiClasses.textContent =
            classSet.size;

    }


    if (aiPresent) {

        aiPresent.textContent =
            present;

    }


    if (aiAbsent) {

        aiAbsent.textContent =
            absent;

    }


    console.log(
        "📊 Basic analytics:",
        {
            totalStudents:
                totalStudents,

            totalClasses:
                classSet.size,

            present:
                present,

            absent:
                absent
        }
    );

}


// ============================================================
// ERROR DISPLAY
// ============================================================

function showDashboardError(
    message
) {

    if (aiPrediction) {

        aiPrediction.textContent =
            "⚠️ " + message;

    }


    if (riskStudents) {

        riskStudents.innerHTML =
            `
            <div>
                ⚠️ Unable to calculate
                student risk analysis.
            </div>
            `;

    }

}


// ============================================================
// END OF PART 1
// ============================================================
// ============================================================
// AI ATTENDANCE ANALYTICS DASHBOARD
// PART 2 / 4
// Student Performance Analytics Engine
// ============================================================


// ============================================================
// STUDENT ANALYTICS STORAGE
// ============================================================

let studentAnalytics = [];


// ============================================================
// BUILD STUDENT ANALYTICS
// ============================================================

function buildStudentAnalytics() {

    studentAnalytics = [];


    // --------------------------------------------------------
    // CREATE ANALYTICS FOR EVERY STUDENT
    // --------------------------------------------------------

    students.forEach(
        function (student) {

            if (
                !student ||
                student.id === undefined ||
                student.id === null
            ) {

                return;

            }


            const studentId =
                String(student.id);


            // ------------------------------------------------
            // STUDENT NAME
            // ------------------------------------------------

            const studentName =
                student.name ||
                student.student_name ||
                student.studentName ||
                "Unknown Student";


            // ------------------------------------------------
            // CLASS
            // ------------------------------------------------

            const className =
                student.class_name ||
                student.className ||
                student.class ||
                student.classname ||
                "Not Assigned";


            // ------------------------------------------------
            // FIND ATTENDANCE RECORDS
            // ------------------------------------------------

            const records =
                attendanceRecords.filter(
                    function (record) {

                        return String(
                            record.student_id
                        ) === studentId;

                    }
                );


            // ------------------------------------------------
            // COUNTERS
            // ------------------------------------------------

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
                    else {

                        other++;

                    }

                }
            );


            // ------------------------------------------------
            // TOTAL
            // ------------------------------------------------

            const total =
                present +
                absent;


            // ------------------------------------------------
            // ATTENDANCE PERCENTAGE
            // ------------------------------------------------

            let percentage = 0;


            if (
                total > 0
            ) {

                percentage =
                    Math.round(
                        (
                            present /
                            total
                        ) * 100
                    );

            }


            // ------------------------------------------------
            // RISK LEVEL
            // ------------------------------------------------

            let riskLevel =
                "No Data";


            if (
                total === 0
            ) {

                riskLevel =
                    "No Data";

            }
            else if (
                percentage < 50
            ) {

                riskLevel =
                    "Critical";

            }
            else if (
                percentage < 65
            ) {

                riskLevel =
                    "High";

            }
            else if (
                percentage < 75
            ) {

                riskLevel =
                    "Medium";

            }
            else {

                riskLevel =
                    "Low";

            }


            // ------------------------------------------------
            // PERFORMANCE SCORE
            // ------------------------------------------------

            let performanceScore =
                0;


            if (
                total > 0
            ) {

                performanceScore =
                    Math.round(
                        (
                            present /
                            total
                        ) * 100
                    );

            }


            // ------------------------------------------------
            // ADD ANALYTICS OBJECT
            // ------------------------------------------------

            studentAnalytics.push({

                id:
                    studentId,

                name:
                    studentName,

                className:
                    className,

                present:
                    present,

                absent:
                    absent,

                other:
                    other,

                total:
                    total,

                percentage:
                    percentage,

                riskLevel:
                    riskLevel,

                performanceScore:
                    performanceScore

            });

        }
    );


    console.log(
        "📊 Student analytics created:",
        studentAnalytics.length
    );


    return studentAnalytics;

}


// ============================================================
// GET STUDENT ANALYTICS
// ============================================================

function getStudentAnalytics(
    studentId
) {

    return studentAnalytics.find(
        function (student) {

            return String(
                student.id
            ) === String(
                studentId
            );

        }
    );

}


// ============================================================
// GET AT-RISK STUDENTS
// ============================================================

function getAtRiskStudents() {

    return studentAnalytics.filter(
        function (student) {

            return (
                student.riskLevel === "Critical" ||
                student.riskLevel === "High" ||
                student.riskLevel === "Medium"
            );

        }
    );

}


// ============================================================
// GET CRITICAL STUDENTS
// ============================================================

function getCriticalStudents() {

    return studentAnalytics.filter(
        function (student) {

            return (
                student.riskLevel === "Critical"
            );

        }
    );

}


// ============================================================
// GET HIGH PERFORMERS
// ============================================================

function getHighPerformers() {

    return studentAnalytics.filter(
        function (student) {

            return (
                student.total > 0 &&
                student.percentage >= 90
            );

        }
    );

}


// ============================================================
// SORT STUDENTS BY ATTENDANCE
// ============================================================

function getStudentsByAttendance(
    descending = true
) {

    return [
        ...studentAnalytics
    ]
    .sort(
        function (a, b) {

            if (descending) {

                return (
                    b.percentage -
                    a.percentage
                );

            }

            return (
                a.percentage -
                b.percentage
            );

        }
    );

}


// ============================================================
// GET CLASS ANALYTICS
// ============================================================

function buildClassAnalytics() {

    const classMap =
        new Map();


    studentAnalytics.forEach(
        function (student) {

            const className =
                student.className ||
                "Not Assigned";


            if (
                !classMap.has(
                    className
                )
            ) {

                classMap.set(
                    className,
                    {
                        className:
                            className,

                        students:
                            0,

                        present:
                            0,

                        absent:
                            0,

                        total:
                            0
                    }
                );

            }


            const classData =
                classMap.get(
                    className
                );


            classData.students++;


            classData.present +=
                student.present;


            classData.absent +=
                student.absent;


            classData.total +=
                student.total;

        }
    );


    // --------------------------------------------------------
    // CALCULATE CLASS PERCENTAGES
    // --------------------------------------------------------

    const result =
        Array.from(
            classMap.values()
        );


    result.forEach(
        function (classData) {

            if (
                classData.total > 0
            ) {

                classData.percentage =
                    Math.round(
                        (
                            classData.present /
                            classData.total
                        ) * 100
                    );

            }
            else {

                classData.percentage =
                    0;

            }

        }
    );


    console.log(
        "🏫 Class analytics:",
        result
    );


    return result;

}


// ============================================================
// OVERALL ATTENDANCE PERCENTAGE
// ============================================================

function getOverallAttendancePercentage() {

    let present = 0;

    let absent = 0;


    attendanceRecords.forEach(
        function (record) {

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
        present +
        absent;


    if (
        total === 0
    ) {

        return 0;

    }


    return Math.round(
        (
            present /
            total
        ) * 100
    );

}


// ============================================================
// TODAY DATE
// ============================================================

function getTodayDate() {

    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        )
        .padStart(
            2,
            "0"
        );


    const day =
        String(
            today.getDate()
        )
        .padStart(
            2,
            "0"
        );


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


// ============================================================
// GET RECORD DATE
// ============================================================

function getAttendanceRecordDate(
    record
) {

    return (
        record.attendance_date ||
        record.date ||
        ""
    );

}


// ============================================================
// TODAY ATTENDANCE
// ============================================================

function getTodayAttendance() {

    const today =
        getTodayDate();


    const todayRecords =
        attendanceRecords.filter(
            function (record) {

                return (
                    getAttendanceRecordDate(
                        record
                    ) === today
                );

            }
        );


    let present = 0;

    let absent = 0;


    todayRecords.forEach(
        function (record) {

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
        present +
        absent;


    let percentage = 0;


    if (
        total > 0
    ) {

        percentage =
            Math.round(
                (
                    present /
                    total
                ) * 100
            );

    }


    return {

        date:
            today,

        present:
            present,

        absent:
            absent,

        total:
            total,

        percentage:
            percentage

    };

}


// ============================================================
// END OF PART 2
// ============================================================
// ============================================================
// AI ATTENDANCE ANALYTICS DASHBOARD
// PART 3 / 4
// Dashboard Rendering + AI Analysis
// ============================================================


// ============================================================
// RENDER ADVANCED ANALYTICS
// ============================================================

function renderAdvancedAnalytics() {

    console.log(
        "📊 Rendering advanced AI analytics..."
    );


    // --------------------------------------------------------
    // OVERALL ATTENDANCE
    // --------------------------------------------------------

    const overallPercentage =
        getOverallAttendancePercentage();


    updateElement(
        "aiOverallPercentage",
        overallPercentage + "%"
    );


    // --------------------------------------------------------
    // TODAY ATTENDANCE
    // --------------------------------------------------------

    const today =
        getTodayAttendance();


    updateElement(
        "aiTodayPresent",
        today.present
    );


    updateElement(
        "aiTodayAbsent",
        today.absent
    );


    updateElement(
        "aiTodayPercentage",
        today.percentage + "%"
    );


    // --------------------------------------------------------
    // RISK STUDENTS
    // --------------------------------------------------------

    renderRiskStudents();


    // --------------------------------------------------------
    // AI ANALYSIS
    // --------------------------------------------------------

    generateAIAnalysis();


    // --------------------------------------------------------
    // TOP PERFORMERS
    // --------------------------------------------------------

    renderTopPerformers();


    // --------------------------------------------------------
    // CLASS ANALYTICS
    // --------------------------------------------------------

    renderClassAnalytics();

}


// ============================================================
// UPDATE ELEMENT SAFELY
// ============================================================

function updateElement(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


// ============================================================
// RISK STUDENTS
// ============================================================

function renderBackendAIRiskStudents() {

    const el =
        document.getElementById("riskStudents");

    const result =
        window.aiBackendAnalysis;

    if (!el || !result || !Array.isArray(result.analysis)) {
        return false;
    }

    if (!result.analysis.length) {
        el.innerHTML = `
            <div class="risk-empty">
                🟢 No AI risk analysis available.
            </div>
        `;
        return true;
    }

    el.innerHTML =
        result.analysis.map(function (student) {

            const percentage =
                Number(student.attendance_percentage || 0);

            const risk =
                String(student.risk || "UNKNOWN")
                    .toUpperCase();

            let riskClass = "risk-medium";
            let riskLabel = "⚠️ Needs Attention";

            if (risk === "HIGH" || percentage < 50) {
                riskClass = "risk-high";
                riskLabel = "🔴 High Risk";
            }
            else if (risk === "MEDIUM" || percentage < 75) {
                riskClass = "risk-medium";
                riskLabel = "⚠️ Needs Attention";
            }
            else {
                riskClass = "risk-low";
                riskLabel = "🟢 Healthy";
            }

            return `
                <div class="risk-student ${riskClass}">

                    <div class="risk-student-info">

                        <strong>
                            ${escapeAIHTML(
                                student.student_name || "Unknown Student"
                            )}
                        </strong>

                        <small>
                            Class:
                            ${escapeAIHTML(
                                student.class_name || "Not Assigned"
                            )}
                            |
                            Present:
                            ${Number(student.present || 0)}
                            |
                            Absent:
                            ${Number(student.absent || 0)}
                        </small>

                    </div>

                    <div class="risk-score">

                        <strong>
                            ${percentage}%
                        </strong>

                        <small>
                            ${riskLabel}
                        </small>

                    </div>

                </div>
            `;

        }).join("");

    return true;
}


function renderRiskStudents() {

    if (!riskStudents) {

        return;

    }


    const atRisk =
        getAtRiskStudents()
        .sort(
            function (a, b) {

                return (
                    a.percentage -
                    b.percentage
                );

            }
        );


    // --------------------------------------------------------
    // NO RISK
    // --------------------------------------------------------

    if (
        atRisk.length === 0
    ) {

        riskStudents.innerHTML =
            `
            <div class="ai-empty-state">

                <div>
                    🎉
                </div>

                <strong>
                    No students currently at risk
                </strong>

                <p>
                    Attendance levels look healthy.
                </p>

            </div>
            `;

        return;

    }


    // --------------------------------------------------------
    // BUILD LIST
    // --------------------------------------------------------

    let html = "";


    atRisk
        .slice(0, 10)
        .forEach(
            function (student) {

                let riskClass =
                    "medium";


                if (
                    student.riskLevel ===
                    "Critical"
                ) {

                    riskClass =
                        "critical";

                }
                else if (
                    student.riskLevel ===
                    "High"
                ) {

                    riskClass =
                        "high";

                }


                html +=
                    `
                    <div class="risk-student">

                        <div class="risk-student-info">

                            <strong>
                                ${escapeAIHTML(
                                    student.name
                                )}
                            </strong>

                            <small>
                                ${escapeAIHTML(
                                    student.className
                                )}
                            </small>

                        </div>


                        <div class="risk-student-score">

                            <span
                                class="risk-badge ${riskClass}"
                            >
                                ${student.riskLevel}
                            </span>

                            <strong>
                                ${student.percentage}%
                            </strong>

                        </div>

                    </div>
                    `;

            }
        );


    riskStudents.innerHTML =
        html;

}


// ============================================================
// TOP PERFORMERS
// ============================================================

function renderTopPerformers() {

    const container =
        document.getElementById(
            "topPerformers"
        );


    if (!container) {

        return;

    }


    const performers =
        getHighPerformers()
        .sort(
            function (a, b) {

                return (
                    b.percentage -
                    a.percentage
                );

            }
        )
        .slice(
            0,
            5
        );


    if (
        performers.length === 0
    ) {

        container.innerHTML =
            `
            <div class="ai-empty-state">
                No high-performance data available yet.
            </div>
            `;

        return;

    }


    let html = "";


    performers.forEach(
        function (student, index) {

            html +=
                `
                <div class="top-student">

                    <span class="top-rank">
                        ${index + 1}
                    </span>

                    <div class="top-student-info">

                        <strong>
                            ${escapeAIHTML(
                                student.name
                            )}
                        </strong>

                        <small>
                            ${escapeAIHTML(
                                student.className
                            )}
                        </small>

                    </div>

                    <strong>
                        ${student.percentage}%
                    </strong>

                </div>
                `;

        }
    );


    container.innerHTML =
        html;

}


// ============================================================
// CLASS ANALYTICS
// ============================================================

function renderClassAnalytics() {

    const container =
        document.getElementById(
            "classAnalytics"
        );


    if (!container) {

        return;

    }


    const classes =
        buildClassAnalytics()
        .sort(
            function (a, b) {

                return (
                    b.percentage -
                    a.percentage
                );

            }
        );


    if (
        classes.length === 0
    ) {

        container.innerHTML =
            `
            <div class="ai-empty-state">
                No class attendance data available.
            </div>
            `;

        return;

    }


    let html = "";


    classes.forEach(
        function (classData) {

            let level =
                "low";


            if (
                classData.percentage >= 80
            ) {

                level =
                    "high";

            }
            else if (
                classData.percentage >= 65
            ) {

                level =
                    "medium";

            }


            html +=
                `
                <div class="class-analytics-row">

                    <div>

                        <strong>
                            ${escapeAIHTML(
                                classData.className
                            )}
                        </strong>

                        <small>
                            ${classData.students}
                            students
                        </small>

                    </div>


                    <div class="class-progress">

                        <div
                            class="class-progress-bar ${level}"
                            style="width:${classData.percentage}%"
                        ></div>

                    </div>


                    <strong>
                        ${classData.percentage}%
                    </strong>

                </div>
                `;

        }
    );


    container.innerHTML =
        html;

}


// ============================================================
// AI ANALYSIS
// ============================================================

function generateAIAnalysis() {

    if (!aiPrediction) {

        return;

    }


    const percentage =
        getOverallAttendancePercentage();


    const atRisk =
        getAtRiskStudents();


    const critical =
        getCriticalStudents();


    const today =
        getTodayAttendance();


    let title =
        "";


    let message =
        "";


    // --------------------------------------------------------
    // NO DATA
    // --------------------------------------------------------

    if (
        attendanceRecords.length === 0
    ) {

        title =
            "📊 Insufficient attendance data";


        message =
            "The system does not have enough attendance records to generate a meaningful AI analysis yet.";

    }


    // --------------------------------------------------------
    // CRITICAL
    // --------------------------------------------------------

    else if (
        percentage < 50
    ) {

        title =
            "🚨 Critical attendance situation";


        message =
            `
            Overall attendance is currently
            <strong>${percentage}%</strong>.
            Immediate attention is recommended.
            There are
            <strong>${critical.length}</strong>
            students in the critical-risk category.
            `;

    }


    // --------------------------------------------------------
    // LOW
    // --------------------------------------------------------

    else if (
        percentage < 65
    ) {

        title =
            "⚠️ Attendance needs attention";


        message =
            `
            Overall attendance is
            <strong>${percentage}%</strong>.
            Attendance is below the healthy target.
            The system identified
            <strong>${atRisk.length}</strong>
            students who may need follow-up.
            `;

    }


    // --------------------------------------------------------
    // MEDIUM
    // --------------------------------------------------------

    else if (
        percentage < 80
    ) {

        title =
            "🟡 Attendance is moderate";


        message =
            `
            Overall attendance is
            <strong>${percentage}%</strong>.
            Attendance is reasonable, but some students
            may benefit from early intervention.
            `;

    }


    // --------------------------------------------------------
    // HEALTHY
    // --------------------------------------------------------

    else {

        title =
            "🟢 Attendance looks healthy";


        message =
            `
            Overall attendance is
            <strong>${percentage}%</strong>.
            Current attendance performance is within a
            healthy range.
            `;

    }


    // --------------------------------------------------------
    // TODAY INFORMATION
    // --------------------------------------------------------

    let todayMessage = "";


    if (
        today.total > 0
    ) {

        todayMessage =
            `
            <br><br>
            📅 Today's attendance:
            <strong>
                ${today.percentage}%
            </strong>
            (${today.present} present /
            ${today.absent} absent).
            `;

    }


    aiPrediction.innerHTML =
        `
        <div class="ai-analysis-result">

            <h3>
                ${title}
            </h3>

            <p>
                ${message}
                ${todayMessage}
            </p>

        </div>
        `;

}


// ============================================================
// HTML ESCAPE
// ============================================================

function escapeAIHTML(
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


// ============================================================
// END OF PART 3
// ============================================================
// ============================================
// AI ATTENDANCE ANALYTICS DASHBOARD
// PART 4 / 4
// Final Rendering + AI Analysis + Initialization
// ============================================


// ============================================
// UPDATE SUMMARY CARDS
// ============================================

function updateSummaryCards() {

    if (aiStudents) {

        aiStudents.textContent =
            students.length;

    }


    if (aiClasses) {

        const classes =
            new Set();

        students.forEach(
            function (student) {

                const className =
                    student.class_name ||
                    student.className ||
                    student.class ||
                    student.classname ||
                    "";

                if (String(className).trim() !== "") {

                    classes.add(
                        String(className).trim()
                    );

                }

            }
        );

        aiClasses.textContent =
            classes.size;

    }


    let present = 0;
    let absent = 0;


    attendanceRecords.forEach(
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

        }
    );


    if (aiPresent) {

        aiPresent.textContent =
            present;

    }


    if (aiAbsent) {

        aiAbsent.textContent =
            absent;

    }

}


// ============================================
// CALCULATE OVERALL ATTENDANCE
// ============================================

function calculateOverallAttendance() {

    let present = 0;
    let absent = 0;


    attendanceRecords.forEach(
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

        }
    );


    const total =
        present + absent;


    if (total === 0) {

        return {

            present: 0,
            absent: 0,
            total: 0,
            percentage: 0

        };

    }


    return {

        present: present,

        absent: absent,

        total: total,

        percentage:
            Math.round(
                (present / total) * 100
            )

    };

}


// ============================================
// AI ATTENDANCE ANALYSIS
// ============================================

function generateAIAnalysis() {

    if (!aiPrediction) {

        return;

    }


    const stats =
        calculateOverallAttendance();


    if (stats.total === 0) {

        aiPrediction.innerHTML = `
            <strong>🤖 AI Insight</strong>
            <br><br>
            No attendance records are available
            yet. Once attendance is recorded,
            the AI dashboard will analyse
            attendance trends automatically.
        `;

        return;

    }


    let message = "";


    if (stats.percentage >= 90) {

        message = `
            <strong>🟢 Excellent Attendance</strong>
            <br><br>
            Overall attendance is
            <strong>${stats.percentage}%</strong>.
            The attendance pattern is currently
            very healthy.
        `;

    }
    else if (stats.percentage >= 80) {

        message = `
            <strong>🟢 Good Attendance</strong>
            <br><br>
            Overall attendance is
            <strong>${stats.percentage}%</strong>.
            Most students are maintaining a
            satisfactory attendance level.
        `;

    }
    else if (stats.percentage >= 70) {

        message = `
            <strong>🟡 Moderate Attendance</strong>
            <br><br>
            Overall attendance is
            <strong>${stats.percentage}%</strong>.
            Some students may require monitoring
            and early intervention.
        `;

    }
    else {

        message = `
            <strong>🔴 Attendance Attention Required</strong>
            <br><br>
            Overall attendance is only
            <strong>${stats.percentage}%</strong>.
            The system recommends reviewing
            students with repeated absences.
        `;

    }


    message += `
        <br><br>
        📊 Present:
        <strong>${stats.present}</strong>
        &nbsp;&nbsp;
        ❌ Absent:
        <strong>${stats.absent}</strong>
        &nbsp;&nbsp;
        👥 Total records:
        <strong>${stats.total}</strong>
    `;


    aiPrediction.innerHTML =
        message;

}


// ============================================
// FIND STUDENTS AT RISK
// ============================================

function calculateRiskStudents() {

    if (!riskStudents) {

        return;

    }


    if (students.length === 0) {

        riskStudents.innerHTML = `
            <div class="risk-empty">
                👨‍🎓 No students available.
            </div>
        `;

        return;

    }


    const riskList = [];


    students.forEach(
        function (student) {

            if (
                !student ||
                student.id === undefined ||
                student.id === null
            ) {

                return;

            }


            const studentId =
                String(student.id);


            const studentRecords =
                attendanceRecords.filter(
                    function (record) {

                        return String(
                            record.student_id
                        ) === studentId;

                    }
                );


            let present = 0;
            let absent = 0;


            studentRecords.forEach(
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

                }
            );


            const total =
                present + absent;


            if (total === 0) {

                return;

            }


            const percentage =
                Math.round(
                    (present / total) * 100
                );


            if (percentage < 75) {

                const name =
                    student.name ||
                    student.student_name ||
                    student.studentName ||
                    "Unknown Student";


                riskList.push({

                    name: name,

                    percentage: percentage,

                    present: present,

                    absent: absent,

                    total: total

                });

            }

        }
    );


    riskList.sort(
        function (a, b) {

            return (
                a.percentage -
                b.percentage
            );

        }
    );


    if (riskList.length === 0) {

        riskStudents.innerHTML = `
            <div class="risk-empty">
                🟢 No students are currently
                below the 75% attendance level.
            </div>
        `;

        return;

    }


    let html = "";


    riskList.forEach(
        function (student) {

            let riskClass =
                "risk-medium";


            let riskLabel =
                "⚠️ Needs Attention";


            if (
                student.percentage < 50
            ) {

                riskClass =
                    "risk-high";

                riskLabel =
                    "🔴 High Risk";

            }


            html += `
                <div class="risk-student ${riskClass}">

                    <div class="risk-student-info">

                        <strong>
                            ${escapeAIHTML(
                                student.name
                            )}
                        </strong>

                        <small>
                            Present:
                            ${student.present}
                            |
                            Absent:
                            ${student.absent}
                        </small>

                    </div>


                    <div class="risk-score">

                        <strong>
                            ${student.percentage}%
                        </strong>

                        <small>
                            ${riskLabel}
                        </small>

                    </div>

                </div>
            `;

        }
    );


    riskStudents.innerHTML =
        html;

}


// ============================================
// HTML ESCAPE
// ============================================

function escapeAIHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ============================================
// SHOW DASHBOARD
// ============================================

function renderAIDashboard() {

    updateSummaryCards();

    generateAIAnalysis();

    calculateRiskStudents();

    renderAdvancedAnalytics();

    if (!renderBackendAIRiskStudents()) {
        renderRiskStudents();
    }

    renderTopPerformers();

    renderClassAnalytics();

}


// ============================================
// LOAD EVERYTHING
// ============================================

async function initializeAIDashboard() {

    console.log(
        "🤖 Initializing AI Analytics Dashboard..."
    );


    if (
        typeof supabaseClient === "undefined" ||
        !supabaseClient
    ) {

        console.error(
            "❌ Supabase client not available."
        );


        if (aiPrediction) {

            aiPrediction.innerHTML = `
                <strong>❌ Connection Error</strong>
                <br><br>
                Supabase connection is not available.
            `;

        }


        if (riskStudents) {

            riskStudents.innerHTML = `
                <div class="risk-empty">
                    Unable to load student data.
                </div>
            `;

        }


        return;

    }


    await loadAIData();

    renderAIDashboard();

    if (typeof renderAIInsights === "function") {

        renderAIInsights();

    }


    console.log(
        "✅ AI Analytics Dashboard ready."
    );

}


// ============================================
// START APPLICATION
// ============================================

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeAIDashboard
    );

}
else {

    initializeAIDashboard();

}


// ============================================
// OPTIONAL GLOBAL REFRESH
// ============================================

window.refreshAIDashboard =
    async function () {

        console.log(
            "🔄 Refreshing AI dashboard..."
        );


        await loadAIData();

        renderAIDashboard();

        if (typeof renderAIInsights === "function") {

            renderAIInsights();

        }

    };


// ============================================
// PART 4 / 4 COMPLETE
// ============================================
