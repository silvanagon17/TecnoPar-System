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

    btnAgregar.dataset.procesando = "true";
    btnAgregar.style.opacity = "0.6";
    stockDisponible--;
    await addToCart(productoId, 1);
    btnAgregar.dataset.procesando = "false";
    btnAgregar.style.opacity = "1";
    if (cartBadge) {
      cartBadge.classList.add("scale-125", "bg-green-500");
      setTimeout(() => {
        cartBadge.classList.remove("scale-125", "bg-green-500");
      }, 300);
    }
  });
}
