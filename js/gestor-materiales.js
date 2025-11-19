document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();

    const isPaginaCrear = document.querySelector(".folder-btn");
    const isPaginaVacio = document.querySelector(".empty-add-btn");
    const isPaginaMateriales = document.querySelector(".folder-pill span");

    // PAGINA CREAR CARPETA
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

            // Después de crear carpeta → IR A LA PÁGINA VACÍA
            window.location.href = "gestor-material-vacio.html";
        });
    }

    // PAGINA VACIO
    if (isPaginaVacio) {
        const btnAgregar = document.querySelector(".empty-add-btn");

        btnAgregar.addEventListener("click", () => {
            // Aquí ya existe la carpeta → ir a página con lista de materiales
            window.location.href = "gestor-materiales.html";
        });
    }

    // PAGINA VER MATERIALES
    if (isPaginaMateriales) {
        const nombreCarpeta = localStorage.getItem("carpetaNombre");

        if (nombreCarpeta) {
            isPaginaMateriales.textContent = nombreCarpeta;
        }
    }

    // Boton Salir
    const btnSalir = document.querySelector(".btn.ghost");
    if (btnSalir) {
        btnSalir.addEventListener("click", () => {
            if (confirm("¿Salir de la pagina ?")) {
                window.location.href = "../../index.html";
            }
        });
    }

    // Botón Subir archivo
    const btnUpload = document.querySelector(".btn.primary");
    if (btnUpload && btnUpload.textContent.includes("Subir")) {
        btnUpload.addEventListener("click", () => {
            alert("Aquí abrirías el selector de archivos.");
        });
    }
});
