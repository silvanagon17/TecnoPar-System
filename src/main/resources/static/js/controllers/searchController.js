import { obtenerProductos } from "../service/productoService.js";
import { crearTarjetaProducto } from "../components/cardsProductoElement.js";
import { goToHomeView, goToSearch } from "../utils/changeView.js";

const inputBuscador = document.getElementById("search-input");
const contenedorResultados = document.getElementById("vista-catalogo-completo");

const filtrarYMostrarProductos = async () => {
  if (!inputBuscador) return;
  const terminoBusqueda = inputBuscador.value.trim().toLowerCase();
  const productos = await obtenerProductos();

  if (!terminoBusqueda) return;

  const productosFiltrados = productos.filter((prod) => {
    const prodActivo = prod.estado === true || prod.estado === "true";
    const catActiva =
      prod.categoria &&
      (prod.categoria.estado === true || prod.categoria.estado === "true");

    if (!prodActivo || !catActiva) return false;

    const nombreProd = prod.nombreProducto?.toLowerCase() || "";
    const nombreCat = prod.categoria?.nombreCategoria?.toLowerCase() || "";

    return (
      nombreProd.includes(terminoBusqueda) ||
      nombreCat.includes(terminoBusqueda)
    );
  });

  if (typeof goToSearch === "function") {
    goToSearch();
  }

  contenedorResultados.innerHTML = "";

  if (contenedorResultados) {
    if (productosFiltrados.length === 0) {
      contenedorResultados.innerHTML = `
        <div class="p-8 text-center">
          <p class="text-lg text-gray-600">No se encontraron productos coincidentes con "<strong>${inputBuscador.value.trim()}</strong>".</p>
        </div>
      `;
    } else {
      contenedorResultados.innerHTML = `
        <div class="mb-8 mt-[100px]">
            <div class="flex items-center space-x-4 mb-4 pb-3 border-b">
            <button
                id="btn-volver"
                class="btn-return p-2 rounded-xl transition-all"
            >
                <i data-lucide="arrow-left" class="w-4 h-4"></i>
            </button>
            <div>
                <h2 class="text-xl font-bold">Resultados para: "${inputBuscador.value.trim()}"</h2>
            </div>
            </div>
    
          <div class="grid-productos grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            ${productosFiltrados.map((prod) => crearTarjetaProducto(prod)).join("")}
          </div>
        </div>
      `;
    }

    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }
};

if (inputBuscador) {
  inputBuscador.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      filtrarYMostrarProductos();
    }
  });
}
