

const email = document.querySelector("#email");
const phone = document.querySelector("#phone");


email.addEventListener("input",()=>{

    if(email.value){

        phone.removeAttribute("required");

    }

});


phone.addEventListener("input",()=>{

    if(phone.value){

        email.removeAttribute("required");

    }

});
