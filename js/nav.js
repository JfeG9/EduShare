document.addEventListener("DOMContentLoaded", () => {
  const rutas = {
    navInicio: "../utilidades/dashboard.html",
    navSubirMaterial: "../recursos/subir-material.html",
    navMisArchivos: "../usuario/mis-archivos.html",
    navExplorarMaterial: "../busqueda/busqueda.html",
    navForo: "../utilidades/hilo.html",
    navHistorial: "../usuario/historial-actividad.html",
    navReportes: "../recursos/reportar-material.html",
    navLogros: "../usuario/logros.html",
    navCalendario: "../utilidades/calendario.html",
    navConfiguracion: "../usuario/configuracion.html",
    navHistorial: "../usuario/historial.html",
    navLogros: "../usuario/logros.html";
  };

  Object.entries(rutas).forEach(([id, ruta]) => {
    const boton = document.getElementById(id);
    if (!boton) return;

    boton.addEventListener("click", () => {
      window.location.href = ruta;
    });
  });
});
