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
    const tr = document.createElement("tr");
    tr.classList = "px-3";
    tr.innerHTML = `
      <td class="">#${v.id}</td>
      <td class="">${cliente}</td>
      <td class="">Gs. ${formatoMoneda.format(v.precioTotal || v.total || 0)}</td>
      <td class=""><span>${v.estado}</span></td>
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
    tr.classList = "px-3";
    tr.innerHTML = `
      <td class="">${p.nombreProducto || p.nombre}</td>
      <td class=" text-red-500 font-bold">${p.stock} un.</td>
    `;
    tbody.appendChild(tr);
  });
}
