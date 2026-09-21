import { goToFormView, goToListarView } from "../utils/changeView.js";
import { mostrarMensaje } from "../components/alerts.js";

let pedidoSeleccionadoId = null;
let listaPedidosPendientes = [];

document.addEventListener("DOMContentLoaded", () => {
  cargarPedidosPendientes();

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

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const termino = e.target.value.toLowerCase();
      const filtrados = listaPedidosPendientes.filter(
        (p) =>
          p.id.toString().includes(termino) ||
          (p.usuario &&
            `${p.usuario.nombre} ${p.usuario.apellido}`
              .toLowerCase()
              .includes(termino)),
      );
      renderizarTabla(filtrados);
    });
  }
});

function obtenerToken() {
  return localStorage
    .getItem("token")
    ?.replace(/^["'](.*)["']$/, "$1")
    .trim();
}

async function cargarPedidosPendientes() {
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
      listaPedidosPendientes = await res.json();
      renderizarTabla(listaPedidosPendientes);
    }
  } catch (error) {
    console.error("Error al obtener los pedidos pendientes:", error);
  }
}

function renderizarTabla(pedidos) {
  const tbody = document.getElementById("tbody");
  const formatoMoneda = new Intl.NumberFormat("es-PY");

  tbody.innerHTML = "";

  if (!pedidos || pedidos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="py-6 text-center">
          No hay pedidos pendientes por procesar.
        </td>
      </tr>
    `;
    return;
  }

  pedidos.forEach((p) => {
    const cliente = p.usuario
      ? `${p.usuario.nombre || ""} ${p.usuario.apellido || ""}`.trim()
      : "Cliente";
    const fecha = p.fechaVenta
      ? new Date(p.fechaVenta).toLocaleString("es-PY")
      : new Date().toLocaleString("es-PY");

    const tr = document.createElement("tr");
    tr.id = `pedido-row-${p.id}`;
    tr.className = "text-center item-table";

    tr.innerHTML = `
      <td class="py-4 px-5 ">#${p.id}</td>
      <td class="py-4 px-5">${cliente}</td>
      <td class="py-4 px-5">${fecha}</td>
      <td class="py-4 px-5">Gs. ${formatoMoneda.format(p.precioTotal || p.total || 0)}</td>
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
            data-id="${p.id}"
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

function mostrarDetallePedido(pedidoId) {
  const p = listaPedidosPendientes.find((item) => item.id === pedidoId);
  if (!p) return;

  pedidoSeleccionadoId = p.id;
  const formatoMoneda = new Intl.NumberFormat("es-PY");

  document.getElementById("detalle-id-venta").textContent = p.id;
  document.getElementById("detalle-fecha").textContent = p.fecha
    ? new Date(p.fecha).toLocaleString("es-PY")
    : new Date().toLocaleString("es-PY");

  const nombreCliente = p.usuario
    ? `${p.usuario.nombre || ""} ${p.usuario.apellido || ""}`.trim()
    : "Cliente Desconocido";
  document.getElementById("detalle-cliente-nombre").textContent = nombreCliente;
  document.getElementById("detalle-cliente-documento").textContent =
    p.usuario?.documento || p.datosPerfil?.documento || "Sin datos";
  document.getElementById("detalle-cliente-telefono").textContent =
    p.usuario?.telefono || p.datosPerfil?.telefono || "Sin datos";
  document.getElementById("detalle-cliente-direccion").textContent =
    p.usuario?.direccion || p.datosPerfil?.direccion || "Sin dirección";
  document.getElementById("detalle-cliente-observacion").textContent =
    p.observacion || "";
  document.getElementById("detalle-metodo-pago").textContent =
    p.metodoPago || "EFECTIVO";

  const tbodyItems = document.getElementById("tabla-items-detalle-body");
  tbodyItems.innerHTML = "";

  const detalles = p.detalles || p.items || [];
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
    `Gs. ${formatoMoneda.format(p.precioTotal || p.total || 0)}`;

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
