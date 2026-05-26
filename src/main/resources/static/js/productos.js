import { mostrarMensaje } from "./components/alerts.js";
import { normalizarTexto } from "./utils/stringFormatter.js";

const API_URL = "/api/productos";
const API_CATEGORIAS = "/api/categorias";
const BASE_URL_IMAGEN = "/image/productos/";

const formProducto = document.getElementById("formProducto");
const tbodyProductos = document.getElementById("tbody");
const submitBtn = document.getElementById("submit-btn");
const btnCancelar = document.getElementById("cancelarBtn");

const inputId = document.getElementById("id");
const inputNombre = document.getElementById("nombreProducto");
const inputFoto = document.getElementById("dropzone-file");
const previewImage = document.getElementById("image-preview");
const previewContainer = document.getElementById("preview-container");
const fileName = document.getElementById("file-name");
const uploadArea = document.getElementById("upload-area");
const removeButton = document.getElementById("remove-button");

let listaProductos = [];

const fetchAndRenderProductos = async () => {
  try {
    const respuesta = await fetch(API_URL);
    listaProductos = await respuesta.json();
    renderTabla(listaProductos);
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
    const selecCategoria = document.getElementById("nombreCategoria");

    selecCategoria.innerHTML =
      '  <option value="">Seleccionar Categoria</option>';
    ctg.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.nombreCategoria;
      selecCategoria.appendChild(opt);
    });
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
    const nombreArchivo = producto.url_imagen
      ? producto.url_imagen.split("/").pop()
      : "";
    const fullImagenUrl = producto.url_imagen
      ? `${BASE_URL_IMAGEN}${nombreArchivo}`
      : "http://via.placeholder.com/50?text=Sin+Foto";

    let botonesHtml = `
                    <button class="btn btn-sm btn-warning btn-editar" data-id="${producto.id}" tittle="Modificar">
                      <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-eliminar"  data-id="${producto.id}" data-nombre="${producto.nombreProducto}" tittle="Eliminar">
                      <i class="bi bi-trash3"></i>
                    </button>
    `;

    tr.innerHTML = `
             <td class="text-center">${producto.id}</td>
                  <td>${producto.nombreProducto}</td>
                  <td>${producto.codigo}</td>
                  <td>${producto.stock}</td>
                  <td>${new Intl.NumberFormat("es-ES", {
                    style: "currency",
                    currency: "PYG",
                    maximumFractionDigits: 0,
                  }).format(producto.pre_venta)}</td>
                  <td>${producto.estado === "true" || producto.estado === true ? "Activo" : "Inactivo"}</td>
                  <td>${producto.categoria?.nombreCategoria}</td>
                  <td>${producto.url_imagen}</td>
                  <td>${producto.descripcion}</td>
                  <td class="flex justify-center gap-2">${botonesHtml}</td>
        `;
    tbodyProductos.appendChild(tr);
  });
};

/**
 * @param {string|number} id
 */
const cargarFormulario = (id) => {
  const productoSeleccionado = listaProductos.find(
    (prod) => String(prod.id) === String(id),
  );

  if (productoSeleccionado) {
    document.getElementById("id").value = productoSeleccionado.id;
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
      document.getElementById("file-name").textContent = nombreArchivo;

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

  const id = inputId.value;
  const nombreLimpio = normalizarTexto(inputNombre.value);
  const selectCategoria = document.getElementById("nombreCategoria");

  const productoExiste = listaProductos.some(
    (prod) =>
      prod.nombreProducto.toLowerCase() === nombreLimpio.toLowerCase() &&
      String(prod.id) !== String(id),
  );

  if (productoExiste) {
    alert(`El producto "${normalizado}" ya existe.`);
    return;
  }

  const nuevoProducto = {
    nombreProducto: normalizado,
    codigo: document.getElementById("codigo").value,
    stock: document.getElementById("stock").value,
    pre_venta: document.getElementById("pre_venta").value,
    estado: document.getElementById("estado").value === "true",
    categoria: { id: Number(selectCategoria.value) },
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

  if (id) {
    await updateProducto(id, formData);
  } else {
    try {
      const respuesta = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (respuesta.ok) {
        mostrarMensaje("success", "Producto registrado con éxito!");
        resetForm();
        fetchAndRenderProductos();
      } else {
        const errorData = await respuesta.json();
        alert("Error del servidor: " + errorData.message);
      }
    } catch (error) {
      console.error("Error en handleFormSubmit: ", error);
    }
  }
};

/**
 * @param {string|number} id
 * @param {FormData} formData
 */
const updateProducto = async (id, formData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: formData,
    });
    if (response.ok) {
      mostrarMensaje("success", "El producto ha sido editado!");
      resetForm();
      fetchAndRenderProductos();
    } else {
      alert("No se pudo actualizar el producto");
    }
  } catch (error) {
    console.error("Error en updateProducto: ", error);
    alert("Error al intentar actualizar la categoria");
  }
};

/**
 * @param {string|number} id
 * @param {string} nombre
 */
const deleteProducto = async (id, nombre) => {
  if (
    confirm(`¿Estás seguro de que quieres eliminar el producto: "${nombre}"`)
  ) {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      fetchAndRenderProductos();
    } catch (error) {
      console.error("Error en deleteProducto: ", error);
      alert("No se pudo eliminar el producto");
    }
    mostrarMensaje("danger", "El producto ha sido eliminado");
  }
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
      fileName.textContent = file.name;
      uploadArea.classList.add("hidden");
      previewContainer.classList.remove("hidden");
    };

    reader.readAsDataURL(file);
  }
});

removeButton.addEventListener("click", function () {
  inputFoto.value = "";
  previewImage.src = "";
  fileName.textContent = "";
  uploadArea.classList.remove("hidden");
  previewContainer.classList.add("hidden");
});

const resetForm = () => {
  formProducto.reset();
  inputId.value = "";
  inputFoto.value = "";
  previewImage.src = "";
  fileName.textContent = "";
  uploadArea.classList.remove("hidden");
  previewContainer.classList.add("hidden");
  submitBtn.textContent = "Guardar";
};

btnCancelar.addEventListener("click", () => {
  if (confirm("¿Seguro que deseas cancelar el registro?")) {
    resetForm();
  }
});

tbodyProductos.addEventListener("click", (event) => {
  const botonEditar = event.target.closest(".btn-editar");
  const botonEliminar = event.target.closest(".btn-eliminar");

  if (botonEditar) {
    const id = botonEditar.dataset.id;
    cargarFormulario(id);
  }

  if (botonEliminar) {
    const id = botonEliminar.dataset.id;
    const nombre = botonEliminar.dataset.nombre;
    deleteProducto(id, nombre);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  cargarCategoria();
});

formProducto.addEventListener("submit", handleFormSubmit);
fetchAndRenderProductos();
