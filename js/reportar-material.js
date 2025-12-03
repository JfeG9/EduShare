document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formReporte");
  const msgExito = document.getElementById("msgExito");

  const searchMaterial = document.getElementById("searchMaterial");
  const materialResults = document.getElementById("materialResults");
  const inputMaterialTitulo = document.getElementById("inputMaterialTitulo");
  const inputMaterialIndex = document.getElementById("inputMaterialIndex");

  let materiales = [];

  // Leer materiales desde localStorage
  try {
    materiales =
      JSON.parse(localStorage.getItem("materialesSubidos")) || [];
  } catch (e) {
    console.error("Error leyendo materialesSubidos", e);
    materiales = [];
  }

  function formatearFecha(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("es-PE", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  }

  function renderResultados(filtroTexto) {
    materialResults.innerHTML = "";

    if (!materiales.length) {
      materialResults.innerHTML =
        '<p class="material-results-empty">No hay materiales subidos aún.</p>';
      return;
    }

    const texto = filtroTexto.toLowerCase().trim();
    let filtrados = materiales;

    if (texto) {
      filtrados = materiales.filter((mat) => {
        const titulo = (mat.titulo || mat.nombre || "").toLowerCase();
        const curso = (mat.curso || "").toLowerCase();
        const carrera = (mat.carrera || "").toLowerCase();
        return (
          titulo.includes(texto) ||
          curso.includes(texto) ||
          carrera.includes(texto)
        );
      });
    }

    if (!filtrados.length) {
      materialResults.innerHTML =
        '<p class="material-results-empty">No se encontraron materiales con ese texto.</p>';
      return;
    }

    filtrados.forEach((mat, idx) => {
      const realIndex = materiales.indexOf(mat);

      const titulo = mat.titulo || mat.nombre || "Material sin título";
      const curso = mat.curso || "";
      const carrera = mat.carrera || "";
      const fecha = formatearFecha(mat.fechaSubida || mat.fecha || "");

      const item = document.createElement("div");
      item.className = "material-result-item";

      item.innerHTML = `
        <div class="material-result-main">
          <div class="material-result-title">${titulo}</div>
          <div class="material-result-meta">
            ${
              curso || carrera
                ? `${curso}${curso && carrera ? " · " : ""}${carrera}`
                : ""
            }
            ${fecha ? ` · ${fecha}` : ""}
          </div>
        </div>
        <button type="button" class="btn-select-material">Elegir</button>
      `;

      const btnElegir = item.querySelector(".btn-select-material");

      btnElegir.addEventListener("click", () => {
        inputMaterialTitulo.value = titulo;
        inputMaterialIndex.value = String(realIndex);
      });

      materialResults.appendChild(item);
    });
  }

  // Estado inicial del buscador
  if (!materiales.length) {
    materialResults.innerHTML =
      '<p class="material-results-empty">No hay materiales subidos aún.</p>';
  } else {
    materialResults.innerHTML =
      '<p class="material-results-empty">Escribe para buscar entre los materiales subidos.</p>';
  }

  // Buscar mientras escribe
  searchMaterial.addEventListener("input", (e) => {
    const val = e.target.value;
    if (!val.trim()) {
      materialResults.innerHTML =
        '<p class="material-results-empty">Escribe para buscar entre los materiales subidos.</p>';
      return;
    }
    renderResultados(val);
  });

  // Enviar reporte
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const motivo = document.getElementById("inputMotivo").value;
    const descripcion = document
      .getElementById("inputDescripcion")
      .value.trim();

    const tituloSeleccionado = inputMaterialTitulo.value.trim();
    const indexSeleccionado = inputMaterialIndex.value;

    const nuevoReporte = {
      id: crypto.randomUUID(),
      materialTitulo: tituloSeleccionado || null,
      materialIndex:
        indexSeleccionado !== "" ? Number(indexSeleccionado) : null,
      motivo,
      descripcion,
      fecha: new Date().toISOString(),
    };

    const reportes =
      JSON.parse(localStorage.getItem("reportesMaterial")) || [];
    reportes.push(nuevoReporte);
    localStorage.setItem("reportesMaterial", JSON.stringify(reportes));

    msgExito.style.display = "block";
    form.reset();
    inputMaterialTitulo.value = "";
    inputMaterialIndex.value = "";
  });
});