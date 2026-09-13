import { obtenerProductos } from "../service/productoService.js";
import { addToCart } from "../utils/carrito.js";

const contenedorPrincipal = document.getElementById("contenedor-catalogo");

const agruparPorCategoria = (productos) => {
  return productos.reduce((acc, producto) => {
    const prodActivo = producto.estado === true || producto.estado === "true";
    const catActiva =
      producto.categoria &&
      (producto.categoria.estado === true ||
        producto.categoria.estado === "true");
    if (!prodActivo || !catActiva) return acc;
    const nombreCat = producto.categoria?.nombreCategoria || "Otros Productos";

    if (!acc[nombreCat]) {
      acc[nombreCat] = [];
    }
    acc[nombreCat].push(producto);
    return acc;
  }, {});
};

const renderizarProductosPorCategoria = async () => {
  const productos = await obtenerProductos();
  const productosAgrupados = agruparPorCategoria(productos);

  contenedorPrincipal.innerHTML = "";

  if (Object.keys(productosAgrupados).length === 0) {
    contenedorPrincipal.innerHTML =
      "<p>No hay productos disponibles actualmente.</p>";
    return;
  }

  for (const [categoria, listaProductos] of Object.entries(
    productosAgrupados,
  )) {
    const seccionCategoria = document.createElement("section");
    seccionCategoria.className = "seccion-categoria mb-8";
    seccionCategoria.innerHTML = `<div class="header-categoria flex justify-between items-center mb-4">
        <h2 class="text-xl uppercase flex items-center gap-3 font-extrabold ">${categoria}</h2>
          <button
            class="principal px-6 py-2 rounded-xl text-xs font-bold transition"
          >
            Ver todo el catálogo
          </button>
      </div>
      
         
      <div class="grid-productos grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2 mb-5">
        ${listaProductos.map((prod) => crearTarjetaProducto(prod)).join("")}
      </div>`;
    contenedorPrincipal.appendChild(seccionCategoria);
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }
};

const crearTarjetaProducto = (prod) => {
  const precioFormateado = new Intl.NumberFormat("es-PY").format(
    prod.pre_venta || 0,
  );

  return `
         <div
            class="cards rounded-3 overflow-hidden group hover:border-blue-500/30 transition-all"
            style="height: 390px"
            data-id="${prod.id}"
          >
            <div
              class="relative overflow-hidden cursor-pointer img-producto"
              style="display: flex; height: 200px; width: auto"
            >
              <img
                src="${prod.url_imagen}"
                alt="${prod.nombreProducto}"
                class="object-cover group-hover:scale-105 transition duration-700 w-full h-full"
              />
            </div>
            <div
              class="p-3 space-y-3 flex flex-col justify-content-between"
              style="height: 190px"
            >
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-[17px] capitalize text-blue-500">
                    ${prod.nombreProducto}
                  </p>
                  <div class="precio">
                    <span class="text-[19px]">Gs. ${precioFormateado}</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-between pt-1 gap-2">
                <button
                  type="button"
                  data-id="${prod.id}"
                  class="btn-agregar-carrito flex items-center w-75 justify-center bg-blue-600 hover:bg-blue-500 text-white rounded-3 transition active:scale-95"
                  style="padding: 5px 16px"
                >
                  <div class="flex justify-content-end items-center pointer-events-none">
                    <i data-lucide="shopping-cart" class="w-4 h-4 mx-1"></i>
                    <span>Agregar</span>
                  </div>
                </button>

                <button type="button" class="btn-ver-detalle" data-id="${prod.id}"> 
                  <i data-lucide="eye" class="pointer-events-none"></i> 
                </button>
              </div>
            </div>
          </div>`;
};

document.addEventListener("click", (e) => {
  const btnAgregar = e.target.closest(".btn-agregar-carrito");

  if (btnAgregar) {
    e.preventDefault();
    const productoIdRaw = btnAgregar.getAttribute("data-id");
    const productoId = Number(productoIdRaw);

    console.log("Intentando agregar producto ID:", productoId);

    if (productoId && !isNaN(productoId)) {
      addToCart(productoId, 1);
    } else {
      console.error("ID de producto inválido:", productoIdRaw);
    }
  }
});

document.addEventListener("DOMContentLoaded", renderizarProductosPorCategoria);
