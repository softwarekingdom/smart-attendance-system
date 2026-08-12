function checkAdmin(){


let role =

localStorage.getItem(
"userRole"
);



if(role !== "admin"){


window.location.href =
"teacher login.html";


}


}