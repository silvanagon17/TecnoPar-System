import { addToCart } from "./carrito.js";

export function inicializarManejoCarrito() {
  document.addEventListener("click", async (e) => {
    const btnAgregar = e.target.closest(".btn-agregar-carrito");
    const cartBadge = document.getElementById("cart-count");

    if (!btnAgregar) return;

    e.preventDefault();
    if (btnAgregar.dataset.procesando == "true") return;
    const productoIdRaw = btnAgregar.getAttribute("data-id");
    if (
      !productoIdRaw ||
      productoIdRaw === "null" ||
      productoIdRaw === "undefined"
    ) {
      return;
    }
    const productoId = Number(productoIdRaw);

    let stockDisponible = Number(btnAgregar.getAttribute("data-stock"));

    if (!productoId || isNaN(productoId)) {
      console.error("ID de producto invalido", productoIdRaw);
      return;
    }

    if (stockDisponible > 0) {
      btnAgregar.dataset.procesando = "true";
      btnAgregar.style.opacity = "0.6";
      stockDisponible--;
      btnAgregar.setAttribute("data-stock", stockDisponible);
      await addToCart(productoId, 1);
      btnAgregar.dataset.procesando = "false";
      btnAgregar.style.opacity = "1";
      if (cartBadge) {
        cartBadge.classList.add("scale-125", "bg-green-500");
        setTimeout(() => {
          cartBadge.classList.remove("scale-125", "bg-green-500");
        }, 300);
      }

      if (stockDisponible === 0) {
        actualizarBtn(btnAgregar);
      }
    } else {
      actualizarBtn(btnAgregar);
    }
  });
}

function actualizarBtn(btnAgregar) {
  const productoId = btnAgregar.getAttribute("data-id");
  if (!productoId) return;

  const botonesMismoProducto = document.querySelectorAll(
    `.btn-agregar-carrito[data-id="${productoId}"], #detalle-btn-agregar[data-id="${productoId}"]`,
  );

  botonesMismoProducto.forEach((btn) => {
    const card = btn.closest(".cards");
    if (card) {
      const contenedorAcciones = card.querySelector(
        ".flex.items-center.justify-between.pt-1.gap-2",
      );
      if (contenedorAcciones) {
        const btnVerDetalleHTML = card.querySelector(".btn-ver-detalle")
          ? card.querySelector(".btn-ver-detalle").outerHTML
          : "";
        contenedorAcciones.innerHTML = `
          <span class="w-75 text-center text-sm font-semibold text-red-500 bg-rose-500/30 border-1 border-red-400/20 rounded-3 py-1">
            Agotado
          </span>
          ${btnVerDetalleHTML}
        `;
      }
      return;
    }

    if (
      btn.id === "detalle-btn-agregar" ||
      btn.classList.contains("btn-agregar-carrito")
    ) {
      btn.outerHTML = `
        <span class="w-full text-center text-sm font-semibold text-red-500 bg-rose-500/30 border-1 border-red-400/20 rounded-xl py-2.5 block">
          Agotado
        </span>
      `;
    }
  });
}
