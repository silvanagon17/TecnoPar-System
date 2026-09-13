const API_URL = "/api/usuarios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const obtenerUsuarios = async () => {
  const respuesta = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });
  if (!respuesta.ok) {
    throw new Error("Error al obtener la lista de usuarios");
  }
  return await respuesta.json();
};

export const obtenerUsuarioPorId = async (id) => {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!respuesta.ok) {
    throw new Error("Error al obtener los datos del Usuario");
  }
  return await respuesta.json();
};

export const actualizarUsuario = async (id, datosPerfil) => {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(datosPerfil),
  });

  if (!respuesta.ok) {
    const errorData = await respuesta.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al actualizar el usuario");
  }
  return respuesta;
};
