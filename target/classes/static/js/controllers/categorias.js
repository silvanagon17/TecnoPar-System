import { mostrarMensaje } from "../components/alerts.js";
import { goToFormView, goToListarView } from "../utils/changeView.js";
import { renderState } from "../utils/strockControl.js";
import { initNotificationListeners } from "../utils/dropdownNotif.js";
import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../service/categoriaService.js";

const formCategoria = document.getElementById("formCategoria");
const tbodyCategoria = document.getElementById("tbody");
const submitBtn = document.getElementById("submit-btn");
const btnCancelar = document.getElementById("cancelarBtn");
const nuevoRegistro = document.getElementById("nuevoRegistro");

const inputId = document.getElementById("id");
const inputNombre = document.getElementById("nombreCategoria");
const inputEstado = document.getElementById("estado");
const inputDescripcion = document.getElementById("descripcion");

const confirmModal = document.getElementById("confirm-modal");

let listaCategorias = [];
let idCategoriEdicion = null;

document.addEventListener("DOMContentLoaded", () => {
  initNotificationListeners();
});

const fetchAndRenderCategorias = async () => {
  try {
    listaCategorias = await obtenerCategorias();
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
    const esActivo = categoria.estado === "true" || categoria.estado === true;
    let botonesHtml = `
                        <button
                          class="btn hover:text-yellow-500 btn-editar" data-id="${categoria.id}" 
                          title="Editar"
                          id="btnEditar"
                        >
                          <i data-lucide="pencil-line" class="w-5 h-5"></i>
                        </button>
                        <button
                          class="btn hover:text-red-600 btn-eliminar" data-id="${categoria.id}" data-nombre="${categoria.nombreCategoria}"
                          title="Eliminar"
                          id="btnEliminar"
                        >
                          <i data-lucide="trash-2" class="w-5 h-5"></i>
                        </button>
    `;
    tr.innerHTML = `
                <td class="text-left px-5 ">${categoria.id}</td>
                  <td class="text-center">${categoria.nombreCategoria}</td>
                  <td class="text-center">${categoria.descripcion}</td>
                  <td class="text-center">${renderState(categoria.estado)}</td>
                  <td class="flex justify-center gap-2">${botonesHtml}</td>       
    `;
    tbodyCategoria.appendChild(tr);
  });
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
};

/**
 * @param {string|number} id
 */
const cargarFormulario = (id) => {
  const categoriaSeleccionada = listaCategorias.find(
    (cat) => String(cat.id) === String(id),
  );

  if (categoriaSeleccionada) {
    idCategoriEdicion = categoriaSeleccionada.id;
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

  const idEditar = idCategoriEdicion;
  const textNombreCategoria = inputNombre.value;

  const categoriaExiste = listaCategorias.some(
    (cat) =>
      cat.nombreCategoria.toLowerCase() === textNombreCategoria.toLowerCase() &&
      String(cat.id) !== String(idEditar),
  );

  if (categoriaExiste) {
    alert(`La categoria "${textNombreCategoria}" ya existe.`);
    return;
  }

  const nuevaCategoria = {
    nombreCategoria: textNombreCategoria,
    descripcion: document.getElementById("descripcion").value,
    estado: document.getElementById("estado").value,
  };

  try {
    if (idEditar !== null) {
      await actualizarCategoria(idEditar, nuevaCategoria);
      mostrarMensaje(
        "success",
        "circle-check",
        "La categoria ha sido editado!",
      );
    } else {
      await crearCategoria(nuevaCategoria);
      mostrarMensaje(
        "success",
        "circle-check",
        "Categoria registrado con éxito!",
      );
    }
    resetForm();
    await fetchAndRenderCategorias();
    goToListarView();
  } catch (error) {
    console.error("Error en handleFormSubmit: ", error);
    mostrarMensaje(
      "danger",
      "circle-x",
      error.message || "Error al procesar la solicitud",
    );
  }
};

/**
 * @param {string|number} id
 * @param {string} nombre
 */
const deleteCategoria = (id, nombre) => {
  confirmModal.show({
    title: "¿Eliminar categoría?",
    message: `¿Estás seguro de que quieres eliminar la categoría: "${nombre}"? Esta acción no se puede deshacer.`,
    confirmText: "Sí, eliminar",
    onConfirm: async () => {
      try {
        await eliminarCategoria(id);
        mostrarMensaje(
          "success",
          "circle-check",
          "La categoria ha sido eliminada.",
        );
        await fetchAndRenderCategorias();
      } catch (error) {
        console.error("Error en deleteCategoria: ", error);
        mostrarMensaje(
          "warning",
          "circle-x",
          "Error al intentar conectar con el servidor.",
        );
      }
    },
  });
};

const resetForm = () => {
  formCategoria.reset();
  idCategoriEdicion = null;
  submitBtn.textContent = "Guardar";
};

volver.addEventListener("click", (event) => {
  const formTieneDatos =
    inputNombre.value.trim() !== "" || inputDescripcion.value.trim() !== "";

  if (formTieneDatos) {
    confirmModal.show({
      title: "¿Deseas volver atrás?",
      message:
        "Has ingresado datos en el formulario. Si cancelas, se perderán los cambios.",
      confirmText: "Sí, cancelar",
      onConfirm: () => {
        resetForm();
        goToListarView();
      },
    });
  } else {
    resetForm();
    goToListarView();
  }
});

const confirmarCancelar = () => {
  const formLoaded =
    inputNombre.value.trim() !== "" ||
    inputEstado.value.trim() !== "" ||
    inputDescripcion.value.trim() !== "";

  if (formLoaded) {
    confirmModal.show({
      title: "¿Cancelar registro?",
      message:
        "Has ingresado datos en el formulario. Si cancelas, se perderán los cambios.",
      confirmText: "Sí, cancelar",
      onConfirm: () => {
        resetForm();
        goToListarView();
      },
    });
  } else {
    resetForm();
    goToListarView();
  }
};

btnCancelar.addEventListener("click", confirmarCancelar);
volver.addEventListener("click", confirmarCancelar);

nuevoRegistro.addEventListener("click", (event) => {
  resetForm();
  goToFormView();
});

tbodyCategoria.addEventListener("click", (event) => {
  const botonEditar = event.target.closest(".btn-editar");
  const botonEliminar = event.target.closest(".btn-eliminar");

  if (botonEditar) {
    const id = botonEditar.dataset.id;
    cargarFormulario(id);
    goToFormView();
  }

  if (botonEliminar) {
    const id = botonEliminar.dataset.id;
    const nombre = botonEliminar.dataset.nombre;
    deleteCategoria(id, nombre);
  }
});

formCategoria.addEventListener("submit", handleFormSubmit);
fetchAndRenderCategorias();
