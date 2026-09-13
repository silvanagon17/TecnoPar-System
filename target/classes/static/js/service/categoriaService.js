const API_URL = "/api/categorias";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const obtenerCategorias = async () => {
  const respuesta = await fetch(API_URL);
  if (!respuesta.ok) {
    throw new Error("Error al obtener la lista de productos");
  }
  return await respuesta.json();
};

export const crearCategoria = async (nuevaCategoria) => {
  const respuesta = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(nuevaCategoria),
  });

  if (!respuesta.ok) {
    const errorData = await respuesta.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al crear la categoria");
  }

  return respuesta;
};

export const actualizarCategoria = async (id, datos) => {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    throw new Error("Error al actualizar la categoria");
  }

  return respuesta;
};

export const eliminarCategoria = async (id) => {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!respuesta.ok) {
    throw new Error("Error al eliminar la categoria");
  }

  return respuesta;
};
