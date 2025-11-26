document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();

    const isPaginaCrear = document.querySelector(".folder-btn");
    const isPaginaVacio = document.querySelector(".empty-add-btn");
    const isPaginaMateriales = document.querySelector(".folder-pill span");

    if (isPaginaCrear) {
        const input = document.querySelector(".folder-input");
        const btnCrear = document.querySelector(".folder-btn");

        btnCrear.addEventListener("click", () => {
            const nombre = input.value.trim();

            if (nombre === "") {
                alert("Por favor escribe un nombre para la carpeta.");
                return;
            }

            localStorage.setItem("carpetaNombre", nombre);

            window.location.href = "gestor-material-vacio.html";
        });
    }

    if (isPaginaVacio) {
        const btnAgregar = document.querySelector(".empty-add-btn");

        btnAgregar.addEventListener("click", () => {
            window.location.href = "gestor-materiales.html";
        });
    }

    if (isPaginaMateriales) {
        const nombreCarpeta = localStorage.getItem("carpetaNombre");

        if (nombreCarpeta) {
            isPaginaMateriales.textContent = nombreCarpeta;
        }
    }

    const btnSalir = document.querySelector(".btn.ghost");
    if (btnSalir) {
        btnSalir.addEventListener("click", () => {
            if (confirm("¿Salir de la pagina ?")) {
                window.location.href = "../../index.html";
            }
        });
    }

    const btnUpload = document.querySelector(".btn.primary");
    if (btnUpload && btnUpload.textContent.includes("Subir")) {
        btnUpload.addEventListener("click", () => {
            alert("Aquí abrirías el selector de archivos.");
        });
    }
});
