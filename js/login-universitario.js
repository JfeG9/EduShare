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

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();

    errorMsg.style.display = "none";
    successMsg.style.display = "none";

    if (email === "") {
        errorMsg.textContent = "Por favor ingresa tu correo universitario.";
        errorMsg.style.display = "block";
        setTimeout(() => {
            errorMsg.style.display = "none";
        }, 3000);
        return;
    }

    successMsg.textContent = `Se ha enviado un correo a ${email} para iniciar sesión.`;
    successMsg.style.display = "block";

    setTimeout(() => {
        successMsg.style.display = "none";
    }, 3000);
});
