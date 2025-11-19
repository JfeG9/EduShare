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
});
