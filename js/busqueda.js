if (!localStorage.getItem("usuarioActual")) {
    window.location.href = "../autenticacion/login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("search-form");
    const input = document.getElementById("search-input");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const query = input.value.trim();
        if (!query) {
            alert("Ingresa un término de búsqueda.");
            return;
        }
        alert("Buscando: " + query);
    });

    const usuarioId = localStorage.getItem("usuarioActual");
    const usuariosGuardados = localStorage.getItem("usuarios");

    let usuarios = {};
    try {
        usuarios = JSON.parse(usuariosGuardados) || {};
    } catch (e) {
        console.error("Error parseando usuarios en localStorage", e);
    }

    const datosUsuario = usuarios[usuarioId];
    const nombre = document.getElementById("username");

    if (nombre && datosUsuario && datosUsuario.usuario) {
        nombre.textContent = datosUsuario.usuario;
    }

    nombre.addEventListener("click", () => {
        window.location.href = "../utilidades/dashboard.html";
    });

    const btnUsuario = document.getElementById("user-profile");
    btnUsuario.addEventListener("click", () => {
        window.location.href = "../utilidades/dashboard.html";
    });

    const btnExit = document.getElementById("btn-exit");
    btnExit.addEventListener("click", () => {
        window.location.href = "../utilidades/dashboard.html";
    });
});

const themeBtn = document.getElementById("btnTheme");

function aplicarTemaGuardado() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }
}

function actualizarIcono() {
    if (!themeBtn) return;
    const dark = document.body.classList.contains("dark-mode");
    themeBtn.textContent = dark ? "☀️" : "🌙";
}

aplicarTemaGuardado();
actualizarIcono();

if (themeBtn) {
    themeBtn.addEventListener("click", () => {
        const dark = document.body.classList.toggle("dark-mode");
        localStorage.setItem("theme", dark ? "dark" : "light");
        actualizarIcono();
    });
}
