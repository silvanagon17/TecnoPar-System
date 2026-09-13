const API_URL = "/api/ventas";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const procesarVenta = async (usuarioId, datosProcesarVenta) => {
  const respuesta = await fetch(`${API_URL}/usuario/${usuarioId}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(datosProcesarVenta),
  });

  const textoRespuesta = await respuesta.text().catch(() => "");

  if (!respuesta.ok) {
    throw new Error(textoRespuesta || "Error al procesar la venta");
  }

  if (!textoRespuesta || textoRespuesta.trim() === "") {
    return { ok: true };
  }

  try {
    return JSON.parse(textoRespuesta);
  } catch (e) {
    return { id: textoRespuesta };
  }
};

export const obtenerVentas = async () => {
  const respuesta = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });
  if (!respuesta.ok) {
    throw new Error("Error al obtener la lista de ventas");
  }
  return await respuesta.json();
};

export const obtenerVentaPorId = async (id) => {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!respuesta.ok) {
    throw new Error("Error al obtener la venta");
  }
  return await respuesta.json();
};
