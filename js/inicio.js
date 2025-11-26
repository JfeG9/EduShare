const pdfKey = "Informe_DD1";

// 1️⃣ Intentar cargar desde localStorage
const storedPDF = localStorage.getItem(pdfKey);

if (storedPDF) {
    document.getElementById("pdfViewer").src = storedPDF;
    console.log("PDF cargado desde localStorage");
} else {
    // 2️⃣ Si NO existe → cargar desde la ruta REAL
    const pdfURL = "../../assets/pdf/Informe_DD1.pdf";

    fetch(pdfURL)
        .then(res => res.blob())
        .then(blob => {
            const reader = new FileReader();
            reader.onloadend = function () {
                const base64PDF = reader.result;

                // Guardarlo
                localStorage.setItem(pdfKey, base64PDF);

                // Mostrarlo
                document.getElementById("pdfViewer").src = base64PDF;

                console.log("PDF cargado y guardado en localStorage");
            };
            reader.readAsDataURL(blob);
        })
        .catch(err => {
            console.error("Error cargando el PDF:", err);
        });
}
