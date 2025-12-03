const STORAGE_KEY = "materialesSubidos";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formSubirMaterial");
  const inputTitulo = document.getElementById("inputTitulo");
  const inputCurso = document.getElementById("inputCurso");
  const inputCarrera = document.getElementById("inputCarrera");
  const inputEtiquetas = document.getElementById("inputEtiquetas");
  const inputArchivo = document.getElementById("inputArchivo");
  const estado = document.getElementById("estadoSubida");
  const fileNameHint = document.getElementById("fileNameHint");

  if (!form) return;

  // Mostrar nombre del archivo seleccionado
  inputArchivo.addEventListener("change", () => {
    const file = inputArchivo.files[0];
    if (file) {
      fileNameHint.textContent = `Seleccionado: ${file.name}`;
    } else {
      fileNameHint.textContent = "Ningún archivo seleccionado.";
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const file = inputArchivo.files[0];
    if (!file) {
      mostrarEstado("Selecciona un archivo PDF.", true);
      return;
    }

    if (file.type !== "application/pdf") {
      mostrarEstado("Solo se permiten archivos PDF.", true);
      return;
    }

    const titulo = inputTitulo.value.trim();
    const curso = inputCurso.value.trim();
    const carrera = inputCarrera.value.trim();
    const etiquetas = inputEtiquetas.value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const reader = new FileReader();

    reader.onload = function (evt) {
      const dataUrl = evt.target.result;

      let materiales = [];
      try {
        materiales = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      } catch {
        materiales = [];
      }

      const nuevo = {
        titulo,
        curso,
        carrera,
        etiquetas,
        dataUrl,
        fechaSubida: new Date().toISOString(),
      };

      materiales.push(nuevo);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(materiales));

      // Registrar en historial si existe registrarActividad
      if (typeof registrarActividad === "function") {
        registrarActividad({
          paginaId: "navSubirMaterial",
          paginaNombre: "Subir materiales",
          tipo: "accion",
          descripcion: `Subiste el archivo "${titulo}"`,
        });
      }

      form.reset();
      fileNameHint.textContent = "Ningún archivo seleccionado.";
      mostrarEstado("Archivo subido correctamente ✔", false);
    };

    reader.onerror = function () {
      mostrarEstado("Ocurrió un error al leer el archivo.", true);
    };

    reader.readAsDataURL(file);
  });

  function mostrarEstado(texto, esError) {
    if (!estado) return;
    estado.textContent = texto;
    estado.style.color = esError ? "#b91c1c" : "#047857";
  }
});
