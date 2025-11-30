// =======================================
// 1. Validar sesión
// =======================================
if (!localStorage.getItem("usuarioActual")) {
    window.location.href = "../autenticacion/login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    // =======================================
    // 2. Cargar datos del usuario
    // =======================================
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

    // =======================================
    // 3. Cerrar sesión
    // =======================================
    const btnCerrarSesion = document.getElementById("btnCerrarSesion");
    btnCerrarSesion.addEventListener("click", () => {
        localStorage.removeItem("usuarioActual");
        window.location.href = "../../index.html";
    });

    // =======================================
    // 4. Tema claro/oscuro
    // =======================================
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

    // =======================================
    // 5. Botón configuración
    // =======================================
    const btnSettings = document.getElementById("btnSettings");
    btnSettings.addEventListener("click", () => {
        window.location.href = "../usuario/configuracion.html";
    });

    // =======================================
    // 6. Botón logo
    // =======================================
    const btnLogo = document.getElementById("logo");
    btnLogo.addEventListener("click", () => {
        window.location.href = "../../index.html";
    });

    // =======================================
    // 7. Visor de PDF con LocalStorage
    // =======================================
    const pdfUploader = document.getElementById("pdfUploader");
    const pdfViewer = document.getElementById("pdfViewer");

    if (pdfUploader && pdfViewer) {
        // Si hay un PDF guardado → mostrarlo al cargar
        const savedPDF = localStorage.getItem("pdfGuardado");
        if (savedPDF) {
            pdfViewer.src = savedPDF;
        }

        // Subir PDF y guardarlo en localStorage
        pdfUploader.addEventListener("change", () => {
            const file = pdfUploader.files[0];
            if (!file) return;

            const reader = new FileReader();

            reader.onload = (e) => {
                const base64PDF = e.target.result;

                localStorage.setItem("pdfGuardado", base64PDF);
                pdfViewer.src = base64PDF;
            };

            reader.readAsDataURL(file);
        });
    }
});
