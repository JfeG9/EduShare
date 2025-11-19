document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formRecuperar");
    const emailInput = document.getElementById("email");
    const msg = document.getElementById("msgRecuperar");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = emailInput.value.trim();
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};

        if (!email) {
            mostrarMensaje(
                "Por favor, introduce tu correo electrónico.",
                false
            );
            return;
        }

        mostrarMensaje(
            "Si existe una cuenta asociada a este correo, hemos enviado instrucciones para recuperar tu contraseña.",
            true
        );
    });

    function mostrarMensaje(texto, exito) {
        msg.textContent = texto;
        msg.style.display = "block";
        msg.style.backgroundColor = exito ? "#2ecc71" : "#e74c3c";

        setTimeout(() => {
            msg.style.display = "none";
        }, 3000);
    }
});
