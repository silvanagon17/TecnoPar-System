const listaCarrito = document.getElementById("carrito-list");
const totalCont = document.getElementById("cart-total");
const countCont = document.getElementById("cart-count");
const footerCarrito = document.getElementById("carrito-footer");

let carritoObjeto = null;
const formatoMoneda = new Intl.NumberFormat("es-PY");

const obtenerTokenLimpio = () => {
  let token = localStorage.getItem("token");
  if (!token) return null;
  return token
    .replace(/^"(.*)"$/, "$1")
    .replace(/^'(.*)'$/, "$1")
    .trim();
};

const obtenerHeaders = () => {
  const token = obtenerTokenLimpio();
  if (!token) {
    return { "Content-Type": "application/json" };
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export async function inicializar() {
  const token = obtenerTokenLimpio();
  if (!token) {
    console.error(
      "Usuario no autenticado. Inicia sesión para cargar el carrito.",
    );
    return;
  }

  try {
    const res = await fetch(`http://localhost:8080/api/carrito/mi-carrito`, {
      method: "GET",
      headers: obtenerHeaders(),
    });

    if (res.ok) {
      carritoObjeto = await res.json();
      renderizarCarrito();
    } else {
      console.error(`Error del servidor (${res.status}):`, res.statusText);
    }
  } catch (error) {
    console.error("Error de conexión al obtener el carrito: ", error);
  }
}

export async function addToCart(productoId, cantidad = 1) {
  try {
    const res = await fetch(
      `http://localhost:8080/api/carrito/agregar?productoId=${productoId}&cantidad=${cantidad}`,
      {
        method: "POST",
        headers: obtenerHeaders(),
      },
    );

    if (res.ok) {
      carritoObjeto = await res.json();
      renderizarCarrito();
    }
  } catch (error) {
    console.error("Error al agregar producto: ", error);
  }
}

export async function removeFromCart(detalleId) {
  try {
    const res = await fetch(
      `http://localhost:8080/api/carrito/item/${detalleId}`,
      {
        method: "DELETE",
        headers: obtenerHeaders(),
      },
    );

    if (res.ok) {
      carritoObjeto = await res.json();
      renderizarCarrito();
    }
  } catch (error) {
    console.error("Error al eliminar item: ", error);
  }
}

export async function cambiarCantidad(prodId, nuevaCantidad) {
  const cantidadNum = parseInt(nuevaCantidad, 10);
  if (cantidadNum <= 0) return;

  const detalleActual = carritoObjeto?.detalles?.find(
    (d) => d.producto.id === prodId,
  );

  if (detalleActual) {
    const diferencia = cantidadNum - detalleActual.cantidad;
    if (diferencia !== 0) {
      await addToCart(prodId, diferencia);
    }
  }
}

const renderizarCarrito = () => {
  if (!listaCarrito) return;
  listaCarrito.innerHTML = "";

  const detalles = carritoObjeto?.detalles || [];

  if (detalles.length === 0) {
    listaCarrito.innerHTML = `
        <div class="p-6 text-center text-gray-500">
          <i data-lucide="shopping-bag" class="w-8 h-8 mx-auto mb-2 opacity-40"></i>
          <p>Tu carrito está vacío.</p>
        </div>`;
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
    if (totalCont) totalCont.innerText = "Gs. 0";
    if (countCont) countCont.innerText = "0";
    if (footerCarrito) {
      footerCarrito.innerHTML = "";
      footerCarrito.classList.add("hidden");
    }
    return;
  }

  if (footerCarrito) {
    footerCarrito.classList.remove("hidden");
  }

  let totalItems = 0;

  detalles.forEach((item) => {
    const { id, cantidad, precioUnitario, producto } = item;
    const precioBase = precioUnitario || producto.pre_venta || 0;
    const subtotal = precioBase * cantidad;

    totalItems += cantidad;

    const div = document.createElement("div");
    div.classList.add("carrito-item", "border-b", "py-2");

    div.innerHTML = `
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
              <small class="block text-xs">(Gs. ${formatoMoneda.format(precioBase)} c/u)</small>
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
                data-detalle-id="${id}"
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

  const totalMonto = carritoObjeto?.montoTotal || 0;

  if (totalCont)
    totalCont.innerHTML = `Gs. ${formatoMoneda.format(totalMonto)}`;
  if (countCont) countCont.innerText = totalItems;

  if (footerCarrito) {
    footerCarrito.innerHTML = `
     <div class="py-2 px-3 flex flex-col gap-2">
        <div class="flex justify-between font-bold text-[14px]">
          <span>Total:</span>
          <span>Gs. ${formatoMoneda.format(totalMonto)}</span>
        </div>
      <button
        id="btn-procesar-compra"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-bold py-2 px-4 rounded-lg transition active:scale-95 cursor-pointer"
      >
        Finalizar Compra
      </button>
      </div>
    `;
  }

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  eventos();
};

function eventos() {
  document.querySelectorAll(".btn-eliminar").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = Number(e.currentTarget.getAttribute("data-detalle-id"));
      removeFromCart(id);
    });
  });

  document.querySelectorAll(".input-cantidad").forEach((input) => {
    input.addEventListener("change", (e) => {
      const id = Number(e.target.getAttribute("data-id"));
      cambiarCantidad(id, e.target.value);
    });
  });

  const btnCompra = document.getElementById("btn-procesar-compra");
  if (btnCompra) {
    btnCompra.addEventListener("click", () => {
      console.log("Comenzando el proceso de Checkout...");
    });
  }
}

export const initCarritoDropdown = () => {
  const btnCarrito = document.getElementById("btn-carrito");
  const dropdown = document.getElementById("carrito-dropdown");

  if (btnCarrito && dropdown) {
    btnCarrito.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
      if (
        !dropdown.classList.contains("hidden") &&
        !dropdown.contains(e.target) &&
        !btnCarrito.contains(e.target)
      ) {
        dropdown.classList.add("hidden");
      }
    });
  }
};

window.initCarritoDropdown = initCarritoDropdown;

document.addEventListener("DOMContentLoaded", () => {
  initCarritoDropdown();
  if (obtenerTokenLimpio) {
    inicializar();
  }
});
