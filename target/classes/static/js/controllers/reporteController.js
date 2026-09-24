async function imprimirReporteVentas() {
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

    window.open(pdfUrl, "_blank");
  } catch (error) {
    console.error("Error al descargar el reporte:", error);
    alert("Ocurrió un error al intentar generar el PDF del reporte.");
  }
}
