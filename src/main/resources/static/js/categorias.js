import { mostrarMensaje } from "./alerts.js";

const API_URL = "/api/categorias";

const formCategoria = document.getElementById("formCategoria");
const tbodyCategoria = document.getElementById("tbody");
const submitBtn = document.getElementById("submit-btn");
const btnCancelar = document.getElementById("cancelarBtn");

const inputId = document.getElementById("id");
const inputNombre = document.getElementById("nombreCategoria");
const inputEstado = document.getElementById("estado");
const inputDescripcion = document.getElementById("descripcion");

let listaCategorias = [];

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
                    <button class="btn btn-sm btn-warning btn-editar"  data-id="${categoria.id}">
                      <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-eliminar"  data-id="${categoria.id}" data-nombre="${categoria.nombreCategoria}">
                      <i class="bi bi-trash3"></i>
                    </button>
    `;
    tr.innerHTML = `
                <td class="text-center">${categoria.id}</td>
                  <td>${categoria.nombreCategoria}</td>
                  <td>${categoria.estado === "true" || categoria.estado === true ? "Activo" : "Inactivo"}</td>
                  <td>${categoria.descripcion}</td>
                  <td class="flex justify-center gap-2">${botonesHtml}</td>       
    `;
    tbodyCategoria.appendChild(tr);
  });
};

/**
 * Limpia los espacios, pasa el nombre a minusculas y pone la primera letra en mayusculas
 * @param {string} nombreCategoria
 */
const normalizarNombre = (nombreCategoria) => {
  const limpio = nombreCategoria.trim().toLowerCase();
  if (!limpio) return "";
  return limpio.charAt(0).toUpperCase() + limpio.slice(1);
};

/**
 * @param {string|number} id
 */
const cargarFormulario = (id) => {
  const categoriaSeleccionada = listaCategorias.find(
    (cat) => String(cat.id) === String(id),
  );

  if (categoriaSeleccionada) {
    inputId.value = categoriaSeleccionada.id;
    inputNombre.value = categoriaSeleccionada.nombreCategoria;
    inputEstado.value = String(categoriaSeleccionada.estado);
    inputDescripcion.value = categoriaSeleccionada.descripcion;

    submitBtn.textContent = "Actualizar";
  }
};

/**
 * @param {Event} event
 */
const handleFormSubmit = async (event) => {
  event.preventDefault();

  const id = inputId.value;
  const nombreLimpio = normalizarNombre(inputNombre.value);

  const categoriaExiste = listaCategorias.some(
    (cat) =>
      cat.nombreCategoria.toLowerCase() === nombreLimpio.toLowerCase() &&
      String(cat.id) !== String(id),
  );

  if (categoriaExiste) {
    alert(`La categoria "${nombreLimpio}" ya existe.`);
    return;
  }

  const nuevaCategoria = {
    nombreCategoria: nombreLimpio,
    estado: document.getElementById("estado").value,
    descripcion: document.getElementById("descripcion").value,
  };

  if (id) {
    await updateCategoria(id, nuevaCategoria);
  } else {
    try {
      const respuesta = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaCategoria),
      });

      if (respuesta.ok) {
        mostrarMensaje("success", "Categoría resgistrado con éxito");
        resetForm();
        fetchAndRenderCategorias();
      } else {
        const errorData = await respuesta.json();
        alert("Error del servidor: " + errorData.message);
      }
    } catch (error) {
      console.error("Error en handleFormSubmit:", error);
      alert("No se pudo crear la categoria.");
    }
  }
};

/**
 * @param {string|number} id
 * @param {Object} datos
 */
const updateCategoria = async (id, datos) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    if (response.ok) {
      mostrarMensaje("success", "La categoría ha sido editada!");
      resetForm();
      fetchAndRenderCategorias();
    } else {
      alert("No se pudo actualizar la categoria");
    }
  } catch (error) {
    console.error("Error en updateCategoria: ", error);
    alert("Error al intentar actualizar la categoria");
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
    mostrarMensaje("danger", "La categoría ha sido eliminada");
  }
};

const resetForm = () => {
  formCategoria.reset();
  inputId.value = "";
  submitBtn.textContent = "Guardar";
};

btnCancelar.addEventListener("click", () => {
  if (confirm("¿Seguro que deaseas cancelar el registro?")) {
    resetForm();
  }
});

tbodyCategoria.addEventListener("click", (event) => {
  const botonEditar = event.target.closest(".btn-editar");
  const botonElimiar = event.target.closest(".btn-eliminar");

  if (botonEditar) {
    const id = botonEditar.dataset.id;
    cargarFormulario(id);
  }

  if (botonElimiar) {
    const id = botonElimiar.dataset.id;
    const nombre = botonElimiar.dataset.nombre;
    deleteCategoria(id, nombre);
  }
});

formCategoria.addEventListener("submit", handleFormSubmit);
fetchAndRenderCategorias();
