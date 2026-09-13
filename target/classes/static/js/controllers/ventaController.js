import { procesarVenta } from "../service/ventaService.js";
import { obtenerUsuarioPorId } from "../service/UsuarioService.js";
import {
  vaciarEstadoCarrito,
  inicializar as reconsultarCarrito,
} from "../utils/carrito.js";
import { mostrarMensaje } from "../components/alerts.js";

document.addEventListener("DOMContentLoaded", () => {
  const formCheckout = document.getElementById("formCheckout");

  if (formCheckout) {
    formCheckout.addEventListener("submit", gestionarFinalizarCompra);
  }

  verificarDatosUsuario();
});

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

    if (usuario && usuario.telefono && usuario.documento) {
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
      vaciarEstadoCarrito();
    }
    mostrarMensaje(
      "success",
      "circle-check",
      "¡Compra realizada exitosamente!",
    );
    setTimeout(() => {
      window.location.href = "/index.html";
    }, 2500);
  } catch (error) {
    console.error("Error al obtener el carrito: ", error);
    mostrarMensaje("danger", "circle-x", "No se pudo completar la compra");
  }
}
