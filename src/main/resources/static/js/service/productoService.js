const API_URL = "/api/productos";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const obtenerProductos = async () => {
  const respuesta = await fetch(API_URL);
  if (!respuesta.ok) {
    throw new Error("Error al obtener la lista de productos");
  }
  return await respuesta.json();
};

export const crearProducto = async (formData) => {
  const respuesta = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!respuesta.ok) {
    const errorData = await respuesta.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al crear el producto");
  }

  return respuesta;
};

export const actualizarProducto = async (id, formData) => {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!respuesta.ok) {
    throw new Error("Error al actualizar el producto");
  }

  return respuesta;
};

export const eliminarProducto = async (id) => {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!respuesta.ok) {
    throw new Error("Error al eliminar el producto");
  }

  return respuesta;
};
