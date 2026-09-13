import { mostrarMensaje } from "../components/alerts.js";
import {
  goToFormView,
  goToListarView,
  openStockModal,
  closeStockModal,
} from "../utils/changeView.js";
import {
  renderStock,
  renderState,
  calcularNuevoStock,
} from "../utils/strockControl.js";
import {
  cargarNotificacionStock,
  initNotificationListeners,
  agregaNotificacion,
} from "../utils/dropdownNotif.js";
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../service/productoService.js";

document.addEventListener("DOMContentLoaded", () => {
  initNotificationListeners();
  cargarNotificacionStock();
});

const API_CATEGORIAS = "/api/categorias";
const BASE_URL_IMAGEN = "/image/productos/";

const formProducto = document.getElementById("formProducto");
const tbodyProductos = document.getElementById("tbody");
const submitBtn = document.getElementById("submit-btn");
const btnCancelar = document.getElementById("cancelarBtn");

const inputNombre = document.getElementById("nombreProducto");
const inputCodigo = document.getElementById("codigo");
const inputPrecio = document.getElementById("pre_venta");
const inputDescripcion = document.getElementById("descripcion");
const inputFoto = document.getElementById("dropzone-file");
const previewImage = document.getElementById("image-preview");
const previewContainer = document.getElementById("preview-container");
const fileName = document.getElementById("file-name");
const uploadArea = document.getElementById("upload-area");
const removeButton = document.getElementById("remove-button");

const formStock = document.getElementById("form-reponer-stock");
const inputCantidadModal = document.getElementById("modal-input-cantidad");
const inputProductoIdModal = document.getElementById("modal-producto-id");
const txtNombreModal = document.getElementById("modal-producto-nombre");
const txtActualModal = document.getElementById("modal-stock-actual");
const txtTotalModal = document.getElementById("modal-stock-total");
const btnCerrarModalStock = document.getElementById("cerrar-modal-stock");
const btnCancelarModalStock = document.getElementById("btn-cancelar-stock");

const nuevoRegistro = document.getElementById("nuevoRegistro");
const volver = document.getElementById("volver");
const filtrarCategoria = document.getElementById("categoryFilter");

const inputCombobox = document.querySelector(
  "#combobox-categoria-form .combo-input",
);
const hiddenInput = document.querySelector(
  "#combobox-categoria-form .combo-value",
);

const confirmModal = document.getElementById("confirm-modal");

let listaProductos = [];
let idProductoEdicion = null;

const token = localStorage.getItem("token");
const tipoUsuario = localStorage.getItem("tipoUsuario");

if (!token || tipoUsuario !== "ADMIN") {
  window.location.href = "/index.html";
}

const fetchAndRenderProductos = async () => {
  try {
    listaProductos = await obtenerProductos();
    renderTabla(listaProductos);
    cargarNotificacionStock(listaProductos);
  } catch (error) {
    console.error("Error al obtener los productos: ", error);
    tbodyProductos.innerHTML =
      '<tr><td colspan="8" class="text-center text-danger">Error al cargar los datos.</td></tr>';
  }
};

const cargarCategoria = async () => {
  try {
    const apiCategoria = await fetch(API_CATEGORIAS);
    const ctg = await apiCategoria.json();

    const categoriasFiltradas = ctg.map((c) => ({
      id: c.id,
      nombre: c.nombreCategoria,
    }));

    inicializarCombobox("combobox-categoria-form", categoriasFiltradas);
    inicializarCombobox("combobox-categoria-table", categoriasFiltradas);
  } catch (error) {
    console.error("Error al cargar las categorias: ", error);
  }
  fetchAndRenderProductos();
};

/**
 *
 * @param {Array} productos
 */
const renderTabla = (productos) => {
  tbodyProductos.innerHTML = "";
  if (productos.length === 0) {
    tbodyProductos.innerHTML =
      '<tr><td colspan="10" class="text-center">No hay productos registrados.</td></tr>';
    return;
  }
  productos.forEach((producto) => {
    const tr = document.createElement("tr");

    let botonesHtml = `
                        <button
                          class="btn hover:text-green-500 btn-reponer-stock" data-id="${producto.id}"
                          data-nombre="${producto.nombreProducto}"
                          data-stock="${producto.stock}"
                          title="Reponer Stock"
                        >
                          <i data-lucide="archive-restore" class="w-5 h-5"></i>
                        </button>
                        <button
                          class="btn hover:text-yellow-500 btn-editar" data-id="${producto.id}" 
                          title="Editar"
                          id="btnEditar"
                        >
                          <i data-lucide="pencil-line" class="w-5 h-5"></i>
                        </button>
                        <button
                          class="btn hover:text-red-600 btn-eliminar" data-id="${producto.id}" data-nombre="${producto.nombreProducto}"
                          title="Eliminar"
                          id="btnEliminar"
                        >
                          <i data-lucide="trash-2" class="w-5 h-5"></i>
                        </button>
    `;

    tr.innerHTML = `
                  <td class="text-center">${producto.id}</td>
                  <td>${producto.nombreProducto}</td>
                  <td class="text-center">${producto.codigo}</td>
                  <td class="text-center">${producto.categoria?.nombreCategoria}</td>
                  <td class="text-center px-5">${new Intl.NumberFormat(
                    "es-ES",
                    {
                      style: "currency",
                      currency: "PYG",
                      maximumFractionDigits: 0,
                    },
                  ).format(producto.pre_venta)}</td>
                  <td class="text-center">${renderStock(producto.stock)}</td>
                  <td class="text-center estado">${renderState(producto.estado)}</td>
                  <td class="flex justify-center gap-1">${botonesHtml}</td>
        `;
    tbodyProductos.appendChild(tr);
  });
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
};

const modalStock = (id, nombre, stock) => {
  inputProductoIdModal.value = id;
  txtNombreModal.textContent = nombre;
  txtActualModal.textContent = stock;
  inputCantidadModal.value = 1;

  txtTotalModal.textContent = calcularNuevoStock(stock, 1);
  openStockModal();
};

inputCantidadModal?.addEventListener("input", () => {
  const stockActual = Number(txtActualModal.textContent) || 0;
  const stockIngreso = Number(inputCantidadModal.value) || 0;
  txtTotalModal.textContent = calcularNuevoStock(stockActual, stockIngreso);
});

btnCerrarModalStock?.addEventListener("click", closeStockModal);
btnCancelarModalStock?.addEventListener("click", closeStockModal);

formStock?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = inputProductoIdModal.value;
  const cantidadIngresada = parseInt(inputCantidadModal.value, 10);

  if (cantidadIngresada <= 0) return;

  try {
    const response = await fetch(
      `/api/productos/${id}/reponer-stock?cantidad=${cantidadIngresada}`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (response.ok) {
      closeStockModal();
      mostrarMensaje(
        "success",
        "circle-check",
        "¡Stock actualizado con éxito!",
      );
      await fetchAndRenderProductos();
    } else {
      mostrarMensaje("danger", "circle-x", "Error al actualizar el stock.");
    }
  } catch (error) {
    console.error("Error al reponer stock:", error);
    mostrarMensaje("danger", "circle-x", "Error de conexión con el servidor.");
  }
});

/**
 * @param {string|number} id
 */
const cargarFormulario = (id) => {
  const productoSeleccionado = listaProductos.find(
    (prod) => String(prod.id) === String(id),
  );

  if (productoSeleccionado) {
    idProductoEdicion = productoSeleccionado.id;
    document.getElementById("nombreProducto").value =
      productoSeleccionado.nombreProducto;
    document.getElementById("codigo").value = productoSeleccionado.codigo;
    document.getElementById("stock").value = productoSeleccionado.stock;
    document.getElementById("pre_venta").value = productoSeleccionado.pre_venta;
    document.getElementById("estado").value = String(
      productoSeleccionado.estado,
    );
    document.getElementById("descripcion").value =
      productoSeleccionado.descripcion;

    if (productoSeleccionado.categoria) {
      document.getElementById("nombreCategoria").value =
        productoSeleccionado.categoria.id;
    }

    if (productoSeleccionado.url_imagen) {
      const nombreArchivo = productoSeleccionado.url_imagen.split("/").pop();

      document.getElementById("image-preview").src =
        `${BASE_URL_IMAGEN}${nombreArchivo}`;

      document.getElementById("upload-area").classList.add("hidden");
      document.getElementById("preview-container").classList.remove("hidden");
      document.getElementById("preview-container").classList.add("flex");
    }

    submitBtn.textContent = "Actualizar";
  }
};

/**
 * @param {Event} event
 */
const handleFormSubmit = async (event) => {
  event.preventDefault();

  const idEditar = idProductoEdicion;
  const textNombreProducto = inputNombre.value;
  const selectCategoria = document.getElementById("nombreCategoria");

  const productoExiste = listaProductos.some(
    (prod) =>
      prod.nombreProducto.toLowerCase() === textNombreProducto.toLowerCase() &&
      String(prod.id) !== String(idEditar),
  );

  if (productoExiste) {
    alert(`El producto "${textNombreProducto}" ya existe.`);
    return;
  }

  const categoriaId = Number(selectCategoria.value);

  const nuevoProducto = {
    nombreProducto: textNombreProducto,
    codigo: document.getElementById("codigo").value,
    stock: document.getElementById("stock").value,
    pre_venta: document.getElementById("pre_venta").value,
    estado: document.getElementById("estado").value === "true",
    categoria: categoriaId ? { id: categoriaId } : null,
    descripcion: document.getElementById("descripcion").value,
  };

  const formData = new FormData();
  formData.append(
    "producto",
    new Blob([JSON.stringify(nuevoProducto)], { type: "application/json" }),
  );

  if (inputFoto.files[0]) {
    formData.append("file", inputFoto.files[0]);
  }

  try {
    if (idEditar !== null) {
      await actualizarProducto(idEditar, formData);
      mostrarMensaje("success", "circle-check", "Producto ha sido editado!");
    } else {
      await crearProducto(formData);
      mostrarMensaje(
        "success",
        "circle-check",
        "Producto registrado con éxito!",
      );
    }
    resetForm();
    await fetchAndRenderProductos();
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
const deleteProducto = async (id, nombre) => {
  confirmModal.show({
    title: "¿Eliminar producto?",
    message: `¿Estás seguro de que quieres eliminar el producto de nombre: "${nombre}"`,
    confirmText: "Sí, eliminar",
    onConfirm: async () => {
      try {
        await eliminarProducto(id);
        mostrarMensaje(
          "success",
          "circle-check",
          "El producto ha sido eliminado.",
        );
        await fetchAndRenderProductos();
      } catch (error) {
        console.error("Error en deleteProducto: ", error);
        mostrarMensaje(
          "danger",
          "circle-x",
          "No se pudo eliminar el producto.",
        );
      }
    },
  });
};

inputFoto.addEventListener("change", function (e) {
  const file = e.target.files[0];

  if (file) {
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecciona un archivo de imagen válido.");
      return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
      previewImage.src = event.target.result;
      uploadArea.classList.add("hidden");
      previewContainer.classList.remove("hidden");
    };

    reader.readAsDataURL(file);
  }
});

removeButton.addEventListener("click", function () {
  inputFoto.value = "";
  previewImage.src = "";
  uploadArea.classList.remove("hidden");
  previewContainer.classList.add("hidden");
});

const resetForm = () => {
  formProducto.reset();
  idProductoEdicion = null;
  inputFoto.value = "";
  previewImage.src = "";
  if (inputCombobox) inputCombobox.value = "";
  if (hiddenInput) {
    hiddenInput.value = "";
    inputCombobox.dispatchEvent(new Event("input"));
  }
  uploadArea.classList.remove("hidden");
  previewContainer.classList.add("hidden");
  submitBtn.textContent = "Guardar";
};

const confirmarCancelar = () => {
  const formLoaded =
    inputNombre.value.trim() !== "" ||
    inputCodigo.value.trim() !== "" ||
    inputPrecio.value.trim() !== "" ||
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

tbodyProductos.addEventListener("click", (event) => {
  const botonEditar = event.target.closest(".btn-editar");
  const botonEliminar = event.target.closest(".btn-eliminar");
  const botonStock = event.target.closest(".btn-reponer-stock");

  if (botonStock) {
    const { id, nombre, stock } = botonStock.dataset;
    modalStock(id, nombre, stock);
  }

  if (botonEditar) {
    const id = botonEditar.dataset.id;
    cargarFormulario(id);
    goToFormView();
  }

  if (botonEliminar) {
    const { id, nombre } = botonEliminar.dataset;
    deleteProducto(id, nombre);
  }
});

nuevoRegistro.addEventListener("click", (event) => {
  resetForm();
  goToFormView();
});

btnCancelar.addEventListener("click", confirmarCancelar);
volver.addEventListener("click", confirmarCancelar);

document.addEventListener("DOMContentLoaded", async () => {
  await cargarCategoria();
  await fetchAndRenderProductos();
});

formProducto.addEventListener("submit", handleFormSubmit);
