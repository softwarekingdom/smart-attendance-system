// =====================================
// AI Attendance Management System
// Institution Settings JS
// Part 1
// =====================================



document.addEventListener(

"DOMContentLoaded",

function(){


loadInstitution();


setupLogoPreview();


setupSignaturePreview();


}

);






// =====================================
// Logo Preview
// =====================================


function setupLogoPreview(){


let logoInput =

document.getElementById(
"institutionLogo"
);



let logoPreview =

document.getElementById(
"logoPreview"
);




if(logoInput){


logoInput.addEventListener(

"change",

function(){


let file = this.files[0];



if(file){


let reader = new FileReader();



reader.onload=function(e){


logoPreview.src=e.target.result;


};



reader.readAsDataURL(file);



}



}


);



}



}
// =====================================
// Signature Preview
// =====================================


function setupSignaturePreview(){



let signatureInput =

document.getElementById(
"principalSignature"
);



let signaturePreview =

document.getElementById(
"signaturePreview"
);




if(signatureInput){



signatureInput.addEventListener(

"change",

function(){



let file=this.files[0];



if(file){



let reader=new FileReader();



reader.onload=function(e){



signaturePreview.src=e.target.result;



};



reader.readAsDataURL(file);



}



}



);



}



}
// =====================================
// Save Institution Information
// Part 3
// =====================================


function saveInstitution(){



let logo =

document.getElementById(
"logoPreview"
).src;




let signature =

document.getElementById(
"signaturePreview"
).src;






let institution = {


name:

document.getElementById(
"institutionName"
).value,



type:

document.getElementById(
"institutionType"
).value,



logo:

logo,



address:

document.getElementById(
"institutionAddress"
).value,



city:

document.getElementById(
"institutionCity"
).value,



postal:

document.getElementById(
"institutionPostal"
).value,



phone:

document.getElementById(
"institutionPhone"
).value,



whatsapp:

document.getElementById(
"institutionWhatsapp"
).value,



email:

document.getElementById(
"institutionEmail"
).value,



principal:

document.getElementById(
"principalName"
).value,



signature:

signature,



motto:

document.getElementById(
"institutionMotto"
).value


};






localStorage.setItem(

"institutionInfo",

JSON.stringify(institution)

);





alert(

"🏫 Institution Information Saved Successfully"

);



}
// =====================================
// Load Institution Information
// Part 4
// =====================================


function loadInstitution(){



let data = JSON.parse(

localStorage.getItem(
"institutionInfo"
)

);




if(!data){

return;

}





document.getElementById(
"institutionName"
).value =

data.name || "";






document.getElementById(
"institutionType"
).value =

data.type || "";







document.getElementById(
"institutionAddress"
).value =

data.address || "";







document.getElementById(
"institutionCity"
).value =

data.city || "";







document.getElementById(
"institutionPostal"
).value =

data.postal || "";







document.getElementById(
"institutionPhone"
).value =

data.phone || "";







document.getElementById(
"institutionWhatsapp"
).value =

data.whatsapp || "";







document.getElementById(
"institutionEmail"
).value =

data.email || "";







document.getElementById(
"principalName"
).value =

data.principal || "";







document.getElementById(
"institutionMotto"
).value =

data.motto || "";









// Load Logo


let logoPreview =

document.getElementById(
"logoPreview"
);



if(

logoPreview && data.logo

){

logoPreview.src=data.logo;


}








// Load Signature


let signaturePreview =

document.getElementById(
"signaturePreview"
);



if(

signaturePreview && data.signature

){

signaturePreview.src=data.signature;


}



}