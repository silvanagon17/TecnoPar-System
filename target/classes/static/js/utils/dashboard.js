import { obtenerVentasPorEstado } from "../service/ventaService.js";
import { obtenerProductos } from "../service/productoService.js";

document.addEventListener("DOMContentLoaded", async () => {
  await cargarMetricasDashboard();
});

async function cargarMetricasDashboard() {
  const formatoMoneda = new Intl.NumberFormat("es-PY");

  try {
    const [pedidosPendientes, ventasCompletadas, productos] = await Promise.all(
      [
        obtenerVentasPorEstado("PENDIENTE").catch(() => []),
        obtenerVentasPorEstado("COMPLETADO").catch(() => []),
        obtenerProductos().catch(() => []),
      ],
    );

    const gananciaTotal = ventasCompletadas.reduce(
      (acc, v) => acc + (v.precioTotal || v.total || 0),
      0,
    );
    const cantidadPendientes = pedidosPendientes.length;

    const productosActivos = productos.filter(
      (p) => p.estado === true || p.estado === "true",
    ).length;
    const productoStockBajo = productos.filter((p) => p.stock <= 5);

    const ganancia = document.getElementById("panel-ganancia");
    if (ganancia)
      ganancia.textContent = `Gs. ${formatoMoneda.format(gananciaTotal)}`;

    const cantProducto = document.getElementById("panel-producto");
    if (cantProducto) cantProducto.textContent = productosActivos;

    const pendientes = document.getElementById("panel-pendientes");
    if (pendientes) pendientes.textContent = cantidadPendientes;

    const stockCritico = document.getElementById("panel-stock");
    if (stockCritico) stockCritico.textContent = productoStockBajo.length;

    renderizarUltimosPedidos(pedidosPendientes.slice(0, 5));
    renderizarTablaStock(productoStockBajo);
  } catch (error) {
    console.error("Error al cargar datos del dashboard:", error);
  }
}

function renderizarUltimosPedidos(ultimosPedidos) {
  const tbody = document.getElementById("tbody-ultimos-pedidos");
  if (!tbody) return;

  tbody.innerHTML = "";
  const formatoMoneda = new Intl.NumberFormat("es-PY");

  ultimosPedidos.forEach((v) => {
    const cliente = v.usuario
      ? `${v.usuario.nombre || ""} ${v.usuario.apellido || ""}`.trim()
      : "Cliente";
    const fecha = v.fechaVenta
      ? new Date(v.fechaVenta).toLocaleString("es-PY")
      : new Date().toLocaleString("es-PY");
    const tr = document.createElement("tr");
    tr.classList = "px-3 item-pedido";
    tr.innerHTML = `
      <td class="py-3 text-center">#${v.id}</td>
      <td class="py-3 text-center">${cliente}</td>
      <td class="py-3 text-center">${fecha}</td>
      <td class="py-3 text-center">Gs. ${formatoMoneda.format(v.precioTotal || v.total || 0)}</td>
      <td class="py-3 text-center"><span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-600/10 text-xs font-medium text-yellow-600 ring-1 ring-inset ring-amber-500/20">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          ${v.estado}
        </span></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderizarTablaStock(productosBajos) {
  const tbody = document.getElementById("tbody-stock");
  if (!tbody) return;

  tbody.innerHTML = "";
  productosBajos.forEach((p) => {
    const tr = document.createElement("tr");
    tr.classList = "px-3 item-pedido";
    tr.innerHTML = `
      <td class="py-3 text-center">${p.id}</td>
      <td class="py-3 text-center">${p.nombreProducto || p.nombre}</td>
      <td class="py-3 text-center text-red-500 font-bold">${p.stock} un.</td>
    `;
    tbody.appendChild(tr);
  });
}
