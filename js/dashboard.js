if (!localStorage.getItem("usuarioActual")) {
    window.location.href = "../autenticacion/login.html";
}

const usuario = localStorage.getItem("usuarioActual");
const usuarios = JSON.parse(localStorage.getItem("usuarios"));

const nombre = document.getElementById("username");

const username = usuarios[usuario]["usuario"];

nombre.textContent = username;

const btnCerrarSesion = document.getElementById("btnCerrarSesion");

btnCerrarSesion.addEventListener("click", function () {
    localStorage.removeItem("usuarioActual");
    window.location.href = "../autenticacion/login.html";
});
