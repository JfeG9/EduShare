document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".toggle").forEach(toggle => {
        toggle.addEventListener("click", () => {
            toggle.classList.toggle("active");
        });
    });

    document.getElementById("btn-exit").addEventListener("click", () => {
        alert("Saliendo de la configuración de notificaciones...");
    });

    document.getElementById("btn-save").addEventListener("click", () => {
        alert("Cambios guardados.");
    });
});
