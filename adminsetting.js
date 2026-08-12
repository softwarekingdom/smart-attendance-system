// =====================================
// Admin Password Change
// =====================================



function changePassword(){


let oldPassword =

document.getElementById(
"oldPassword"
).value;



let newPassword =

document.getElementById(
"newPassword"
).value;



let confirmPassword =

document.getElementById(
"confirmPassword"
).value;





let adminPassword =

localStorage.getItem(
"adminPassword"
);



// First Time Default Password


if(!adminPassword){

    adminPassword = "12345";

}




if(oldPassword !== adminPassword){


alert(
"Old Password Incorrect"
);


return;


}





if(newPassword !== confirmPassword){


alert(
"Passwords do not match"
);


return;


}





localStorage.setItem(

"adminPassword",

newPassword

);



alert(

"Password Changed Successfully"

);



window.location.href =
"admin.html";


}