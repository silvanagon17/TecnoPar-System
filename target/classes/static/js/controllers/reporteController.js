async function imprimirReporteVentas() {
  Swal.fire({
    title: "Generando reporte...",
    text: "Por favor, aguarde unos momentos.",
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const response = await fetch(
      "http://localhost:8080/api/ventas/reporte/pdf",
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      throw new Error("No se pudo generar el reporte de ventas.");
    }

    const blob = await response.blob();
    const pdfUrl = URL.createObjectURL(blob);
    Swal.close();
    window.open(pdfUrl, "_blank");
  } catch (error) {
    console.error("Error al descargar el reporte:", error);

    Swal.fire({
      icon: "error",
      title: "Error al generar el reporte",
      text: error.message || "Ocurrió un error al intentar generar el PDF.",
      confirmButtonText: "Entendido",
      confirmButtonColor: "#3085d6",
    });
  }
}
