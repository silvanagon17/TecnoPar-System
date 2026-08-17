/**
 * @param {string} tipo
 * @param {string} tipoIcono
 * @param {string} mensaje
 * @param {string} [container="notify-container"]
 */
export const mostrarMensaje = (
  tipo,
  tipoIcono,
  mensaje,
  container = "notify-container",
) => {
  const contenedor = document.getElementById(container);

  if (!contenedor) {
    console.warn(`No se encontró el contenedor`);
    return;
  }

  contenedor.innerHTML = "";

  const alerta = document.createElement("div");
  alerta.className = `alert alert-${tipo} d-flex align-items-center alert-in`;
  alerta.setAttribute("role", "alert");

  const icono = document.createElement("i");
  icono.setAttribute("data-lucide", tipoIcono);
  icono.setAttribute("width", "20");
  icono.setAttribute("height", "20");
  icono.className = "me-2";

  const textoAlerta = document.createElement("div");
  textoAlerta.textContent = mensaje;
  alerta.appendChild(icono);
  alerta.appendChild(textoAlerta);
  contenedor.appendChild(alerta);

  if (typeof lucide !== "undefined" && lucide.createIcons) {
    lucide.createIcons({
      nameAttr: "data-lucide",
      root: alerta,
    });
  }

  setTimeout(() => {
    contenedor.classList.remove("alert-in");
    contenedor.classList.add("alert-out");

    contenedor.addEventListener(
      "animationend",
      () => {
        contenedor.innerHTML = "";
        contenedor.classList.remove("alert-out");
      },
      { once: true },
    );
  }, 2000);
};
