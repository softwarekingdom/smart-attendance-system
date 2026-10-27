/// =====================================
// AI SCHOOL
// Login System
// Supabase Teacher Login
// Version 4.0
// =====================================


// =====================================
// PAGE LOAD
// =====================================

window.addEventListener("load", function () {

    checkLoginLock();

    loadRememberedUser();

});


// =====================================
// LOGIN
// =====================================

async function login() {

    // ===============================
    // CHECK LOGIN LOCK
    // ===============================

    if (checkLoginLock()) {

        return;

    }


    // ===============================
    // GET LOGIN FIELDS
    // ===============================

    const usernameElement =
        document.getElementById("username");

    const passwordElement =
        document.getElementById("password");


    if (
        !usernameElement ||
        !passwordElement
    ) {

        alert(
            "❌ Login fields not found."
        );

        return;

    }


    const username =
        usernameElement.value.trim();

    const password =
        passwordElement.value.trim();


    const rememberElement =
        document.getElementById("rememberMe");


    const remember =
        rememberElement
            ? rememberElement.checked
            : false;


    // ===============================
    // EMPTY FIELDS
    // ===============================

    if (
        username === "" ||
        password === ""
    ) {

        alert(
            "Please enter username and password."
        );

        return;

    }


    // =====================================
    // ADMIN LOGIN
    // =====================================

    const adminPassword =
        localStorage.getItem(
            "adminPassword"
        ) || "12345";


    if (
        username === "admin" &&
        password === adminPassword
    ) {

        const adminUser = {

            name:
                "Administrator",

            username:
                "admin",

            role:
                "admin"

        };


        localStorage.setItem(
            "currentUser",
            JSON.stringify(adminUser)
        );


        localStorage.setItem(
            "userRole",
            "admin"
        );


        // =============================
        // REMEMBER ADMIN
        // =============================

        if (remember) {

            localStorage.setItem(
                "rememberUser",
                JSON.stringify({
                    username: "admin"
                })
            );

        }
        else {

            localStorage.removeItem(
                "rememberUser"
            );

        }


        resetLoginAttempt();


        alert(
            "✅ Admin Login Successful"
        );


        window.location.href =
            "admin.html";


        return;

    }


    // =====================================
    // TEACHER LOGIN - SUPABASE
    // =====================================

    try {

        // =============================
        // CHECK SUPABASE CONNECTION
        // =============================

        if (
            typeof supabaseClient ===
            "undefined"
        ) {

            console.error(
                "supabaseClient is not defined."
            );


            alert(
                "❌ Supabase connection not found."
            );

            return;

        }


        // =============================
        // FIND TEACHER
        // =============================

        const {
            data: teacher,
            error
        } =
            await supabaseClient
                .from("teachers")
                .select(
                    "*"
                )
                .eq(
                    "username",
                    username
                )
                .maybeSingle();


        // =============================
        // SUPABASE ERROR
        // =============================

        if (error) {

            console.error(
                "Teacher Login Error:",
                error
            );


            alert(
                "❌ Unable to login.\n\n" +
                error.message
            );

            return;

        }


        // =============================
        // TEACHER NOT FOUND
        // =============================

        if (!teacher) {

            increaseLoginAttempt();


            alert(
                "❌ Invalid Username or Password"
            );

            return;

        }


        // =============================
        // CHECK PASSWORD
        // =============================

        if (
            String(
                teacher.password
            ) !== String(password)
        ) {

            increaseLoginAttempt();


            alert(
                "❌ Invalid Username or Password"
            );

            return;

        }


        // =============================
        // CHECK ACCOUNT STATUS
        // =============================

        if (
            teacher.status &&
            String(
                teacher.status
            ).toLowerCase() !==
            "active"
        ) {

            alert(
                "🔒 This teacher account is inactive."
            );

            return;

        }


        // =====================================
        // GET TEACHER CLASSES
        // =====================================

        let teacherClasses = [];


        if (
            Array.isArray(
                teacher.classes
            )
        ) {

            teacherClasses =
                teacher.classes;

        }


        // =====================================
        // CREATE CURRENT TEACHER
        // =====================================

        const currentTeacher = {

            id:
                teacher.id,

            name:
                teacher.name || "",

            username:
                teacher.username || "",

            phone:
                teacher.phone || "",

            email:
                teacher.email || "",

            subject:
                teacher.subject || "",

            role:
                "teacher",

            status:
                teacher.status || "Active",

            classes:
                teacherClasses

        };


        // =====================================
        // SAVE CURRENT USER
        // =====================================

        localStorage.setItem(
            "currentUser",
            JSON.stringify(
                currentTeacher
            )
        );


        localStorage.setItem(
            "userRole",
            "teacher"
        );


        // =====================================
        // REMEMBER ME
        // =====================================

        if (remember) {

            localStorage.setItem(
                "rememberUser",
                JSON.stringify({
                    username:
                        currentTeacher.username
                })
            );

        }
        else {

            localStorage.removeItem(
                "rememberUser"
            );

        }


        // =====================================
        // RESET LOGIN ATTEMPTS
        // =====================================

        resetLoginAttempt();


        // =====================================
        // LOGIN SUCCESS
        // =====================================

        alert(
            "✅ Teacher Login Successful"
        );


        window.location.href =
            "dashboard.html";

    }


    catch (error) {

        console.error(
            "Unexpected Teacher Login Error:",
            error
        );


        alert(
            "❌ Something went wrong while logging in.\n\n" +
            error.message
        );

    }

}


// =====================================
// LOGIN LOCK
// =====================================

function checkLoginLock() {

    const lockTime =
        localStorage.getItem(
            "loginLockTime"
        );


    if (!lockTime) {

        return false;

    }


    const remaining =
        Number(lockTime) -
        Date.now();


    if (
        remaining > 0
    ) {

        const minutes =
            Math.ceil(
                remaining /
                60000
            );


        alert(

            "🔒 Login Locked\n\n" +

            "Try again after " +

            minutes +

            " minute(s)."

        );


        return true;

    }


    // ===============================
    // LOCK EXPIRED
    // ===============================

    localStorage.removeItem(
        "loginLockTime"
    );


    localStorage.removeItem(
        "loginAttempts"
    );


    return false;

}


// =====================================
// INCREASE LOGIN ATTEMPTS
// =====================================

function increaseLoginAttempt() {

    let attempts =
        Number(
            localStorage.getItem(
                "loginAttempts"
            )
        ) || 0;


    attempts++;


    localStorage.setItem(
        "loginAttempts",
        attempts
    );


    // ===============================
    // LOCK AFTER 5 ATTEMPTS
    // ===============================

    if (
        attempts >= 5
    ) {

        localStorage.setItem(

            "loginLockTime",

            Date.now() +
            (
                5 *
                60 *
                1000
            )

        );


        alert(

            "🔒 Too many failed attempts.\n\n" +
            "Login locked for 5 minutes."

        );

    }

}


// =====================================
// RESET LOGIN ATTEMPTS
// =====================================

function resetLoginAttempt() {

    localStorage.removeItem(
        "loginAttempts"
    );


    localStorage.removeItem(
        "loginLockTime"
    );

}


// =====================================
// LOAD REMEMBERED USER
// =====================================

function loadRememberedUser() {

    const saved =
        localStorage.getItem(
            "rememberUser"
        );


    if (!saved) {

        return;

    }


    try {

        const user =
            JSON.parse(
                saved
            );


        const usernameElement =
            document.getElementById(
                "username"
            );


        if (
            usernameElement
        ) {

            usernameElement.value =
                user.username || "";

        }


        const rememberElement =
            document.getElementById(
                "rememberMe"
            );


        if (
            rememberElement
        ) {

            rememberElement.checked =
                true;

        }

    }


    catch (error) {

        console.error(
            "Remember User Error:",
            error
        );


        localStorage.removeItem(
            "rememberUser"
        );

    }

}