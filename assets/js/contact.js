function sendEmail(event){
event.preventDefault();

const inputName = document.getElementById("nama").value;
const inputEmail = document.getElementById("email").value;
const inputTelpon = document.getElementById("phone").value;
const inputSubject = document.getElementById("job").value;
const inputMessage = document.getElementById("message").value;

const link = document.createElement("a");

link.href = `mailto:schamlos12@gmail.com?subject=${inputSubject}&body=Nama:${inputName}%0D%0ANomor HP: ${inputTelpon}%0D%0AMessage: ${inputMessage}`

console.log({
    "Nama": inputName,
    "Email": inputEmail,
    "No HP": inputTelpon,
    "Subject": inputSubject,
    "Message": inputMessage
});

window.location.href = link;
event.target.reset();
};