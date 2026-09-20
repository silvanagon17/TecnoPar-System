import { procesarVenta } from "../service/ventaService.js";
import { obtenerUsuarioPorId } from "../service/UsuarioService.js";
import {
  vaciarEstadoCarrito,
  inicializar as reconsultarCarrito,
} from "../utils/carrito.js";
import { mostrarMensaje } from "../components/alerts.js";

document.addEventListener("DOMContentLoaded", async () => {
  const formCheckout = document.getElementById("formCheckout");

  if (formCheckout) {
    formCheckout.addEventListener("submit", gestionarFinalizarCompra);
  }

  await cargarResumen();
  verificarDatosUsuario();

  const btnAceptarResumen = document.getElementById("btn-aceptar-resumen");
  const btnVolverResumen = document.getElementById("btn-volver-resumen");
  const btnVolverCheckout = document.getElementById("btn-volver-checkout");
  const btnVolverInicio = document.getElementById("btn-volver-inicio");

  const vistaResumen = document.getElementById("view-resumen");
  const vistaCheckout = document.getElementById("view-checkout");

  if (btnAceptarResumen) {
    btnAceptarResumen.addEventListener("click", () => {
      if (vistaResumen) vistaResumen.classList.add("hidden");
      if (vistaCheckout) vistaCheckout.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (btnVolverResumen) {
    btnVolverResumen.addEventListener("click", () => {
      if (vistaCheckout) vistaCheckout.classList.add("hidden");
      if (vistaResumen) vistaResumen.classList.remove("hidden");
    });
  }

  if (btnVolverCheckout) {
    btnVolverCheckout.addEventListener("click", () => {
      if (vistaCheckout) vistaCheckout.classList.add("hidden");
      if (vistaResumen) vistaResumen.classList.add("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (btnVolverInicio) {
    btnVolverInicio.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
});

async function cargarResumen() {
  const token = localStorage
    .getItem("token")
    ?.replace(/^["'](.*)["']$/, "$1")
    .trim();
  if (!token) return;

  try {
    const res = await fetch("http://localhost:8080/api/carrito/mi-carrito", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const carritoData = await res.json();
      renderizarVista(carritoData);
    }
  } catch (e) {
    console.error("Error al cargar el resumen:", e);
  }
}

function renderizarVista(carrito) {
  const tbody =
    document.getElementById("tabla-resumen-body") ||
    document.getElementById("ticket-productos-list");
  const totalCont =
    document.getElementById("monto-total") ||
    document.getElementById("ticket-monto-total");
  const btnAceptarResumen = document.getElementById("btn-aceptar-resumen");
  const formatoMoneda = new Intl.NumberFormat("es-PY");

  if (!tbody) return;
  tbody.innerHTML = "";

  const detalles = carrito?.detalles || [];

  if (detalles.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="py-6 text-center text-gray-500">
          Tu carrito está vacío.
        </td>
      </tr>
    `;
    if (totalCont) totalCont.innerText = "Gs. 0";
    if (btnAceptarResumen) btnAceptarResumen.disabled = true;
    return;
  }

  if (btnAceptarResumen) btnAceptarResumen.disabled = false;

  detalles.forEach((item) => {
    const precioBase = item.precioUnitario || item.producto.pre_venta || 0;
    const subtotal = precioBase * item.cantidad;

    const tr = document.createElement("tr");
    tr.className = "transition";
    tr.innerHTML = `
      <td class="py-3 px-2 text-left font-medium">
        <div class="flex items-center gap-3">
          <img src="${item.producto.url_imagen || ""}" class="w-10 h-10 object-cover rounded" alt="producto" />
          <span>${item.producto.nombreProducto || item.producto.nombre}</span>
        </div>
      </td>
      <td class="py-3 px-2 text-center">Gs. ${formatoMoneda.format(precioBase)}</td>
      <td class="py-3 px-2 text-center">${item.cantidad}</td>
      <td class="py-3 px-2 text-center">Gs. ${formatoMoneda.format(subtotal)}</td>
      <td class="py-3 px-2 text-center">
        <button
          class="btn text-gray-400 hover:text-red-500 transition btn-eliminar-item-resumen"
          data-detalle-id="${item.id}"
          title="Eliminar producto"
        >
          <i data-lucide="trash-2" class="w-5 h-5 inline"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  if (totalCont) {
    totalCont.innerText = `Gs. ${formatoMoneda.format(carrito.montoTotal || 0)}`;
  }

  document.querySelectorAll(".btn-eliminar-item-resumen").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const idDetalle = e.currentTarget.getAttribute("data-detalle-id");
      await eliminarItemResumen(idDetalle);
    });
  });

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

async function eliminarItemResumen(detalleId) {
  const token = localStorage
    .getItem("token")
    ?.replace(/^["'](.*)["']$/, "$1")
    .trim();
  if (!token) return;

  try {
    const res = await fetch(
      `http://localhost:8080/api/carrito/item/${detalleId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (res.ok) {
      const carritoActualizado = await res.json();
      renderizarVista(carritoActualizado);
      reconsultarCarrito();
    }
  } catch (error) {
    console.error("Error al eliminar item del resumen:", error);
  }
}

const obtenerIdDesdeToken = async () => {
  const token = localStorage
    .getItem("token")
    ?.replace(/^["'](.*)["']$/, "$1")
    .trim();
  if (!token) return null;

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    const payload = JSON.parse(jsonPayload);

    if (payload.id && !isNaN(payload.id)) return payload.id;
    if (payload.usuarioId && !isNaN(payload.usuarioId))
      return payload.usuarioId;

    const email = payload.sub;
    if (email) {
      const res = await fetch(`http://localhost:8080/api/usuarios`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        const usuarios = await res.json();
        const usuarioEncontrado = usuarios.find(
          (u) => u.email === email || u.nombre === email,
        );
        if (usuarioEncontrado) return usuarioEncontrado.id;
      }
    }

    return null;
  } catch (e) {
    console.error("Error al obtener ID del usuario:", e);
    return null;
  }
};

async function verificarDatosUsuario() {
  const usuarioId = await obtenerIdDesdeToken();
  if (!usuarioId) return;

  try {
    const usuario = await obtenerUsuarioPorId(usuarioId);

    if (usuario && (usuario.telefono || usuario.documento)) {
      const seccionDatos = document.getElementById("seccionDatosPersonales");
      if (seccionDatos) {
        seccionDatos.style.display = "none";
      }

      ["telefono", "direccion", "documento"].forEach((id) => {
        const input = document.getElementById(id);
        if (input) input.required = false;
      });
    }
  } catch (error) {
    console.warn("No se pudo verificar los datos previos del usuario:", error);
  }
}

async function gestionarFinalizarCompra(e) {
  e.preventDefault();

  try {
    const idDeToken = await obtenerIdDesdeToken();

    if (!idDeToken) {
      mostrarMensaje("Sesión no válida. Inicie sesión nuevamente.", "error");
      return;
    }

    const usuarioId = idDeToken;

    const token = localStorage
      .getItem("token")
      ?.replace(/^["'](.*)["']$/, "$1")
      .trim();
    const resCarrito = await fetch(
      "http://localhost:8080/api/carrito/mi-carrito",
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!resCarrito.ok) {
      alert("Error al consultar el Carrito");
      return;
    }

    const carritoData = await resCarrito.json();
    const detalles = carritoData.detalles || [];

    if (detalles.length === 0) {
      mostrarMensaje(
        "warning",
        "triangle-alert",
        "El carrito está vacío. Agrega productos antes de finalizar la compra.",
        "info",
      );
      return;
    }

    const itemsDto = detalles.map((d) => ({
      productoId: d.producto.id,
      cantidad: d.cantidad,
    }));

    const datosProcesarVenta = {
      datosPerfil: {
        telefono: document.getElementById("telefono")?.value || null,
        direccion: document.getElementById("direccion")?.value || null,
        documento: document.getElementById("documento")?.value || null,
      },
      metodoPago: document.getElementById("metodoPago")?.value || "EFECTIVO",
      items: itemsDto,
    };

    const ventaCreada = await procesarVenta(usuarioId, datosProcesarVenta);
    localStorage.removeItem("carrito");
    localStorage.removeItem("carritoItems");
    vaciarEstadoCarrito();
    window.dispatchEvent(new Event("carritoActualizado"));
    if (typeof vaciarEstadoCarrito === "function") {
    }
    mostrarMensaje(
      "success",
      "circle-check",
      "¡Compra realizada exitosamente!",
    );
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2500);
  } catch (error) {
    console.error("Error al obtener el carrito: ", error);
    mostrarMensaje("danger", "circle-x", "No se pudo completar la compra");
  }
}
