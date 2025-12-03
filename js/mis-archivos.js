const STORAGE_KEY = "materialesSubidos";
const FAVORITES_KEY = "materialesGuardados";

document.addEventListener("DOMContentLoaded", () => {
  const savedGrid = document.getElementById("savedGrid");
  const savedEmpty = document.getElementById("savedEmpty");
  const uploadedGrid = document.getElementById("uploadedGrid");
  const uploadedEmpty = document.getElementById("uploadedEmpty");
  const myfilesStats = document.getElementById("myfilesStats");

  const pdfModal = document.getElementById("pdfModal");
  const pdfViewer = document.getElementById("pdfViewer");
  const pdfDownload = document.getElementById("pdfDownload");
  const pdfModalTitle = document.getElementById("pdfModalTitle");
  const closePdfModal = document.getElementById("closePdfModal");

  let favoritos = [];
  let subidos = [];

  function cargarFavoritos() {
    try {
      favoritos = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
    } catch {
      favoritos = [];
    }
    renderFavoritos();
  }

  function cargarSubidos() {
    try {
      subidos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      subidos = [];
    }
    renderSubidos();
  }

  function renderFavoritos() {
    savedGrid.innerHTML = "";

    if (!favoritos.length) {
      savedEmpty.style.display = "flex";
    } else {
      savedEmpty.style.display = "none";
    }

    favoritos.forEach((mat, index) => {
      const card = crearTarjeta(mat, "guardado", () => eliminarFavorito(index));
      savedGrid.appendChild(card);
    });

    actualizarStats();
    refrescarIconos();
  }

  function renderSubidos() {
    uploadedGrid.innerHTML = "";

    if (!subidos.length) {
      uploadedEmpty.style.display = "flex";
    } else {
      uploadedEmpty.style.display = "none";
    }

    subidos.forEach((mat, index) => {
      const card = crearTarjeta(mat, "subido", () => eliminarSubido(index));
      uploadedGrid.appendChild(card);
    });

    actualizarStats();
    refrescarIconos();
  }

  function crearTarjeta(material, tipo, onRemove) {
    const card = document.createElement("article");
    card.className = "material-card";

    const titulo =
      material.titulo || material.nombre || "Material sin título";
    const curso = material.curso || material.asignatura || "";
    const carrera = material.carrera || "";
    const etiquetas = material.etiquetas || [];
    const fecha =
      material.fechaGuardado ||
      material.fechaSubida ||
      material.fecha ||
      "";
    const dataUrl = material.dataUrl || material.url || "";

    card.innerHTML = `
      <div class="material-card-header">
        <div class="material-icon">
          <i data-lucide="file-text"></i>
        </div>
        <div>
          <h3 class="material-title">${titulo}</h3>
          <div class="material-meta">
            ${curso ? `<span>${curso}</span>` : ""}
            ${curso && carrera ? " · " : ""}
            ${carrera ? `<span>${carrera}</span>` : ""}
            ${
              tipo === "guardado"
                ? ' · <span>Guardado</span>'
                : ' · <span>Subido</span>'
            }
          </div>
          <div class="material-tags">
            ${
              etiquetas.length
                ? etiquetas
                    .map((tag) => `<span class="material-tag">${tag}</span>`)
                    .join("")
                : ""
            }
          </div>
        </div>
      </div>

      <div class="material-actions">
        <div class="material-actions-bottom">
          <div class="material-actions-left">
            <button class="btn-pill btn-view" type="button">
              <i data-lucide="eye"></i><span>Ver</span>
            </button>
            <button class="btn-pill btn-download" type="button">
              <i data-lucide="download"></i><span>Descargar</span>
            </button>
            <button class="btn-pill btn-remove" type="button">
              <i data-lucide="trash-2"></i>
              <span>${
                tipo === "guardado" ? "Quitar de guardados" : "Eliminar subido"
              }</span>
            </button>
          </div>
          <span class="material-date">${fecha ? fecha : ""}</span>
        </div>
      </div>
    `;

    const btnVer = card.querySelector(".btn-view");
    const btnDescargar = card.querySelector(".btn-download");
    const btnRemove = card.querySelector(".btn-remove");

    btnVer.addEventListener("click", () => {
      if (!dataUrl) return;
      if (pdfViewer) pdfViewer.src = dataUrl;
      if (pdfDownload) pdfDownload.href = dataUrl;
      if (pdfModalTitle) pdfModalTitle.textContent = titulo;
      pdfModal.style.display = "flex";
      document.body.classList.add("modal-open");
    });

    btnDescargar.addEventListener("click", () => {
      if (!dataUrl) return;
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = titulo + ".pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });

    btnRemove.addEventListener("click", () => {
      if (typeof onRemove === "function") onRemove();
    });

    return card;
  }

  function eliminarFavorito(index) {
    const lista = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
    if (index < 0 || index >= lista.length) return;
    lista.splice(index, 1);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(lista));
    cargarFavoritos();
  }

  function eliminarSubido(index) {
    const lista = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    if (index < 0 || index >= lista.length) return;
    lista.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    cargarSubidos();
  }

  function actualizarStats() {
    const nGuardados = favoritos.length;
    const nSubidos = subidos.length;
    if (!myfilesStats) return;
    myfilesStats.textContent = `${nGuardados} guardado(s) · ${nSubidos} subido(s)`;
  }

  closePdfModal?.addEventListener("click", () => {
    pdfModal.style.display = "none";
    document.body.classList.remove("modal-open");
  });

  pdfModal?.addEventListener("click", (e) => {
    if (e.target === pdfModal) {
      pdfModal.style.display = "none";
      document.body.classList.remove("modal-open");
    }
  });

  function refrescarIconos() {
    if (window.lucide && lucide.createIcons) {
      lucide.createIcons();
    }
  }

  // Inicializar
  cargarFavoritos();
  cargarSubidos();
  refrescarIconos();
});
