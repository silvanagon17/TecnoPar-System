/**
 * @param {string} mensaje
 * @param {string} container
 */
export const mostrarMensaje = (
  tipo,
  mensaje,
  container = "notify-container",
) => {
  const contenedor = document.getElementById(container);

  if (!contenedor) {
    console.warn(`No se encontró el contenedor`);
    return;
  }

  contenedor.innerHTML = `
    <div class="alert alert-${tipo} d-flex align-items-center" role="alert">
        <i class="bi bi-check-circle-fill"></i>
        <div>
            ${mensaje}
        </div>
    </div>`;

  setTimeout(() => {
    contenedor.classList.remove("alert-in");
    contenedor.classList.add("alert-out");
    contenedor.addEventListener("animationend", () => {
      contenedor.remove();
    });
  }, 2000);
};
