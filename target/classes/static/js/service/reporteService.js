const API_URL = "/api/reportes";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Accept: "application/pdf",
    Authorization: `Bearer ${token}`,
  };
};
export const reporteService = {
  obtenerReporteVentasPdf: async () => {
    const response = await fetch(`${API_URL}/ventas/pdf`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(
        `Error en el servidor: ${response.status} ${response.statusText}`,
      );
    }

    return await response.blob();
  },
};
