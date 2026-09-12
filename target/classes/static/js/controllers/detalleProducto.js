import { goToDetailView, goToHomeView } from "../utils/changeView.js";
import { addToCart } from "../utils/carrito.js";

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

  goToDetailView();
  window.scrollTo({ top: 0, behavior: "instant" });

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

export function inicializarEventosDetalle() {
  const btnAgregarDetalle =
    document.getElementById("btn-agregar-detalle") ||
    document.getElementById("detalle-btn-agregar");

  btnAgregarDetalle?.addEventListener("click", () => {
    const productoId = btnAgregarDetalle.getAttribute("data-id");

    const inputCantidad = document.getElementById("cantidad-detalle");
    const cantidad = parseInt(inputCantidad?.value || "1", 10);
    if (productoActualId && !isNaN(cantidad) && cantidad > 0) {
      addToCart(Number(productoActualId), cantidad);
    } else {
      console.error("ID o cantidad inválida en la modal de detalle");
    }
  });

  const btnVolver = document.getElementById("btn-volver-home");
  btnVolver?.addEventListener("click", () => {
    goToHomeView();
    window.scrollTo({ top: scrollPosicionGuardada, behavior: "instant" });
  });
}
