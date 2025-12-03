// Clave donde se guardan los materiales en localStorage
const STORAGE_KEY = "materialesSubidos";
const FAVORITES_KEY = "materialesGuardados";

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

  // -------------------------------------------------------------
  // FAVORITOS (GUARDADOS)
  // -------------------------------------------------------------
  function obtenerGuardados() {
    try {
      return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
    } catch {
      return [];
    }
  }

  function guardarFavoritos(lista) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(lista));
  }

  function estaGuardado(material) {
    const guardados = obtenerGuardados();
    return guardados.some((g) => g.dataUrl === material.dataUrl);
  }

  function toggleGuardado(material) {
    let guardados = obtenerGuardados();

    if (estaGuardado(material)) {
      // Quitar de guardados
      guardados = guardados.filter((g) => g.dataUrl !== material.dataUrl);
    } else {
      // Agregar a guardados
      guardados.push({
        titulo: material.titulo || material.nombre || "Material sin título",
        dataUrl: material.dataUrl,
        fechaGuardado: new Date().toISOString(),
        curso: material.curso || "",
        carrera: material.carrera || "",
        etiquetas: material.etiquetas || [],
      });
    }

    guardarFavoritos(guardados);
  }

  // -------------------------------------------------------------
  // CARGAR MATERIALES
  // -------------------------------------------------------------
  function cargarMateriales() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      materiales = data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error leyendo materiales de localStorage", e);
      materiales = [];
    }

    materialesFiltrados = [...materiales];
    renderMateriales();
  }

  // -------------------------------------------------------------
  // RENDERIZAR TARJETAS
  // -------------------------------------------------------------
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

      const titulo = mat.titulo || mat.nombre || "Material sin título";
      const curso = mat.curso || mat.asignatura || "";
      const carrera = mat.carrera || "";
      const etiquetas = mat.etiquetas || [];
      const fecha = mat.fechaSubida || mat.fecha || "";
      const dataUrl = mat.dataUrl || mat.url || "";

      const isSaved = estaGuardado(mat);

      // --- HTML de la tarjeta (aquí ubicamos Guardar ARRIBA) ---
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
          <!-- Botón GUARDAR (arriba) -->
          <button class="btn-pill btn-save" type="button">
            <i data-lucide="star"></i>
            <span>${isSaved ? "Guardado ✓" : "Guardar"}</span>
          </button>

          <!-- Fila inferior: Ver / Descargar + fecha -->
          <div class="material-actions-bottom">
            <div class="material-actions-left">
              <button class="btn-pill btn-view" type="button">
                <i data-lucide="eye"></i><span>Ver</span>
              </button>
              <button class="btn-pill btn-download" type="button">
                <i data-lucide="download"></i><span>Descargar</span>
              </button>
            </div>
            <span class="material-date">${fecha ? fecha : ""}</span>
          </div>
        </div>
      `;

      // Botón Ver
      const btnVer = card.querySelector(".btn-view");
      btnVer.addEventListener("click", () => {
        if (!dataUrl) return;
        if (pdfViewer) pdfViewer.src = dataUrl;
        if (pdfDownload) pdfDownload.href = dataUrl;
        if (pdfModalTitle) pdfModalTitle.textContent = titulo;
        pdfModal.style.display = "flex";
        document.body.classList.add("modal-open");
      });

      // Botón Descargar
      const btnDescargar = card.querySelector(".btn-download");
      btnDescargar.addEventListener("click", () => {
        if (!dataUrl) return;
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = titulo + ".pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });

      // Botón Guardar
      const btnSave = card.querySelector(".btn-save");
      btnSave.addEventListener("click", () => {
        toggleGuardado(mat);
        btnSave.querySelector("span").textContent = estaGuardado(mat)
          ? "Guardado ✓"
          : "Guardar";
      });

      materialsGrid.appendChild(card);
    });

    // Refrescar iconos lucide
    if (window.lucide && lucide.createIcons) {
      lucide.createIcons();
    }
  }

  // -------------------------------------------------------------
  // FILTROS Y BUSQUEDA
  // -------------------------------------------------------------
  function aplicarFiltros() {
    const texto = searchInput.value.toLowerCase().trim();
    const filtro = filterSelect.value;

    materialesFiltrados = materiales.filter((mat) => {
      const titulo = (mat.titulo || mat.nombre || "").toLowerCase();
      const curso = (mat.curso || mat.asignatura || "").toLowerCase();
      const carrera = (mat.carrera || "").toLowerCase();
      const etiquetas = (mat.etiquetas || []).join(" ").toLowerCase();

      return (
        !texto ||
        titulo.includes(texto) ||
        curso.includes(texto) ||
        carrera.includes(texto) ||
        etiquetas.includes(texto)
      );
    });

    if (filtro === "recientes") {
      materialesFiltrados.sort((a, b) => {
        return (
          new Date(b.fechaSubida || b.fecha || 0) -
          new Date(a.fechaSubida || a.fecha || 0)
        );
      });
    }

    if (filtro === "antiguos") {
      materialesFiltrados.sort((a, b) => {
        return (
          new Date(a.fechaSubida || a.fecha || 0) -
          new Date(b.fechaSubida || b.fecha || 0)
        );
      });
    }

    renderMateriales();
  }

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

  // Inicializar
  cargarMateriales();
});
