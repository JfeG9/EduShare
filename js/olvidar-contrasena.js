const form = document.getElementById("formLogin");
const emailInput = document.getElementById("email");
const errorMsg = document.getElementById("errorMsg");
const successMsg = document.getElementById("successMsg");

aplicarTemaGuardado();

function aplicarTemaGuardado() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }
}

const themeBtn = document.getElementById("btnTheme");

function actualizarIcono() {
    const dark = document.body.classList.contains("dark-mode");
    if (themeBtn) themeBtn.textContent = dark ? "☀️" : "🌙";
}

if (themeBtn) {
    actualizarIcono();
    themeBtn.addEventListener("click", () => {
        const dark = document.body.classList.toggle("dark-mode");
        localStorage.setItem("theme", dark ? "dark" : "light");
        actualizarIcono();
    });
}

const logo = document.getElementById("logo");
logo.addEventListener("click", () => {
    window.location.href = "../../index.html";
});

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formRecuperar");
    const emailInput = document.getElementById("email");
    const msg = document.getElementById("msgRecuperar");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        mostrarMensaje(
            "Si existe una cuenta asociada a este correo, hemos enviado instrucciones para recuperar tu contraseña.",
            true
        );
    });

    function mostrarMensaje(texto, exito) {
        msg.textContent = texto;
        msg.style.display = "block";
        msg.style.backgroundColor = exito ? "#2ecc71" : "#e74c3c";

        setTimeout(() => {
            msg.style.display = "none";
        }, 3000);
    }
});
