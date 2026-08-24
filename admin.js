// =====================================
// AI SCHOOL
// Admin Panel
// Supabase Version
// =====================================


// =====================================
// PAGE LOAD
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    loadAdminStats();

});


// =====================================
// LOAD ADMIN STATISTICS
// =====================================

async function loadAdminStats() {

    console.log("Loading Admin Statistics...");

    // Show loading state

    document.getElementById("studentCount").textContent = "...";
    document.getElementById("teacherCount").textContent = "...";
    document.getElementById("attendanceCount").textContent = "...";


    try {

        // =====================================
        // CHECK SUPABASE CONNECTION
        // =====================================

        if (!supabaseClient) {

            throw new Error(
                "Supabase client is not available."
            );

        }


        // =====================================
        // STUDENTS COUNT
        // =====================================

        const {
            count: studentCount,
            error: studentError
        } = await supabaseClient

            .from("students")

            .select("id", {
                count: "exact",
                head: true
            });


        if (studentError) {

            console.error(
                "Students Count Error:",
                studentError
            );

            throw studentError;

        }


        document.getElementById(
            "studentCount"
        ).textContent = studentCount ?? 0;


        // =====================================
        // TEACHERS COUNT
        // =====================================

        const {
            count: teacherCount,
            error: teacherError
        } = await supabaseClient

            .from("teachers")

            .select("id", {
                count: "exact",
                head: true
            });


        if (teacherError) {

            console.error(
                "Teachers Count Error:",
                teacherError
            );

            throw teacherError;

        }


        document.getElementById(
            "teacherCount"
        ).textContent = teacherCount ?? 0;


        // =====================================
        // ATTENDANCE RECORDS COUNT
        // =====================================

        const {
            count: attendanceCount,
            error: attendanceError
        } = await supabaseClient

            .from("attendance")

            .select("id", {
                count: "exact",
                head: true
            });


        if (attendanceError) {

            console.error(
                "Attendance Count Error:",
                attendanceError
            );

            throw attendanceError;

        }


        document.getElementById(
            "attendanceCount"
        ).textContent = attendanceCount ?? 0;


        // =====================================
        // SUCCESS
        // =====================================

        console.log(
            "Admin Statistics Loaded Successfully"
        );

        console.log(
            "Students:",
            studentCount
        );

        console.log(
            "Teachers:",
            teacherCount
        );

        console.log(
            "Attendance:",
            attendanceCount
        );

    }


    catch (error) {

        console.error(
            "Admin Statistics Error:",
            error
        );


        // =====================================
        // SHOW ERROR
        // =====================================

        document.getElementById(
            "studentCount"
        ).textContent = "—";


        document.getElementById(
            "teacherCount"
        ).textContent = "—";


        document.getElementById(
            "attendanceCount"
        ).textContent = "—";

    }

}