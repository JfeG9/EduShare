document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("search-form");
    const input = document.getElementById("search-input");

    form.addEventListener("submit", e => {
        e.preventDefault();
        const query = input.value.trim();
        if (!query) {
            alert("Ingresa un término de búsqueda.");
            return;
        }
        alert("Buscando: " + query);
    });
});
