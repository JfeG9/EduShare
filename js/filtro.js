usuario = localStorage.getItem("usuarioActual");

if (!usuario) {
    window.location.href = "../autenticacion/login.html";
}
