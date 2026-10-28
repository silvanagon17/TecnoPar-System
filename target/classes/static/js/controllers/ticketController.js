async function descargarTicket(ventaId) {
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
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    const response = await fetch(`/api/reportes/ticket/${ventaId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("No se pudo generar el ticket de compra.");
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
