import { goToDetailView, goToHomeView } from "../utils/changeView.js";
import { inicializarManejoCarrito } from "../utils/cartHandler.js";

const BASE_URL_IMAGE = "/image/productos/";
let scrollPosicionGuardada = 0;
let productoActualId = null;

/**
 * @param {Object} producto
 */
export function verDetalleProducto(producto) {
  if (!producto) return;

  productoActualId = producto.id;
  scrollPosicionGuardada = window.scrollY;
  const urlFoto = producto.url_imagen
    ? `${BASE_URL_IMAGE}${producto.url_imagen.split("/").pop()}`
    : "/image/default.png";
  const precioFormateado = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "PYG",
    maximumFractionDigits: 0,
  }).format(producto.pre_venta);

  const imgElement = document.getElementById("detalle-imagen");
  const nombreElement = document.getElementById("detalle-nombre");
  const categoriaElement = document.getElementById("detalle-categoria");
  const descripcionElement = document.getElementById("detalle-descripcion");
  const precioElement = document.getElementById("detalle-precio");

  if (imgElement) {
    imgElement.src = urlFoto;
    imgElement.alt = producto.nombreProducto;
  }

  if (nombreElement) nombreElement.textContent = producto.nombreProducto;
  if (categoriaElement)
    categoriaElement.textContent =
      producto.categoria?.nombreCategoria || "General";
  if (descripcionElement)
    descripcionElement.textContent =
      producto.descripcion || "Sin descripción disponible";
  if (precioElement) precioElement.textContent = precioFormateado;
  const btnAgregarDetalle =
    document.getElementById("detalle-btn-agregar") ||
    document.querySelector(".btn-agregar-carrito");
  if (btnAgregarDetalle) {
    btnAgregarDetalle.setAttribute("data-id", producto.id);
    btnAgregarDetalle.setAttribute("data-stock", producto.stock);
  }
  const contenedorBotonDetalle = document.getElementById(
    "contenedor-accion-detalle",
  );

  if (contenedorBotonDetalle) {
    if (producto.stock > 0) {
      contenedorBotonDetalle.innerHTML = `
        <button
          type="button"
          id="detalle-btn-agregar"
          data-id="${producto.id}"
          data-stock="${producto.stock}"
          class="btn-agregar-carrito w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-blue-600/20"
        >
          <i data-lucide="shopping-cart" class="w-5 h-5"></i>
          <span>Agregar al Carrito</span>
        </button>
      `;
    } else {
      contenedorBotonDetalle.innerHTML = `
        <span class="w-full text-center text-sm font-semibold text-red-500 bg-rose-500/30 border-1 border-red-400/20 rounded-xl py-2.5 block">
          Agotado
        </span>
      `;
    }
  }
  goToDetailView();
  window.scrollTo({ top: 0, behavior: "instant" });

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

export function inicializarEventosDetalle() {
  const btnVolver = document.getElementById("btn-volver-home");
  btnVolver?.addEventListener("click", () => {
    goToHomeView();
    window.scrollTo({ top: scrollPosicionGuardada, behavior: "instant" });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  inicializarManejoCarrito();
});
