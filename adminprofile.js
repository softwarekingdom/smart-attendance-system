// =====================================
// Admin Profile System
// adminprofile.js
// =====================================


document.addEventListener(

"DOMContentLoaded",

loadAdminProfile

);





function loadAdminProfile(){



let admin = JSON.parse(

localStorage.getItem("currentUser")

);





let box = document.getElementById(

"adminProfile"

);





if(!admin || !box){


return;


}





box.innerHTML = `


<h2>
👤 ${admin.name}
</h2>


<p>
🆔 Username :
${admin.username}
</p>


<p>
🔐 Role :
${admin.role}
</p>


<p>
⚙️ Account Type :
Administrator
</p>


`;



}