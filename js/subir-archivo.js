// subir-archivo.js
// - Menú lateral + usuario
// - Subida de PDFs
// - Almacenamiento REAL en localStorage (dataURL)
// - Miniatura de primera página con pdf.js

document.addEventListener("DOMContentLoaded", () => {
  // ------------------------------------------------------------------
  // MENÚ LATERAL Y MENÚ DE USUARIO
  // ------------------------------------------------------------------
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const sidebarClose = document.getElementById("sidebarClose");
  const sidebarBackdrop = document.getElementById("sidebarBackdrop");

  const userMenuToggle = document.getElementById("userMenuToggle");
  const userDropdown = document.getElementById("userDropdown");

  function openSidebar() {
    if (!sidebar) return;
    sidebar.classList.add("open");
    sidebarBackdrop?.classList.add("visible");
  }

  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove("open");
    sidebarBackdrop?.classList.remove("visible");
  }

  menuToggle?.addEventListener("click", openSidebar);
  sidebarClose?.addEventListener("click", closeSidebar);
  sidebarBackdrop?.addEventListener("click", closeSidebar);

  userMenuToggle?.addEventListener("click", () => {
    userDropdown?.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!userMenuToggle || !userDropdown) return;
    if (
      !userMenuToggle.contains(e.target) &&
      !userDropdown.contains(e.target)
    ) {
      userDropdown.classList.remove("open");
    }
  });

  // Iconos lucide (inicial)
  if (window.lucide && lucide.createIcons) {
    lucide.createIcons();
  }

  // ------------------------------------------------------------------
  // CONSTANTES LOCALSTORAGE
  // ------------------------------------------------------------------
  const STORAGE_KEY = "edushare_uploads_pdfs_v2";

  // ------------------------------------------------------------------
  // ELEMENTOS UI
  // ------------------------------------------------------------------
  const dropzone = document.querySelector(".dropzone");
  const fileInput = document.getElementById("fileInput");
  const uploadList = document.getElementById("uploadList");
  const emptyState = document.getElementById("emptyState");

  let uploads = loadUploadsFromStorage();
  renderUploads();

  // ------------------------------------------------------------------
  // HELPERS localStorage
  // ------------------------------------------------------------------
  function loadUploadsFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch (err) {
      console.warn("No se pudo leer uploads desde localStorage:", err);
      return [];
    }
  }

  function saveUploadsToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(uploads));
    } catch (err) {
      console.error("Error guardando uploads en localStorage:", err);
      alert(
        "Se alcanzó el límite de almacenamiento del navegador. " +
        "Prueba eliminando algunos archivos o usando archivos más pequeños."
      );
    }
  }

  // ------------------------------------------------------------------
  // pdf.js – generar miniatura de primera página
  // ------------------------------------------------------------------
  async function generatePdfThumbnail(file) {
    try {
      if (!window.pdfjsLib) {
        console.warn("pdf.js no está disponible, no se generará miniatura.");
        return null;
      }

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);

      const scale = 0.4; // ajusta para más/menos detalle
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
      const dataURL = canvas.toDataURL("image/png");

      return dataURL;
    } catch (err) {
      console.error("Error generando thumbnail:", err);
      return null;
    }
  }

  // Convertir File → dataURL (para guardar PDF real en localStorage)
  function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file); // data:application/pdf;base64,...
    });
  }

  // ------------------------------------------------------------------
  // FORMATEAR TAMAÑO
  // ------------------------------------------------------------------
  function formatFileSize(bytes) {
    if (!bytes && bytes !== 0) return "";
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`;
    }
    const mb = kb / 1024;
    if (mb < 1024) {
      return `${mb.toFixed(2)} MB`;
    }
    const gb = mb / 1024;
    return `${gb.toFixed(2)} GB`;
  }

  // ------------------------------------------------------------------
  // RENDERIZAR LISTA DE ARCHIVOS
  // ------------------------------------------------------------------
  function renderUploads() {
    if (!uploadList) return;

    uploadList.innerHTML = "";

    if (!uploads.length) {
      if (emptyState) {
        emptyState.style.display = "flex";
        uploadList.appendChild(emptyState);
      }
      return;
    }

    if (emptyState) {
      emptyState.style.display = "none";
    }

    uploads
      .slice()
      .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
      .forEach((upload) => {
        const item = document.createElement("div");
        item.className = "upload-item";

        // Izquierda: miniatura + nombre
        const info = document.createElement("div");
        info.className = "upload-item-info";

        let thumbWrapper;
        if (upload.thumbnail) {
          thumbWrapper = document.createElement("div");
          thumbWrapper.className = "upload-thumb-wrapper";
          const img = document.createElement("img");
          img.className = "upload-thumb";
          img.src = upload.thumbnail;
          img.alt = `Vista previa de ${upload.name}`;
          thumbWrapper.appendChild(img);
        } else {
          thumbWrapper = document.createElement("i");
          thumbWrapper.setAttribute("data-lucide", "file-text");
        }

        const textWrapper = document.createElement("div");
        const nameEl = document.createElement("p");
        nameEl.className = "upload-item-name";
        nameEl.textContent = upload.name;
        nameEl.title = upload.name;

        const metaEl = document.createElement("p");
        metaEl.className = "upload-item-meta";
        metaEl.textContent = `${formatFileSize(upload.size)} · PDF`;

        textWrapper.appendChild(nameEl);
        textWrapper.appendChild(metaEl);

        info.appendChild(thumbWrapper);
        info.appendChild(textWrapper);

        // Derecha: acciones
        const actions = document.createElement("div");
        actions.className = "upload-actions";

        // Descargar
        const btnDownload = document.createElement("button");
        btnDownload.className = "upload-action";
        btnDownload.title = "Descargar";
        const iconDownload = document.createElement("i");
        iconDownload.setAttribute("data-lucide", "download");
        btnDownload.appendChild(iconDownload);
        btnDownload.addEventListener("click", () => downloadUpload(upload));

        // Eliminar
        const btnDelete = document.createElement("button");
        btnDelete.className = "upload-action";
        btnDelete.title = "Eliminar";
        const iconTrash = document.createElement("i");
        iconTrash.setAttribute("data-lucide", "trash-2");
        btnDelete.appendChild(iconTrash);
        btnDelete.addEventListener("click", () => handleDelete(upload.id));

        actions.appendChild(btnDownload);
        actions.appendChild(btnDelete);

        item.appendChild(info);
        item.appendChild(actions);

        uploadList.appendChild(item);
      });

    // Redibujar iconos lucide
    if (window.lucide && lucide.createIcons) {
      lucide.createIcons();
    }
  }

  // Descargar PDF desde dataURL guardado
  async function downloadUpload(upload) {
    try {
      if (!upload.pdfData) {
        alert("Este archivo no tiene datos almacenados.");
        return;
      }

      // Truco sencillo: usar fetch sobre el dataURL
      const res = await fetch(upload.pdfData);
      const blob = await res.blob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = upload.name || "archivo.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error al descargar archivo:", err);
      alert("No se pudo descargar el archivo.");
    }
  }

  function handleDelete(id) {
    if (!confirm("¿Eliminar este archivo de la plataforma?")) return;
    uploads = uploads.filter((u) => u.id !== id);
    saveUploadsToStorage();
    renderUploads();
  }

  // ------------------------------------------------------------------
  // MANEJO DE ARCHIVOS: input + drag & drop
  // ------------------------------------------------------------------
  // Evitar que el navegador abra el archivo fuera de la zona
  ["dragover", "drop"].forEach((eventName) => {
    document.addEventListener(eventName, (e) => {
      e.preventDefault();
    });
  });

  // Click en dropzone abre input
  dropzone?.addEventListener("click", () => {
    fileInput?.click();
  });

  // Selección desde input
  fileInput?.addEventListener("change", async (e) => {
    const files = e.target.files;
    if (!files) return;
    await handleFiles(files);
    e.target.value = "";
  });

  // Efecto visual drag & drop
  ["dragenter", "dragover"].forEach((eventName) => {
    dropzone?.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add("dropzone-dragover");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropzone?.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove("dropzone-dragover");
    });
  });

  dropzone?.addEventListener("drop", async (e) => {
    if (!e.dataTransfer?.files) return;
    await handleFiles(e.dataTransfer.files);
  });

  async function handleFiles(fileList) {
    const files = Array.from(fileList);
    const pdfs = files.filter((f) => f.type === "application/pdf");

    if (!pdfs.length) {
      alert("Solo se permiten archivos en formato PDF.");
      return;
    }

    for (const file of pdfs) {
      // evitar duplicados exactos
      const exists = uploads.some(
        (u) =>
          u.name === file.name &&
          u.size === file.size &&
          u.lastModified === file.lastModified
      );
      if (exists) continue;

      const id =
        (crypto && crypto.randomUUID && crypto.randomUUID()) ||
        `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      // Generar thumbnail
      const thumbnail = await generatePdfThumbnail(file);

      // Guardar PDF real como dataURL
      const pdfData = await fileToDataURL(file);

      const uploadRecord = {
        id,
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        addedAt: new Date().toISOString(),
        pdfData,    // PDF completo
        thumbnail,  // miniatura
      };

      uploads.push(uploadRecord);
    }

    saveUploadsToStorage();
    renderUploads();
  }
});
