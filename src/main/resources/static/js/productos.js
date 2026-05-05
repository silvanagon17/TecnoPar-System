const API_URL = "/api/productos";
const API_CATEGORIAS = "/api/categorias";
const BASE_URL_IMAGEN = "/image/";

const formProducto = document.getElementById("formProducto");
const tbodyProductos = document.getElementById("tbody");
const inputFoto = document.getElementById("dropzone-file");
const previewImage = document.getElementById("image-preview");
const btnCancelar = document.getElementById("cancelarBtn");

const fetchAndRenderProductos = async () => {
  try {
    const respuesta = await fetch(API_URL);
    const productos = await respuesta.json();
    renderTabla(productos);
  } catch (error) {
    console.error("Error al obtener los productos: ", error);
    tbodyProductos.innerHTML =
      '<tr><td colspan="8" class="text-center text-danger">Error al cargar los datos.</td></tr>';
  }
};

const cargarCategoria = async () => {
  try {
    const apiCategoria = await API_CATEGORIAS;
    const categorias = await resizeBy.json();
    const selecCategoria = document.getElementById("nombreCategoria");

    selecCategoria.innerHTML =
      '  <option value="">Seleccionar Categoria</option>';
    categorias.forEach((categoria) => {
      const opt = document.createElement("option");
      opt.value = categoria.id;
      opt.textContent = categoria.nombreCategoria;
      selecCategoria.appendChild(opt);
    });
  } catch (error) {
    console.error("Error al cargar las categorias: ", error);
  }
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
                  <td>${producto.estado}</td>
                  <td>${producto.categoria?.nombreCategoria}</td>
                  <td>${producto.url_imagen}</td>
                  <td>${producto.descripcion}</td>
                  <td class="flex justify-center gap-2">
                    <button class="btn btn-sm btn-warning  onclick="editProductos(${producto.id})">
                      <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-sm btn-danger  onclick="deleteProductos(${producto.id})">
                      <i class="bi bi-trash3"></i>
                    </button>
                  </td>
        `;
    tbodyProductos.appendChild(tr);
  });
};

/**
 * @param {Event} event
 */
const handleFormSubmit = async (event) => {
  event.preventDefault();
  const nuevoProducto = {
    nombreProducto: document.getElementById("nombreProducto").value,
    codigo: document.getElementById("codigo").value,
    stock: document.getElementById("stock").value,
    pre_venta: document.getElementById("pre_venta").value,
    estado: document.getElementById("estado").value === true,
    categoria: document.getElementById("nombreCategoria").value,
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
    const respuesta = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });
    if (respuesta.ok) {
      alert("Producto creado con exito");
      formProducto.reset();
      fetchAndRenderProductos();
    }
  } catch (error) {
    console.error("Error en handleFormSubmit: ", error);
  }
};

formProducto.addEventListener("submit", handleFormSubmit);
fetchAndRenderProductos();
