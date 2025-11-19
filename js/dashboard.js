if (!localStorage.getItem("usuarioActual")) {
    window.location.href = "../autenticacion/login.html";
}

document.addEventListener("DOMContentLoaded", () => {
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

    const btnCerrarSesion = document.getElementById("btnCerrarSesion");

    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", () => {
            localStorage.removeItem("usuarioActual");
            window.location.href = "../autenticacion/login.html";
        });
    }

    const themeBtn = document.getElementById("btnTheme");

    if (themeBtn) {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            document.body.classList.add("dark-mode");
        }

        themeBtn.addEventListener("click", () => {
            const isDark = document.body.classList.toggle("dark-mode");
            localStorage.setItem("theme", isDark ? "dark" : "light");
        });
    }
});
