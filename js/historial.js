document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

   
    if (window.lucide && lucide.createIcons) {
        lucide.createIcons();
    }
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
