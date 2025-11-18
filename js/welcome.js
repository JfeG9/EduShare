document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".welcome-form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value.trim();

        if (!username) {
            alert("Por favor, ingresa tu nombre de usuario.");
            return;
        }

        console.log("Usuario ingresado:", username);

    });
});
