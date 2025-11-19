document.addEventListener("DOMContentLoaded", () => {
    const themeBtn = document.getElementById("btnTheme");
    aplicarTemaGuardado();
    if (themeBtn) {
        actualizarIcono(themeBtn);

        themeBtn.addEventListener("click", () => {
            const dark = document.body.classList.toggle("dark-mode");
            localStorage.setItem("theme", dark ? "dark" : "light");
            actualizarIcono(themeBtn);
        });
    }

    const form = document.getElementById("loginForm");
    const msg = document.getElementById("errorMsg");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document
            .getElementById("confirmPassword")
            .value.trim();

        const resultado = registrarse(nombre, password, confirmPassword, email);

        msg.textContent = resultado.mensaje;
        msg.style.display = "block";
        msg.style.backgroundColor = resultado.ok ? "#2ecc71" : "#e74c3c";

        setTimeout(() => {
            msg.style.display = "none";
        }, 3000);

        if (resultado.ok) {
            form.reset();

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1200);
        }
    });
});

function registrarse(usuario, contrasena, confirmarContrasena, email) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};

    if (!usuario || !email || !contrasena || !confirmarContrasena) {
        return {
            ok: false,
            mensaje: "Por favor completa todos los campos.",
        };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { ok: false, mensaje: "Correo electrónico no válido." };
    }

    if (contrasena.length < 6) {
        return {
            ok: false,
            mensaje: "La contraseña debe tener mínimo 6 caracteres.",
        };
    }

    if (contrasena !== confirmarContrasena) {
        return {
            ok: false,
            mensaje: "Las contraseñas no coinciden.",
        };
    }

    if (usuarios[email]) {
        return {
            ok: false,
            mensaje: "Este correo electrónico ya está registrado.",
        };
    }

    usuarios[email] = {
        usuario,
        contrasena,
        email,
    };

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    return {
        ok: true,
        mensaje: "Registro exitoso.",
    };
}

function aplicarTemaGuardado() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }
}

function actualizarIcono(btn) {
    const dark = document.body.classList.contains("dark-mode");
    btn.textContent = dark ? "☀️" : "🌙";
}
