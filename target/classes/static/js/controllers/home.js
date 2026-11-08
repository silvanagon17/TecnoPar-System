import { obtenerProductos } from "../service/productoService.js";
import {
  verDetalleProducto,
  inicializarEventosDetalle,
} from "./detalleProducto.js";

let listaProductos = [];

document.addEventListener("DOMContentLoaded", async () => {
  listaProductos = await obtenerProductos();
  inicializarEventosDetalle();
  const contenedorTienda = document.getElementById("contenedor-catalogo");

  contenedorTienda?.addEventListener("click", (e) => {
    const btnDetalle =
      e.target.closest(".btn-ver-detalle") || e.target.closest(".img-producto");

    if (btnDetalle) {
      const tarjeta = e.target.closest("[data-id]");
      const id = tarjeta?.getAttribute("data-id");

      const productoSeleccionado = listaProductos.find(
        (p) => String(p.id) === String(id),
      );

      if (productoSeleccionado) {
        verDetalleProducto(productoSeleccionado);
      } else {
        console.warn("No se encontró el producto con ID:", id);
      }
    }
  });
});
