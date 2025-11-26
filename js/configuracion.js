if (!localStorage.getItem("usuarioActual")) {
    window.location.href = "../autenticacion/login.html";
}

const toggleThemeBtn = document.getElementById("toggleTheme");

function aplicarTemaGuardado() {
    const tema = localStorage.getItem("theme") || "light";
    if (tema === "dark") {
        document.body.classList.add("dark-mode");
        toggleThemeBtn.textContent = "🌙";
    } else {
        document.body.classList.remove("dark-mode");
        toggleThemeBtn.textContent = "☀️";
    }
}

aplicarTemaGuardado();

toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const esOscuro = document.body.classList.contains("dark-mode");
    localStorage.setItem("tema", esOscuro ? "oscuro" : "claro");
    toggleThemeBtn.textContent = esOscuro ? "🌙" : "☀️";
});

const formCambiar = document.getElementById("form-cambiar");
const estadoCambiar = document.getElementById("estado-cambiar");

const formEliminar = document.getElementById("form-eliminar");
const estadoEliminar = document.getElementById("estado-eliminar");

formCambiar.addEventListener("submit", (e) => {
    e.preventDefault();
    const actual = document.getElementById("actual").value.trim();
    const nueva = document.getElementById("nueva").value.trim();
    const confirmar = document.getElementById("confirmar").value.trim();

    if (!actual || !nueva || !confirmar) {
        estadoCambiar.textContent = "Por favor, completa todos los campos.";
        estadoCambiar.className = "status error";
        return;
    }

    if (nueva.length < 6) {
        estadoCambiar.textContent =
            "La nueva contraseña debe tener al menos 6 caracteres.";
        estadoCambiar.className = "status error";
        return;
    }

    if (nueva !== confirmar) {
        estadoCambiar.textContent = "Las contraseñas no coinciden.";
        estadoCambiar.className = "status error";
        return;
    }

    const usuarioActual = localStorage.getItem("usuarioActual");

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const contrasenaActual = usuarios[usuarioActual].contrasena;

    if (actual !== contrasenaActual) {
        estadoCambiar.textContent = "La contraseña actual es incorrecta.";
        estadoCambiar.className = "status error";
        return;
    }
    usuarios[usuarioActual].contrasena = nueva;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    estadoCambiar.textContent = "Contraseña actualizada correctamente.";
    estadoCambiar.className = "status ok";
    formCambiar.reset();
});

formEliminar.addEventListener("submit", (e) => {
    e.preventDefault();
    const texto = document.getElementById("confirmar-eliminar").value.trim();

    if (texto !== "ELIMINAR") {
        estadoEliminar.textContent =
            "Debes escribir exactamente ELIMINAR para continuar.";
        estadoEliminar.className = "status error";
        return;
    }

    const confirmar = window.confirm(
        "¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es permanente."
    );

    if (!confirmar) return;

    estadoEliminar.textContent = "Tu cuenta ha sido marcada para eliminación.";
    estadoEliminar.className = "status ok";
    let usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

    const usuarioActual = localStorage.getItem("usuarioActual");
    delete usuarios[usuarioActual];
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.removeItem("usuarioActual");

    setTimeout(() => {
        window.location.href = "../../index.html";
    }, 2000);
    formEliminar.reset();
});
