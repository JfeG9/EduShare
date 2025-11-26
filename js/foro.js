document.addEventListener("DOMContentLoaded", () => {
    const publishBtn = document.getElementById("publish-btn");
    const exitBtn = document.getElementById("exit-btn");
    const attachBtn = document.getElementById("attach-btn");
    const topicInput = document.getElementById("topic-input");
    const threadInput = document.getElementById("thread-input");

    publishBtn.addEventListener("click", () => {
        const topic = topicInput.value.trim();
        const thread = threadInput.value.trim();

        if (!topic && !thread) {
            alert("Escribe al menos un mensaje antes de publicar.");
            return;
        }

        alert("Mensaje publicado en el foro.");
        threadInput.value = "";
    });

    attachBtn.addEventListener("click", () => {
        alert("Función para adjuntar archivo o enlace (simulada).");
    });

    exitBtn.addEventListener("click", () => {
        alert("Saliendo del foro.");
    });
});
