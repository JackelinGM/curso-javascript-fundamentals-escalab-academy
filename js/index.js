const formulario = document.querySelector("#formulario-contacto");
const botonEnviar = document.querySelector(".btn-enviar");

const nameContact = document.getElementsByName("name_contact")[0];
const email = document.getElementsByName("email_contact")[0];
const phone = document.getElementsByName("phone_contact")[0];
const topic = document.getElementById("topic_contact");
const commit = document.getElementsByName("commit_contact")[0];

const errorList = document.getElementById("errors");

function showError(element, message) {
element.classList.toggle("error");
errorList.innerHTML += `<li>${message}</li>`;
}

function cleanErrors() {
  errorList.innerHTML = "";
}

//haciendo llamado a la api
async function sendMail(name, email, phone, select, comment) {
  const rawResponse = await fetch("https://30kd6edtfc.execute-api.us-east-1.amazonaws.com/prod/send-email", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, phone, select, comment }),
  });
  const content = await rawResponse.json();
  console.log(content);
}
// trim espacios en blanco desaparecen

botonEnviar.addEventListener("click", (event) => {
  event.preventDefault();
  cleanErrors();
  let hasErrors = false;

  const sanitizedName = nameContact.value.trim();
  if (sanitizedName.length === 0 || sanitizedName.indexOf(" ") < 0) {
    showError(
      nameContact,
      "El nombre y apellido no debe estar vacio y debe contener al menos un espacio"
    );
    hasErrors = true;
  }

  //cramos@escalab.academy
  const mailRe = /^\w+@\w+\.\w{2,7}$/;
  if (!mailRe.exec(email.value)) {
    showError(email, "Debe seguir un formato valido");
    hasErrors = true;
  }
  const phoneRe = /^\+?\d{7,15}$/;
  const sanitizedPhone = phone.value.replace(" ", "");
  if (!phoneRe.exec(sanitizedPhone)) {
    showError(phone, " Número de teléfono debe tener entre 7 y 15 dígitos.");
    hasErrors = true;
  }

  const sanitizedCommit = commit.value.trim();
  if (sanitizedCommit.length < 20) {
    showError(
      commit,
      "El mensaje debe ser al menos de 20 caracteres de largo-"
    );
    hasErrors = true;
  }

  if (!hasErrors) {
    sendMail(
      sanitizedName,
      email.value,
      sanitizedPhone,
      topic.value,
      sanitizedCommit
    );
  }
});
