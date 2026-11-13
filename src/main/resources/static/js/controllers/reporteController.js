const { ur } = require("zod/v4/locales");

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

  const fechaInicio = document.getElementById("fecha-inicio").value;
  const fechaFin = document.getElementById("fecha-fin").value;
  const metodoPago = document.getElementById("select-metodo-pago").value;

  const params = new URLSearchParams();
  if (fechaInicio) {
    params.append("fechaInicio", fechaInicio);
  }
  if (fechaFin) {
    params.append("fechaFin", fechaFin);
  }
  if (metodoPago && metodoPago !== "") {
    params.append("metodoPago", metodoPago);
  }

  let url = "http://localhost:8080/api/ventas/reporte/pdf";
  const queryString = params.toString();
  if (queryString) {
    url += "?" + queryString;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
    });

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

async function generarReporteMes() {
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
      "http://localhost:8080/api/ventas/reporte_mes/pdf",
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

async function generarReporteStockCrit() {
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
      "http://localhost:8080/api/reportes/stockCritico/pdf",
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      throw new Error(
        "No se pudo generar el reporte de productos con stock bajos.",
      );
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
