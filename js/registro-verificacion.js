document.addEventListener("DOMContentLoaded", () => {
    const btnRegister = document.getElementById("btn-register");
    const btnExit = document.getElementById("btn-exit");
    const nombre = document.getElementById("nombre");
    const apellido = document.getElementById("apellido");
    const correo = document.getElementById("correo");

    btnRegister.addEventListener("click", () => {
        if (!nombre.value.trim() || !apellido.value.trim() || !correo.value.trim()) {
            alert("Complete todos los campos.");
            return;
        }
        alert("Solicitud enviada.");
    });

    btnExit.addEventListener("click", () => {
        alert("Saliendo…");
    });
});
