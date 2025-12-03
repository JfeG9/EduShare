// Clave donde se guardan los materiales en localStorage
// AJUSTA ESTO al nombre que uses en subir-archivo.js
const STORAGE_KEY = "materialesSubidos";

document.addEventListener("DOMContentLoaded", () => {
  const materialsGrid = document.getElementById("materialsGrid");
  const materialsEmpty = document.getElementById("materialsEmpty");
  const exploreStats = document.getElementById("exploreStats");
  const searchInput = document.getElementById("searchInput");
  const filterSelect = document.getElementById("filterSelect");

  const pdfModal = document.getElementById("pdfModal");
  const pdfViewer = document.getElementById("pdfViewer");
  const pdfDownload = document.getElementById("pdfDownload");
  const pdfModalTitle = document.getElementById("pdfModalTitle");
  const closePdfModal = document.getElementById("closePdfModal");

  let materiales = [];
  let materialesFiltrados = [];

  function cargarMateriales() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        materiales = [];
      } else {
        materiales = JSON.parse(data) || [];
      }
    } catch (e) {
      console.error("Error leyendo materiales de localStorage", e);
      materiales = [];
    }
    materialesFiltrados = [...materiales];
    renderMateriales();
  }

  function renderMateriales() {
    materialsGrid.innerHTML = "";

    if (!materialesFiltrados.length) {
      materialsEmpty.style.display = "flex";
      exploreStats.textContent = "0 materiales encontrados";
      return;
    }

    materialsEmpty.style.display = "none";
    exploreStats.textContent =
      materialesFiltrados.length + " material(es) encontrados";

    materialesFiltrados.forEach((mat) => {
      const card = document.createElement("article");
      card.className = "material-card";

      // Datos con fallback por si algo viene vacío
      const titulo = mat.titulo || mat.nombre || "Material sin título";
      const curso = mat.curso || mat.asignatura || "";
      const carrera = mat.carrera || "";
      const etiquetas = mat.etiquetas || [];
      const fecha = mat.fechaSubida || mat.fecha || "";
      const dataUrl = mat.dataUrl || mat.url || "";

      card.innerHTML = `
        <div class="material-card-header">
          <div class="material-icon">
            <i data-lucide="file-text"></i>
          </div>
          <div>
            <h3 class="material-title" title="${titulo}">${titulo}</h3>
            <div class="material-meta">
              ${curso ? `<span>${curso}</span>` : ""}
              ${curso && carrera ? " · " : ""}
              ${carrera ? `<span>${carrera}</span>` : ""}
            </div>
            <div class="material-tags">
              ${
                etiquetas && etiquetas.length
                  ? etiquetas
                      .map(
                        (tag) =>
                          `<span class="material-tag">${tag}</span>`
                      )
                      .join("")
                  : ""
              }
            </div>
          </div>
        </div>
        <div class="material-actions">
          <div class="material-actions-left">
            <button class="btn-pill btn-view" type="button">
              <i data-lucide="eye"></i>
              <span>Ver</span>
            </button>
            <button class="btn-pill btn-download" type="button">
              <i data-lucide="download"></i>
              <span>Descargar</span>
            </button>
          </div>
          <span class="material-date">
            ${fecha ? fecha : ""}
          </span>
        </div>
      `;

      const btnVer = card.querySelector(".btn-view");
      const btnDescargar = card.querySelector(".btn-download");

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
        a.download = titulo || "material.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });

      materialsGrid.appendChild(card);
    });

    // Refrescar iconos lucide
    if (window.lucide && lucide.createIcons) {
      lucide.createIcons();
    }
  }

  function aplicarFiltros() {
    const texto = searchInput.value.toLowerCase().trim();
    const filtro = filterSelect.value;

    materialesFiltrados = materiales.filter((mat) => {
      const titulo = (mat.titulo || mat.nombre || "").toLowerCase();
      const curso = (mat.curso || mat.asignatura || "").toLowerCase();
      const carrera = (mat.carrera || "").toLowerCase();
      const etiquetas = (mat.etiquetas || []).join(" ").toLowerCase();

      const coincideTexto =
        !texto ||
        titulo.includes(texto) ||
        curso.includes(texto) ||
        carrera.includes(texto) ||
        etiquetas.includes(texto);

      return coincideTexto;
    });

    // Ordenar según filtro
    if (filtro === "recientes") {
      materialesFiltrados.sort((a, b) => {
        const fa = new Date(a.fechaSubida || a.fecha || 0).getTime();
        const fb = new Date(b.fechaSubida || b.fecha || 0).getTime();
        return fb - fa;
      });
    } else if (filtro === "antiguos") {
      materialesFiltrados.sort((a, b) => {
        const fa = new Date(a.fechaSubida || a.fecha || 0).getTime();
        const fb = new Date(b.fechaSubida || b.fecha || 0).getTime();
        return fa - fb;
      });
    }

    renderMateriales();
  }

  // Eventos
  searchInput.addEventListener("input", aplicarFiltros);
  filterSelect.addEventListener("change", aplicarFiltros);

  // Modal PDF
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

  // Cargar y pintar
  cargarMateriales();
});