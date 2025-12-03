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
    const nombreTop = document.getElementById("usernameTop");

    if (datosUsuario && datosUsuario.usuario) {
        if (nombre) nombre.textContent = datosUsuario.usuario;
        if (nombreTop) nombreTop.textContent = datosUsuario.usuario;
    }

    // =======================================
    // 3. Cerrar sesión
    // =======================================
    const btnCerrarSesion = document.getElementById("btnCerrarSesion");
    btnCerrarSesion?.addEventListener("click", () => {
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
    btnSettings?.addEventListener("click", () => {
        window.location.href = "../usuario/configuracion.html";
    });

    // =======================================
    // 6. Botón logo
    // =======================================
    const logoImg = document.getElementById("logoImage");
    logoImg?.addEventListener("click", () => {
        window.location.href = "../../index.html";
    });

    // =======================================
    // 7. VISOR DE PDF (MINIATURA + MODAL) — MANTENIENDO TU LÓGICA ORIGINAL
    // =======================================
    const pdfUploader = document.getElementById("pdfUploader");
    const pdfViewer = document.getElementById("pdfViewer");
    const thumbnailCanvas = document.getElementById("pdfThumbnailCanvas");
    const thumbnailContainer = document.getElementById("pdfThumbnailContainer");
    const pdfModal = document.getElementById("pdfModal");
    const closePdfModal = document.getElementById("closePdfModal");
    const pdfDownload = document.getElementById("pdfDownload");

    // Cargar PDF guardado
    const savedPDF = localStorage.getItem("pdfGuardado");
    if (savedPDF) {
        pdfViewer.src = savedPDF;
        pdfDownload.href = savedPDF;
        renderThumbnail(savedPDF);
    }

    // Subir nuevo PDF
    pdfUploader?.addEventListener("change", () => {
        const file = pdfUploader.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64PDF = e.target.result;
            localStorage.setItem("pdfGuardado", base64PDF);

            pdfViewer.src = base64PDF;
            pdfDownload.href = base64PDF;

            renderThumbnail(base64PDF);
        };
        reader.readAsDataURL(file);
    });

    // Renderizar miniatura en el canvas
    function renderThumbnail(pdfData) {
        pdfjsLib.getDocument(pdfData).promise.then((pdf) => {
            pdf.getPage(1).then((page) => {
                const scale = 0.25;
                const viewport = page.getViewport({ scale });

                const canvas = thumbnailCanvas;
                const context = canvas.getContext("2d");

                canvas.width = viewport.width;
                canvas.height = viewport.height;

                page.render({
                    canvasContext: context,
                    viewport: viewport,
                });
            });
        });
    }

    // Abrir modal al hacer click en la miniatura
    thumbnailContainer?.addEventListener("click", () => {
        if (!localStorage.getItem("pdfGuardado")) return;
        pdfModal.style.display = "flex";
    });

    // Cerrar modal
    closePdfModal?.addEventListener("click", () => {
        pdfModal.style.display = "none";
    });

    // Cerrar modal haciendo click afuera
    pdfModal?.addEventListener("click", (e) => {
        if (e.target === pdfModal) {
            pdfModal.style.display = "none";
        }
    });
});