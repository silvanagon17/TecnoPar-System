/**
 * @param {number|string} cantidad
 * @returns {string}
 */
export const renderStock = (cantidad) => {
  const stock = Number(cantidad) || 0;

  if (stock < 5) {
    return `<span class="inline-flex items-center gap-x-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400 ring-1 ring-inset ring-red-500/20">
        <span class="size-1.5 rounded-full bg-red-500"></span>
        Agotándose (${stock})
      </span>`;
  }

  if (stock >= 5 && stock <= 10) {
    return `<span class="inline-flex items-center gap-x-1.5 rounded-full bg-yellow-600/10 px-2.5 py-1 text-xs font-medium text-yellow-600 ring-1 ring-inset ring-amber-500/20">
        <span class="size-1.5 rounded-full bg-amber-500"></span>
        Stock Bajo (${stock})
      </span>`;
  }

  return `<span class="inline-flex items-center gap-x-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-600 ring-1 ring-inset ring-green-500/20">
        <span class="size-1.5 rounded-full bg-emerald-500"></span>
        Disponible (${stock})
      </span>`;
};

export const renderState = (estado) => {
  const estaActivo = estado === true || estado === "true";

  if (estaActivo) {
    return `
      <span class="inline-flex items-center  px-2 py-1 text-xs font-medium text-green-500">
        Activo
      </span>`;
  }

  return `
      <span class="inline-flex items-center px-2 py-1 text-xs font-medium text-zinc-500">
        Inactivo
      </span>`;
};

export const calcularNuevoStock = (actual, ingresar) => {
  const stockActual = Number(actual) || 0;
  const stockIngresar = Number(ingresar) || 0;
  return stockActual + (stockIngresar > 0 ? stockIngresar : 0);
};
