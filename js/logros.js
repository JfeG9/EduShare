document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();

    const userName = localStorage.getItem("usuario") || "Juan";
    const nameSpan = document.querySelector(".user-info span");
    if (nameSpan) nameSpan.textContent = userName;

    const btnSalir = document.querySelector("#btnSalir");
    if (btnSalir) {
        btnSalir.addEventListener("click", () => {
            if (confirm("¿Quieres salir?")) {
                window.location.href = "../../index.html";
            }
        });
    }
});
