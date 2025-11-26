document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();

    const nameSpan = document.querySelector(".user-info span");
    const userName = localStorage.getItem("usuario") || "Juan";
    if (nameSpan) nameSpan.textContent = userName;

    const puntaje = document.getElementById("puntaje");
    const resenaInput = document.getElementById("Reseña");
    const btnValidar = document.querySelector(".btn-primary");
    const reviewsWrap = document.querySelector(".reviews-wrap");

    function tiempoRelativo(timestamp) {
        const ahora = Date.now();
        const diff = ahora - timestamp;

        const minutos = Math.floor(diff / 60000);
        const horas = Math.floor(diff / 3600000);
        const dias = Math.floor(diff / 86400000);
        const semanas = Math.floor(diff / 604800000);

        if (minutos < 1) return "Hace unos segundos";
        if (minutos === 1) return "Hace 1 minuto";
        if (minutos < 60) return `Hace ${minutos} minutos`;

        if (horas === 1) return "Hace 1 hora";
        if (horas < 24) return `Hace ${horas} horas`;

        if (dias === 1) return "Hace 1 día";
        if (dias < 7) return `Hace ${dias} días`;

        if (semanas === 1) return "Hace 1 semana";
        return `Hace ${semanas} semanas`;
    }

    function crearTarjetaReview(estrellas, texto, usuario, timestamp = Date.now()) {
        const card = document.createElement("div");
        card.className = "review-card";


        let starsHTML = "";
        for (let i = 0; i < 5; i++) {
            starsHTML += `<i data-lucide="star"></i>`;
        }

        card.innerHTML = `
            <div class="stars">
                ${starsHTML}
            </div>
            <h4>Reseña</h4>
            <p class="review-body">${texto}</p>

            <div class="reviewer">
                <i data-lucide="user"></i>
                <div>
                    <div class="name">${usuario}</div>
                    <div class="date" data-timestamp="${timestamp}">${tiempoRelativo(timestamp)}</div>
                </div>
            </div>
        `;

        const stars = card.querySelectorAll(".stars i");
        for (let i = 0; i < estrellas; i++) {
            stars[i].style.fill = "#111827";
        }

        lucide.createIcons();
        return card;
    }

    function cargarReviews() {
        const guardadas = JSON.parse(localStorage.getItem("valoraciones") || "[]");

        guardadas.forEach(r => {
            const card = crearTarjetaReview(r.puntaje, r.texto, r.usuario, r.timestamp);
            reviewsWrap.appendChild(card);
        });
    }

    setInterval(() => {
    document.querySelectorAll(".review-card").forEach(card => {
        const dateDiv = card.querySelector(".date");
        const timestamp = dateDiv.getAttribute("data-timestamp");

        if (timestamp) {
            dateDiv.textContent = tiempoRelativo(Number(timestamp));
        }
    });
    }, 60000);

    cargarReviews();

    btnValidar.addEventListener("click", () => {
        const texto = resenaInput.value.trim();
        const estrellas = puntaje.selectedIndex + 1;

        if (!texto) {
            alert("Escribe una reseña antes de validar.");
            return;
        }

        const timestamp = Date.now();

        const card = crearTarjetaReview(estrellas, texto, userName, timestamp);
        reviewsWrap.appendChild(card);

        const valoraciones = JSON.parse(localStorage.getItem("valoraciones") || "[]");
        valoraciones.push({
            usuario: userName,
            texto,
            puntaje: estrellas,
            timestamp
        });
        localStorage.setItem("valoraciones", JSON.stringify(valoraciones));

        resenaInput.value = "";
        puntaje.selectedIndex = 0;

        lucide.createIcons();
    });
});
