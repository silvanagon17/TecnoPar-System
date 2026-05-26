/**
 * @param {string} texto
 * @returns {string} texto formateado
 */
export const normalizarTexto = (texto) => {
  const normalizado = texto.trim().toLowerCase();
  if (!normalizado) return "";
  return normalizado.charAt(0).toUpperCase() + normalizado.slice(1);
};
