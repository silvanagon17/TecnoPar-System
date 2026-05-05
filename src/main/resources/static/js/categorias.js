const API_URL = "/api/categorias";

const formCategoria = document.getElementById("formCategoria");
const tbodyCategoria = document.getElementById("tbody");

let listaCategorias = [];
let categoria;

const fetchAndRenderCategorias = async () => {
  try {
    const respuesta = await fetch(API_URL);
    listaCategorias = await respuesta.json();
    renderTabla(listaCategorias);
  } catch (error) {
    console.error("Error al obtener las categorias: ", error);
    tbodyCategoria.innerHTML =
      '<tr><td colspan="8" class="text-center text-danger">Error al cargar los datos.</td></tr>';
  }
};

/**
 * @param {Array} categorias
 */
const renderTabla = (categorias) => {
  tbodyCategoria.innerHTML = "";
  if (categorias.length === 0) {
    tbodyCategoria.innerHTML =
      '<tr><td colspan="10" class="text-center">No hay categorias registradas.</td></tr>';
    return;
  }
  categorias.forEach((categoria) => {
    const tr = document.createElement("tr");
    let botonesHtml = `
                    <button class="btn btn-sm btn-warning"  onclick="editCategoria('${categoria.id}')">
                      <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-sm btn-danger"  onclick="deleteCategoria('${categoria.id}', '${categoria.nombreCategoria}')">
                      <i class="bi bi-trash3"></i>
                    </button>
    `;
    tr.innerHTML = `
                <td class="text-center">${categoria.id}</td>
                  <td>${categoria.nombreCategoria}</td>
                  <td>${categoria.estado}</td>
                  <td>${categoria.descripcion}</td>
                  <td class="flex justify-center gap-2">${botonesHtml}</td>       
    `;
    tbodyCategoria.appendChild(tr);
  });
};

/**
 * Limpia los espacios, pasa el nombre a minusculas y pone la primera letra en mayusculas
 */
const normalizarNombre = (nombreCategoria) => {
  const limpio = nombreCategoria.trim().toLowerCase();
  if (!limpio) return "";
  return limpio.charAt(0).toUpperCase() + limpio.slice(1);
};

/**
 * @param {Event} event
 */
const handleFormSubmit = async (event) => {
  event.preventDefault();

  const nombre = document.getElementById("nombreCategoria").value;
  const nombreLimpio = normalizarNombre(nombre);

  const CategoriaExiste = listaCategorias.some(
    (cat) => cat.nombreCategoria.toLowerCase() === nombreLimpio.toLowerCase(),
  );

  if (CategoriaExiste) {
    alert(`La categoria "${nombreLimpio}" ya existe.`);
    return;
  }

  const nuevaCategoria = {
    nombreCategoria: nombreLimpio,
    estado: document.getElementById("estado").value,
    descripcion: document.getElementById("descripcion").value,
  };
  try {
    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevaCategoria),
    });

    if (respuesta.ok) {
      formCategoria.reset();
      fetchAndRenderCategorias();
    } else {
      const errorData = await respuesta.json();
      alert("Error del servidor: " + errorData.message);
    }
  } catch (error) {
    console.error("Error en handleFormSubmit:", error);
    alert("No se pudo crear la categoria.");
  }
};

/**
 * @param {string|number} id
 * @param {string} nombre
 */
const deleteCategoria = async (id, nombre) => {
  if (
    confirm(`¿Estás seguro de que quieres eliminar la categoria "${nombre}"?`)
  ) {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      fetchAndRenderCategorias();
    } catch (error) {
      console.error("Error en deleteCategoria: ", error);
      alert("No se pudo eliminar la categoria");
    }
  }
};

/**
 * @param {string|number} id
 */
const updateCategoria = async (id) => {};

formCategoria.addEventListener("submit", handleFormSubmit);
fetchAndRenderCategorias();
