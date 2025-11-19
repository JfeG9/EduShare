const btnLogin = document.getElementById("btnLogin");

btnLogin.addEventListener("click", function (event) {
    event.preventDefault();

    const form = document.getElementById("formLogin");
    const formData = new FormData(form);
    const email = formData.get("email").trim();
    const contrasena = formData.get("contrasena").trim();
    const errorMsg = document.getElementById("errorMsg");

    if (email === "" || contrasena === "") {
        errorMsg.textContent = "Por favor, complete todos los campos.";
        errorMsg.style.display = "block";

        setTimeout(() => {
            errorMsg.style.display = "none";
        }, 3000);

        return;
    }

    errorMsg.style.display = "none";

    if (login(email, contrasena)) {
        window.location.href = "../busqueda/filtro.html";
    } else {
        errorMsg.textContent = "Correo electrónico o contraseña incorrectos.";
        errorMsg.style.display = "block";

        setTimeout(() => {
            errorMsg.style.display = "none";
        }, 3000);
    }
});

function login(usuario, contrasena) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};

    if (usuarios[usuario] && usuarios[usuario].contrasena === contrasena) {
        localStorage.setItem("usuarioActual", usuario);
        return true;
    } else {
        return false;
    }
}
