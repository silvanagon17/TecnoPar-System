import { obtenerProductos } from "../controllers/productoService.js";

const listaCarrito = document.getElementById("carrito-list");
const totalCont = document.getElementById("cart-total");
const countCont = document.getElementById("cart-count");

let carrito = [];
let productosDisponibles = [];

const formatoMoneda = new Intl.NumberFormat("es-PY");

async function inicializar() {
  try {
    productosDisponibles = await obtenerProductos();
    renderizarCarrito();
  } catch (error) {
    console.error("Error al obtener los productos: ", error);
  }
}

export function addToCart(prodId) {
  const p = productosDisponibles.find((prod) => prod.id === prodId);

  if (!p) {
    console.error("Producto no encontrado");
    return;
  }

  const itemExistente = carrito.find((item) => item.producto.id === prodId);

  if (itemExistente) {
    itemExistente.cantidad += 1;
  } else {
    carrito.push({
      producto: p,
      cantidad: 1,
      estado: "PENDIENTE",
      codigo: `CART-${Date.now()}`,
    });
  }
  renderizarCarrito();
}

export function removeFromCart(prodId) {
  carrito = carrito.filter((item) => item.producto.id !== prodId);
  renderizarCarrito();
}

export function cambiarCantidad(prodId, nuevaCantidad) {
  const cantidadNum = parseInt(nuevaCantidad, 15);
  if (cantidadNum <= 0) {
    removeFromCart(prodId);
    return;
  }

  const item = carrito.find((i) => i.producto.id === prodId);
  if (item) {
    item.cantidad = cantidadNum;
    renderizarCarrito();
  }
}

const renderizarCarrito = () => {
  if (!listaCarrito) return;

  listaCarrito.innerHTML = "";
  if (carrito.length === 0) {
    listaCarrito.innerHTML = `<div class=" text-center text-[14px] p-2">
                        El carrito está vacío.
                      </div>`;
    return;
  }

  let total = 0;
  let totalItems = 0;

  carrito.forEach(({ producto, cantidad }) => {
    const subtotal = (producto.pre_venta || 0) * cantidad;
    total += subtotal;
    totalItems += cantidad;
    const div = document.createElement("div");
    div.classList.add("carrito-item", "border-b", "py-2");

    div.innerHTML = div.innerHTML = `
      <div class="p-1 mx-2 rounded-1 d-flex align-items-center justify-content-between">
        <div class="w-[30px] h-[30px] mr-3">
          <img
            src="${producto.url_imagen || ""}"
            alt="${producto.nombreProducto || "Producto"}"
            class="object-cover w-full h-full rounded"
          />
        </div>
        <div class="w-100 me-2">
          <p class="text-[17px] capitalize text-blue-500 font-semibold mb-0">
            ${producto.nombreProducto}
          </p>
          <div class="d-flex w-100 justify-content-between align-items-center">
            <div class="precio">
              <span class="text-[15px] font-bold">Gs. ${formatoMoneda.format(subtotal)}</span>
              <small class="block text-xs">(Gs. ${formatoMoneda.format(producto.pre_venta)} c/u)</small>
            </div>
            
            <div class="d-flex align-items-center gap-2">
              <input 
                type="number" 
                min="1" 
                value="${cantidad}" 
                class="form-control form-control-sm input-cantidad w-16"
                data-id="${producto.id}"
              />
              <button
                class="btn hover:text-red-500 btn-eliminar" 
                data-id="${producto.id}"
                title="Eliminar"
              >
                <i data-lucide="trash-2" class="w-5 h-5"></i>
              </button>
            </div>
          </div>
        </div>
      </div>`;
    listaCarrito.appendChild(div);
  });

  if (totalCont) totalCont.innerHTML = `Gs. ${formatoMoneda.format(total)}`;
  if (countCont) countCont.innerText = totalItems;

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  eventos();
};

function eventos() {
  document.querySelectorAll(".btn-eliminar").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = Number(e.currentTarget.getAttribute("data-id"));
      removeFromCart(id);
    });
  });

  document.querySelectorAll(".input-cantidad").forEach((input) => {
    input.addEventListener("change", (e) => {
      const id = Number(e.target.getAttribute("data-id"));
      cambiarCantidad(id, e.target.value);
    });
  });
}

inicializar();
