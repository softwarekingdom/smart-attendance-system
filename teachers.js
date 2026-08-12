// =====================================
// AI SCHOOL
// Teacher Management System
// Supabase Database Version 8.0
// =====================================


// =====================================
// PAGE LOAD
// =====================================

window.addEventListener("load", function () {

    console.log("✅ teachers.js loaded");

    loadTeachers();
    updateTeacherCount();
    loadTeacherDropdown();
    loadClassList();

});


// =====================================
// ADD TEACHER
// =====================================

async function addTeacher() {

    console.log("✅ addTeacher() started");

    const name =
        document.getElementById("teacherName")
        ?.value.trim() || "";

    const username =
        document.getElementById("teacherUsername")
        ?.value.trim() || "";

    const password =
        document.getElementById("teacherPassword")
        ?.value.trim() || "";

    const phone =
        document.getElementById("teacherPhone")
        ?.value.trim() || "";

    const email =
        document.getElementById("teacherEmail")
        ?.value.trim() || "";

    const subject =
        document.getElementById("teacherSubject")
        ?.value.trim() || "";


    // =================================
    // VALIDATION
    // =================================

    if (name === "") {

        alert("Please enter teacher name.");
        return;

    }

    if (username === "") {

        alert("Please enter username.");
        return;

    }

    if (password === "") {

        alert("Please enter password.");
        return;

    }


    // =================================
    // SUPABASE CHECK
    // =================================

    if (
        typeof supabaseClient === "undefined"
    ) {

        alert(
            "❌ Supabase connection not found."
        );

        console.error(
            "supabaseClient is undefined"
        );

        return;

    }


    try {

        // =================================
        // CHECK USERNAME
        // =================================

        const {
            data: existingTeacher,
            error: checkError
        } =
            await supabaseClient
                .from("teachers")
                .select("id")
                .eq("username", username)
                .maybeSingle();


        if (checkError) {

            console.error(
                "Username Check Error:",
                checkError
            );

            alert(
                "❌ Could not check username.\n\n" +
                checkError.message
            );

            return;

        }


        if (existingTeacher) {

            alert(
                "⚠️ Username already exists."
            );

            return;

        }


        // =================================
        // INSERT
        // =================================

        const {
            data,
            error
        } =
            await supabaseClient
                .from("teachers")
                .insert([
                    {

                        name: name,

                        username: username,

                        password: password,

                        phone: phone,

                        email: email,

                        subject: subject,

                        role: "Teacher",

                        status: "Active",

                        classes: []

                    }
                ])
                .select()
                .single();


        // =================================
        // ERROR
        // =================================

        if (error) {

            console.error(
                "Teacher Insert Error:",
                error
            );

            alert(
                "❌ Teacher could not be saved.\n\n" +
                error.message
            );

            return;

        }


        console.log(
            "✅ Teacher saved:",
            data
        );


        // =================================
        // REFRESH
        // =================================

        clearTeacherForm();

        await loadTeachers();

        await updateTeacherCount();

        await loadTeacherDropdown();


        alert(
            "✅ Teacher Added Successfully"
        );

    }


    catch (error) {

        console.error(
            "Unexpected Add Teacher Error:",
            error
        );

        alert(
            "❌ Something went wrong while adding teacher.\n\n" +
            error.message
        );

    }

}


// =====================================
// CLEAR FORM
// =====================================

function clearTeacherForm() {

    const fields = [

        "teacherName",
        "teacherUsername",
        "teacherPassword",
        "teacherPhone",
        "teacherEmail",
        "teacherSubject"

    ];


    fields.forEach(function (id) {

        const element =
            document.getElementById(id);


        if (element) {

            element.value = "";

        }

    });

}


// =====================================
// LOAD TEACHERS
// =====================================

async function loadTeachers() {

    const table =
        document.getElementById(
            "teacherList"
        );


    if (!table) {

        return;

    }


    table.innerHTML = "";


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("teachers")
                .select("*")
                .order(
                    "id",
                    {
                        ascending: true
                    }
                );


        if (error) {

            console.error(
                "Teacher Load Error:",
                error
            );

            table.innerHTML = `

                <tr>

                    <td colspan="8">

                        ❌ Unable to load teachers

                    </td>

                </tr>

            `;

            return;

        }


        const teachers =
            data || [];


        if (
            teachers.length === 0
        ) {

            table.innerHTML = `

                <tr>

                    <td colspan="8">

                        👨‍🏫 No Teachers Found

                    </td>

                </tr>

            `;

            return;

        }


        // =================================
        // DISPLAY
        // =================================

        teachers.forEach(
            function (
                teacher,
                index
            ) {

                const classes =
                    Array.isArray(
                        teacher.classes
                    )
                    ? teacher.classes
                    : [];


                table.innerHTML += `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            ${escapeHTML(
                                teacher.name || "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                teacher.username || "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                teacher.subject || "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                teacher.phone || "-"
                            )}
                        </td>

                        <td>
                            🏫 ${classes.length}
                        </td>

                        <td>
                            🟢 ${escapeHTML(
                                teacher.status || "-"
                            )}
                        </td>

                        <td>

                            <button
                                type="button"
                                onclick="viewTeacher('${teacher.id}')">

                                👁 View

                            </button>

                            <button
                                type="button"
                                onclick="editTeacher('${teacher.id}')">

                                ✏ Edit

                            </button>

                            <button
                                type="button"
                                onclick="deleteTeacher('${teacher.id}')">

                                🗑 Delete

                            </button>

                        </td>

                    </tr>

                `;

            }
        );

    }


    catch (error) {

        console.error(
            "Unexpected Teacher Load Error:",
            error
        );

        table.innerHTML = `

            <tr>

                <td colspan="8">

                    ❌ Unable to load teachers

                </td>

            </tr>

        `;

    }

}


// =====================================
// TEACHER COUNT
// =====================================

async function updateTeacherCount() {

    const box =
        document.getElementById(
            "teacherCount"
        );


    if (!box) {

        return;

    }


    try {

        const {
            count,
            error
        } =
            await supabaseClient
                .from("teachers")
                .select(
                    "*",
                    {
                        count: "exact",
                        head: true
                    }
                );


        if (error) {

            console.error(
                "Teacher Count Error:",
                error
            );

            return;

        }


        box.innerText =
            count || 0;

    }


    catch (error) {

        console.error(
            "Unexpected Count Error:",
            error
        );

    }

}


// =====================================
// SEARCH
// =====================================

function searchTeacher() {

    const input =
        document.getElementById(
            "teacherSearch"
        );


    if (!input) {

        return;

    }


    const value =
        input.value
            .toLowerCase()
            .trim();


    document
        .querySelectorAll(
            "#teacherList tr"
        )
        .forEach(function (row) {

            const text =
                row.innerText
                    .toLowerCase();


            row.style.display =
                text.includes(value)
                ? ""
                : "none";

        });

}


// =====================================
// GET SCHOOL CLASSES
// =====================================

function getClasses() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "schoolClasses"
            )
        ) || [];

    }

    catch (error) {

        console.error(
            "Class Load Error:",
            error
        );

        return [];

    }

}


// =====================================
// LOAD CLASS LIST
// =====================================

function loadClassList() {

    const box =
        document.getElementById(
            "classList"
        );


    if (!box) {

        return;

    }


    const classes =
        getClasses();


    box.innerHTML = "";


    if (
        classes.length === 0
    ) {

        box.innerHTML = `

            <p>
                No Classes Created
            </p>

        `;

        return;

    }


    classes.forEach(
        function (cls) {

            box.innerHTML += `

                <div class="class-item">

                    <label>

                        <input
                            type="checkbox"
                            class="classCheck"
                            value="${escapeHTML(cls)}">

                        🏫 ${escapeHTML(cls)}

                    </label>

                </div>

            `;

        }
    );

}


// =====================================
// TEACHER DROPDOWN
// =====================================

async function loadTeacherDropdown() {

    const select =
        document.getElementById(
            "assignTeacher"
        );


    if (!select) {

        return;

    }


    select.innerHTML = `

        <option value="">
            -- Select Teacher --
        </option>

    `;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("teachers")
                .select(
                    "id,name,username"
                )
                .order(
                    "name",
                    {
                        ascending: true
                    }
                );


        if (error) {

            console.error(
                "Teacher Dropdown Error:",
                error
            );

            return;

        }


        (data || []).forEach(
            function (teacher) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    teacher.username;


                option.textContent =
                    teacher.name;


                select.appendChild(
                    option
                );

            }
        );

    }


    catch (error) {

        console.error(
            "Unexpected Dropdown Error:",
            error
        );

    }

}


// =====================================
// ASSIGN CLASSES
// =====================================

async function assignClasses() {

    const select =
        document.getElementById(
            "assignTeacher"
        );


    if (!select) {

        return;

    }


    const username =
        select.value;


    if (
        username === ""
    ) {

        alert(
            "Please select a teacher."
        );

        return;

    }


    const selectedClasses = [];


    document
        .querySelectorAll(
            ".classCheck:checked"
        )
        .forEach(function (box) {

            selectedClasses.push(
                box.value
            );

        });


    if (
        selectedClasses.length === 0
    ) {

        alert(
            "Please select at least one class."
        );

        return;

    }


    try {

        const {
            data: teacher,
            error: findError
        } =
            await supabaseClient
                .from("teachers")
                .select(
                    "id"
                )
                .eq(
                    "username",
                    username
                )
                .maybeSingle();


        if (findError) {

            console.error(
                "Find Teacher Error:",
                findError
            );

            alert(
                "❌ Could not find teacher.\n\n" +
                findError.message
            );

            return;

        }


        if (!teacher) {

            alert(
                "❌ Teacher not found."
            );

            return;

        }


        const {
            error: updateError
        } =
            await supabaseClient
                .from("teachers")
                .update({

                    classes:
                        selectedClasses

                })
                .eq(
                    "id",
                    teacher.id
                );


        if (updateError) {

            console.error(
                "Assign Classes Error:",
                updateError
            );

            alert(
                "❌ Classes could not be assigned.\n\n" +
                updateError.message
            );

            return;

        }


        await loadTeachers();


        alert(
            "✅ Classes Assigned Successfully"
        );

    }


    catch (error) {

        console.error(
            "Unexpected Assign Class Error:",
            error
        );

        alert(
            "❌ Something went wrong while assigning classes.\n\n" +
            error.message
        );

    }

}


// =====================================
// VIEW TEACHER
// =====================================

async function viewTeacher(id) {

    const popup =
        document.getElementById(
            "teacherProfilePopup"
        );


    const content =
        document.getElementById(
            "teacherProfileContent"
        );


    if (
        !popup ||
        !content
    ) {

        return;

    }


    try {

        const {
            data: teacher,
            error
        } =
            await supabaseClient
                .from("teachers")
                .select("*")
                .eq(
                    "id",
                    id
                )
                .maybeSingle();


        if (error) {

            console.error(
                "View Teacher Error:",
                error
            );

            alert(
                "❌ Unable to load teacher.\n\n" +
                error.message
            );

            return;

        }


        if (!teacher) {

            alert(
                "Teacher Not Found"
            );

            return;

        }


        const classes =
            Array.isArray(
                teacher.classes
            )
            ? teacher.classes
            : [];


        content.innerHTML = `

            <div class="teacher-avatar">
                👨‍🏫
            </div>

            <h2>
                ${escapeHTML(
                    teacher.name || "-"
                )}
            </h2>

            <div class="profile-info">

                <p>
                    👤 Username:
                    ${escapeHTML(
                        teacher.username || "-"
                    )}
                </p>

                <p>
                    📚 Subject:
                    ${escapeHTML(
                        teacher.subject || "-"
                    )}
                </p>

                <p>
                    📱 Phone:
                    ${escapeHTML(
                        teacher.phone || "-"
                    )}
                </p>

                <p>
                    📧 Email:
                    ${escapeHTML(
                        teacher.email || "-"
                    )}
                </p>

                <p>
                    🟢 Status:
                    ${escapeHTML(
                        teacher.status || "-"
                    )}
                </p>

                <h3>
                    🏫 Assigned Classes
                </h3>

                <div>

                    ${
                        classes.length > 0

                        ?

                        classes
                            .map(
                                function (cls) {

                                    return `

                                        <span
                                            class="class-tag">

                                            ${escapeHTML(
                                                cls
                                            )}

                                        </span>

                                    `;

                                }
                            )
                            .join("")

                        :

                        "No Classes Assigned"

                    }

                </div>

            </div>

        `;


        popup.classList.add(
            "active"
        );

    }


    catch (error) {

        console.error(
            "Unexpected View Error:",
            error
        );

        alert(
            "❌ Something went wrong while loading teacher."
        );

    }

}


// =====================================
// CLOSE PROFILE
// =====================================

function closeTeacherProfile() {

    const popup =
        document.getElementById(
            "teacherProfilePopup"
        );


    if (popup) {

        popup.classList.remove(
            "active"
        );

    }

}


// =====================================
// EDIT TEACHER
// =====================================

async function editTeacher(id) {

    try {

        const {
            data: teacher,
            error
        } =
            await supabaseClient
                .from("teachers")
                .select("*")
                .eq(
                    "id",
                    id
                )
                .maybeSingle();


        if (error) {

            console.error(
                "Edit Teacher Load Error:",
                error
            );

            alert(
                "❌ Unable to load teacher.\n\n" +
                error.message
            );

            return;

        }


        if (!teacher) {

            alert(
                "Teacher Not Found"
            );

            return;

        }


        const fields = {

            teacherName:
                teacher.name || "",

            teacherUsername:
                teacher.username || "",

            teacherPassword:
                teacher.password || "",

            teacherPhone:
                teacher.phone || "",

            teacherEmail:
                teacher.email || "",

            teacherSubject:
                teacher.subject || ""

        };


        Object.keys(fields).forEach(
            function (id) {

                const element =
                    document.getElementById(id);


                if (element) {

                    element.value =
                        fields[id];

                }

            }
        );


        localStorage.setItem(
            "editTeacherId",
            String(id)
        );


        alert(
            "✏️ Edit Mode Enabled"
        );

    }


    catch (error) {

        console.error(
            "Unexpected Edit Error:",
            error
        );

        alert(
            "❌ Something went wrong while loading teacher."
        );

    }

}


// =====================================
// UPDATE TEACHER
// =====================================

async function updateTeacher() {

    const id =
        localStorage.getItem(
            "editTeacherId"
        );


    if (!id) {

        alert(
            "⚠️ Please click Edit on a teacher first."
        );

        return;

    }


    const name =
        document.getElementById(
            "teacherName"
        )
        ?.value.trim() || "";

    const username =
        document.getElementById(
            "teacherUsername"
        )
        ?.value.trim() || "";

    const password =
        document.getElementById(
            "teacherPassword"
        )
        ?.value.trim() || "";

    const phone =
        document.getElementById(
            "teacherPhone"
        )
        ?.value.trim() || "";

    const email =
        document.getElementById(
            "teacherEmail"
        )
        ?.value.trim() || "";

    const subject =
        document.getElementById(
            "teacherSubject"
        )
        ?.value.trim() || "";


    if (
        name === "" ||
        username === "" ||
        password === ""
    ) {

        alert(
            "Please fill all required fields."
        );

        return;

    }


    try {

        // =================================
        // UPDATE
        // =================================

        const {
            data,
            error
        } =
            await supabaseClient
                .from("teachers")
                .update({

                    name:
                        name,

                    username:
                        username,

                    password:
                        password,

                    phone:
                        phone,

                    email:
                        email,

                    subject:
                        subject

                })
                .eq(
                    "id",
                    id
                )
                .select()
                .single();


        if (error) {

            console.error(
                "Update Teacher Error:",
                error
            );

            alert(
                "❌ Teacher could not be updated.\n\n" +
                error.message
            );

            return;

        }


        console.log(
            "Teacher Updated:",
            data
        );


        localStorage.removeItem(
            "editTeacherId"
        );


        clearTeacherForm();

        await loadTeachers();

        await updateTeacherCount();

        await loadTeacherDropdown();


        alert(
            "✅ Teacher Updated Successfully"
        );

    }


    catch (error) {

        console.error(
            "Unexpected Update Error:",
            error
        );

        alert(
            "❌ Something went wrong while updating teacher.\n\n" +
            error.message
        );

    }

}


// =====================================
// DELETE TEACHER
// =====================================

async function deleteTeacher(id) {

    const confirmDelete =
        confirm(
            "⚠️ Delete this teacher?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const {
            error
        } =
            await supabaseClient
                .from("teachers")
                .delete()
                .eq(
                    "id",
                    id
                );


        if (error) {

            console.error(
                "Delete Teacher Error:",
                error
            );

            alert(
                "❌ Teacher could not be deleted.\n\n" +
                error.message
            );

            return;

        }


        await loadTeachers();

        await updateTeacherCount();

        await loadTeacherDropdown();


        alert(
            "🗑️ Teacher Deleted Successfully"
        );

    }


    catch (error) {

        console.error(
            "Unexpected Delete Error:",
            error
        );

        alert(
            "❌ Something went wrong while deleting teacher.\n\n" +
            error.message
        );

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
// DEBUG
// =====================================

console.log(
    "✅ AI School teachers.js Version 8.0 loaded"
);
