function checkTeacher(){


    let role =

    localStorage.getItem(
        "userRole"
    );



    if(role !== "teacher"){


        window.location.href =
        "teacher login.html";


    }


}