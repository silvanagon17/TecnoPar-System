import { goToFormView, goToListarView } from "../utils/changeView.js";
import { mostrarMensaje } from "../components/alerts.js";

let pedidoSeleccionadoId = null;
let listaVentaCompleta = [];

document.addEventListener("DOMContentLoaded", async () => {
  cargarVentasCompletas();

  document
    .getElementById("searchInput")
    ?.addEventListener("input", aplicarFiltros);
  document
    .getElementById("fecha-inicio")
    ?.addEventListener("change", aplicarFiltros);
  document
    .getElementById("fecha-fin")
    ?.addEventListener("change", aplicarFiltros);
  document
    .getElementById("select-metodo-pago")
    ?.addEventListener("change", aplicarFiltros);

  document
    .getElementById("btn-limpiar-filtros")
    ?.addEventListener("click", () => {
      document.getElementById("searchInput").value = "";
      document.getElementById("fecha-inicio").value = "";
      document.getElementById("fecha-fin").value = "";
      document.getElementById("select-metodo-pago").value = "";
      renderizarTabla(listaVentaCompleta);
    });

  const btnVolver = document.getElementById("volver");
  if (btnVolver) {
    btnVolver.addEventListener("click", () => {
      goToListarView("view-listado", "view-formulario");
      pedidoSeleccionadoId = null;
    });
  }

  const btnCompletar = document.getElementById("btn-completar-venta");
  if (btnCompletar) {
    btnCompletar.addEventListener("click", () => {
      if (pedidoSeleccionadoId) {
        finalizarPedido(pedidoSeleccionadoId);
      }
    });
  }
});

function obtenerToken() {
  return localStorage
    .getItem("token")
    ?.replace(/^["'](.*)["']$/, "$1")
    .trim();
}

async function cargarVentasCompletas() {
  const token = obtenerToken();
  const tbody = document.getElementById("tbody");
  if (!tbody) return;

  try {
    const res = await fetch(
      "http://localhost:8080/api/ventas/estado?estado=COMPLETADO",
      {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      },
    );

    if (res.ok) {
      listaVentaCompleta = await res.json();
      renderizarTabla(listaVentaCompleta);
    }
  } catch (error) {
    console.error("Error al obtener los pedidos pendientes:", error);
  }
}

function aplicarFiltros() {
  const busqueda = document
    .getElementById("searchInput")
    .value.toLowerCase()
    .trim();
  const fechaInicioVal = document.getElementById("fecha-inicio").value;
  const fechaFinVal = document.getElementById("fecha-fin").value;
  const metodoPago = document.getElementById("select-metodo-pago").value;

  const resultado = listaVentaCompleta.filter((v) => {
    const cliente = v.usuario
      ? `${v.usuario.nombre} ${v.usuario.apellido}`.toLowerCase()
      : "";
    const direccion = (v.direccion || v.usuario?.direccion || "").toLowerCase();
    const id = v.id.toString();

    const coincideTexto =
      id.includes(busqueda) ||
      cliente.includes(busqueda) ||
      direccion.includes(busqueda);

    const coincideMetodo =
      !metodoPago ||
      (v.metodoPago && v.metodoPago.toUpperCase() === metodoPago.toUpperCase());

    let coincideFecha = true;
    if (v.fechaVenta || v.fecha) {
      const fechaVenta = new Date(v.fechaVenta || v.fecha);

      if (fechaInicioVal) {
        const fechaIni = new Date(fechaInicioVal);
        fechaIni.setHours(0, 0, 0, 0);
        coincideFecha = coincideFecha && fechaVenta >= fechaIni;
      }

      if (fechaFinVal) {
        const fechaFin = new Date(fechaFinVal);
        fechaFin.setHours(23, 59, 59, 999);
        coincideFecha = coincideFecha && fechaVenta <= fechaFin;
      }
    }
    return coincideTexto && coincideMetodo && coincideFecha;
  });
  renderizarTabla(resultado);
}

function renderizarTabla(ventas) {
  const tbody = document.getElementById("tbody");
  if (!tbody) return;
  const formatoMoneda = new Intl.NumberFormat("es-PY");

  tbody.innerHTML = "";

  if (!ventas || ventas.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="py-6 text-center">
          No hay pedidos pendientes por procesar.
        </td>
      </tr>
    `;
    return;
  }

  ventas.forEach((v) => {
    const cliente = v.usuario
      ? `${v.usuario.nombre || ""} ${v.usuario.apellido || ""}`.trim()
      : "Cliente";
    const fecha = v.fechaVenta
      ? new Date(v.fechaVenta).toLocaleString("es-PY")
      : new Date().toLocaleString("es-PY");

    const tr = document.createElement("tr");
    tr.id = `pedido-row-${v.id}`;
    tr.className = "text-center item-table";

    tr.innerHTML = `
      <td class="py-4 px-5 ">#${v.id}</td>
      <td class="py-4 px-5">${cliente}</td>
      <td class="py-4 px-5">${fecha}</td>
      <td class="py-4 px-5">Gs. ${formatoMoneda.format(v.precioTotal || v.total || 0)}</td>
      <td class="py-4 px-4 text-center">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-600/10 text-xs font-medium text-green-600 ring-1 ring-inset ring-green-500/20">
          <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          COMPLETADO
        </span>
      </td>
      <td class="py-4 px-5 text-center">
        <div class="flex items-center justify-center gap-2">
          <button 
            class="btn-ver-detalle px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition"
            data-id="${v.id}"
            title="Ver detalle de la Venta"
          >
            Ver Detalle
          </button>
          
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll(".btn-ver-detalle").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = Number(e.currentTarget.getAttribute("data-id"));
      mostrarDetallePedido(id);
    });
  });

  document.querySelectorAll(".btn-finalizar-directo").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = Number(e.currentTarget.getAttribute("data-id"));
      finalizarPedido(id);
    });
  });

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

function mostrarDetallePedido(ventaId) {
  const v = listaVentaCompleta.find((item) => item.id === ventaId);
  if (!v) return;

  pedidoSeleccionadoId = v.id;
  const formatoMoneda = new Intl.NumberFormat("es-PY");

  document.getElementById("detalle-id-venta").textContent = v.id;
  document.getElementById("detalle-fecha").textContent = v.fecha
    ? new Date(v.fecha).toLocaleString("es-PY")
    : new Date().toLocaleString("es-PY");

  const nombreCliente = v.usuario
    ? `${v.usuario.nombre || ""} ${v.usuario.apellido || ""}`.trim()
    : "Cliente Desconocido";
  document.getElementById("detalle-cliente-nombre").textContent = nombreCliente;
  document.getElementById("detalle-cliente-documento").textContent =
    v.usuario?.documento || v.datosPerfil?.documento || "Sin datos";
  document.getElementById("detalle-cliente-telefono").textContent =
    v.usuario?.telefono || v.datosPerfil?.telefono || "Sin datos";
  document.getElementById("detalle-cliente-direccion").textContent =
    v.usuario?.direccion || v.datosPerfil?.direccion || "Sin dirección";
  document.getElementById("detalle-cliente-observacion").textContent =
    v.observacion || "";
  document.getElementById("detalle-metodo-pago").textContent =
    v.metodoPago || "EFECTIVO";

  const tbodyItems = document.getElementById("tabla-items-detalle-body");
  tbodyItems.innerHTML = "";

  const detalles = v.detalles || v.items || [];
  detalles.forEach((d) => {
    const nombreProd =
      d.producto?.nombreProducto || d.producto?.nombre || "Producto";
    const precio = d.precioUnitario || d.precio || 0;
    const subtotal = d.subTotal || precio * d.cantidad;

    const tr = document.createElement("tr");
    tr.className = "border-b border-gray-100 hover:bg-gray-50/50";
    tr.innerHTML = `
      <td class="py-3 px-3 font-medium">${nombreProd}</td>
      <td class="py-3 px-3 text-center">Gs. ${formatoMoneda.format(precio)}</td>
      <td class="py-3 px-3 text-center font-bold">x${d.cantidad}</td>
      <td class="py-3 px-3 text-center">Gs. ${formatoMoneda.format(subtotal)}</td>
    `;
    tbodyItems.appendChild(tr);
  });

  document.getElementById("detalle-monto-total").textContent =
    `Gs. ${formatoMoneda.format(v.precioTotal || v.total || 0)}`;

  goToFormView("view-formulario", "view-listado");
}

async function finalizarPedido(id) {
  const token = obtenerToken();

  try {
    const res = await fetch(
      `http://localhost:8080/api/ventas/${id}/finalizar`,
      {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Error al finalizar pedido:", error);
  }
}
