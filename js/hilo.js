// ==============================
// 1. Validar sesión
// ==============================
if (!localStorage.getItem("usuarioActual")) {
    window.location.href = "../autenticacion/login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    // ==============================
    // 2. Cargar usuario
    // ==============================
    const usuarioId = localStorage.getItem("usuarioActual");
    const usuariosGuardados =
        JSON.parse(localStorage.getItem("usuarios")) || {};
    const datosUsuario = usuariosGuardados[usuarioId];

    const usernameTop = document.getElementById("usernameTop");
    if (datosUsuario && datosUsuario.usuario) {
        usernameTop.textContent = datosUsuario.usuario;
    }

    // ==============================
    // 3. Cerrar sesión
    // ==============================
    document
        .getElementById("btnCerrarSesion")
        ?.addEventListener("click", () => {
            localStorage.removeItem("usuarioActual");
            window.location.href = "../../index.html";
        });

    // ==============================
    // 4. UI del sidebar
    // ==============================
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    const sidebarClose = document.getElementById("sidebarClose");
    const sidebarBackdrop = document.getElementById("sidebarBackdrop");

    function openSidebar() {
        sidebar.classList.add("open");
        sidebarBackdrop.classList.add("visible");
    }
    function closeSidebar() {
        sidebar.classList.remove("open");
        sidebarBackdrop.classList.remove("visible");
    }

    menuToggle?.addEventListener("click", openSidebar);
    sidebarClose?.addEventListener("click", closeSidebar);
    sidebarBackdrop?.addEventListener("click", closeSidebar);

    // ==============================
    // 5. Menú usuario
    // ==============================
    const userMenuToggle = document.getElementById("userMenuToggle");
    const userDropdown = document.getElementById("userDropdown");

    userMenuToggle?.addEventListener("click", (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle("open");
    });

    document.addEventListener("click", (e) => {
        if (!userMenuToggle.contains(e.target)) {
            userDropdown.classList.remove("open");
        }
    });

    // ==============================
    // 6. Inicializar iconos
    // ==============================
    if (window.lucide) lucide.createIcons();

    const themeToggle = document.getElementById("themeToggle");

    // Aplicar tema guardado al cargar
    const savedTheme = localStorage.getItem("theme");
    const isDarkSaved = savedTheme === "dark";
    if (isDarkSaved) {
        document.body.classList.add("dark-mode");
    }

    if (themeToggle) {
        themeToggle.checked = isDarkSaved;

        themeToggle.addEventListener("change", () => {
            const useDark = themeToggle.checked;
            document.body.classList.toggle("dark-mode", useDark);
            localStorage.setItem("theme", useDark ? "dark" : "light");
        });
    }

    // ==============================
    // 7. LÓGICA DEL FORO
    // ==============================
    const emptyState = document.getElementById("emptyState");
    const listaMensajesContainer = document.getElementById("listaMensajes");
    const replyForm = document.getElementById("replyForm");
    const replyText = document.getElementById("replyText");

    // --- A) Cargar mensajes guardados
    let mensajes = JSON.parse(localStorage.getItem("foroMensajes")) || [];

    function mostrarMensajes() {
        listaMensajesContainer.innerHTML = "";

        if (mensajes.length === 0) {
            emptyState.style.display = "flex";
            return;
        }

        emptyState.style.display = "none";

        mensajes.forEach((msg) => {
            const card = document.createElement("article");
            card.classList.add("thread-card");

            card.innerHTML = `
        <div class="thread-card-header">
          <div class="thread-avatar">${msg.autorNombre[0].toUpperCase()}</div>
          <div>
            <p class="thread-author">${msg.autorNombre}</p>
            <p class="thread-date">${msg.fecha}</p>
          </div>
        </div>

        <p class="thread-message">${msg.mensaje}</p>
      `;

            listaMensajesContainer.appendChild(card);
        });
    }

    mostrarMensajes();

    // --- B) Guardar nuevo mensaje
    replyForm?.addEventListener("submit", (e) => {
        e.preventDefault();

        const texto = replyText.value.trim();
        if (!texto) return;

        const nuevoMensaje = {
            id: "msg_" + Date.now(),
            autorId: usuarioId,
            autorNombre: datosUsuario.usuario,
            mensaje: texto,
            fecha: new Date().toLocaleString("es-PE"),
        };

        mensajes.push(nuevoMensaje);

        localStorage.setItem("foroMensajes", JSON.stringify(mensajes));

        replyText.value = "";
        mostrarMensajes();
    });

    // --- C) Limpiar
    document
        .getElementById("btnCancelarRespuesta")
        ?.addEventListener("click", () => {
            replyText.value = "";
        });
});
