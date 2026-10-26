import { obtenerProductos } from "../service/productoService.js";
import { goToCatalogoCompletoView, goToSearch } from "../utils/changeView.js";
import { renderizarProductosPorCategoria } from "../components/cardsProductoElement.js";

const obtenerIconoCategoria = (nombreCategoria) => {
  const iconMap = {
    hardware: "cpu",
    laptop: "laptop",
    redes: "router",
    periféricos: "keyboard",
    consolas: "gamepad-2",
    accesorios: "headphones",
    pc: "pc-case",
    audio: "video",
    dispositivos: "smartphone",
  };

  const clave = nombreCategoria.toLowerCase().trim();
  return iconMap[clave] || "tag";
};

const inicializarCarruselCategoria = async () => {
  const contenedorCarrusel = document.getElementById(
    "contenedor-carrusel-categoria",
  );
  if (!contenedorCarrusel) return;

  const productos = await obtenerProductos();
  const categoriaMap = new Map();

  productos.forEach((prod) => {
    const cat = prod.categoria;
    const catActiva = cat && (cat.estado === true || cat.estado === "true");

    if (catActiva && cat.nombreCategoria) {
      categoriaMap.set(cat.nombreCategoria, cat);
    }
  });

  const listaCategorias = Array.from(categoriaMap.values());

  contenedorCarrusel.innerHTML = "";

  listaCategorias.forEach((cat) => {
    const nombreCat = cat.nombreCategoria;
    const iconoLucide = obtenerIconoCategoria(nombreCat);

    const itemHTML = `
        <div
          class="categoria-item btn-ver-todo group cursor-pointer d-flex flex-column align-items-center text-center justify-content-center space-y-4"
          data-categoria="${nombreCat}"
        >
          <div class="c-categoria d-flex">
            <div
              class="category-bg w-full h-full rounded-3 border-2 group-hover:border-blue-500 transition-all flex items-center justify-center overflow-hidden p-3"
            >
              <i data-lucide="${iconoLucide}" class="h-8 w-8 pointer-events-none"></i>
            </div>
          </div>
          <p
            class="text-xs font-black group-hover:text-white tracking-widest gap-8 font-extrabold uppercase opacity-80 pointer-events-none"
          >
            ${nombreCat}
          </p>
        </div>
      `;
    contenedorCarrusel.innerHTML += itemHTML;
  });
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
};

document.addEventListener("DOMContentLoaded", inicializarCarruselCategoria);
