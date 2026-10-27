import {
  obtenerUsuarioPorId,
  actualizarUsuario,
} from "../service/usuarioService.js";
import { mostrarMensaje } from "../components/alerts.js";

const userFullname = document.getElementById("card-user-nombre");
const userEmail = document.getElementById("card-user-email");
const fieldNombre = document.getElementById("field-nombre");
const fieldApellido = document.getElementById("field-apellido");
const fieldDocumento = document.getElementById("field-documento");
const fieldTelefono = document.getElementById("field-telefono");
const fieldCorreo = document.getElementById("field-correo");
const fieldDireccion = document.getElementById("field-direccion");

const btnEditar = document.getElementById("btn-editar");
const inputsPerfil = [
  fieldNombre,
  fieldApellido,
  fieldDocumento,
  fieldTelefono,
  fieldCorreo,
  fieldDireccion,
];

let editando = false;

const token = localStorage.getItem("token");
async function cargarDatosUsuario() {
  try {
    const usuarioId = localStorage.getItem("usuarioId");

    if (!usuarioId) {
      console.warn(
        "No se encontró una sesión activa. Redirigiendo al login...",
      );
      // window.location.href = "login.html";
      return;
    }

    const usuario = await obtenerUsuarioPorId(usuarioId);

    if (usuario) {
      if (userFullname)
        userFullname.textContent =
          `${usuario.nombre || ""} ${usuario.apellido || ""}`.trim();
      if (userEmail)
        userEmail.textContent = usuario.correo || usuario.email || "";
      if (fieldNombre) fieldNombre.value = usuario.nombre || "";
      if (fieldApellido) fieldApellido.value = usuario.apellido || "-";
      if (fieldDocumento) fieldDocumento.value = usuario.documento || "-";
      if (fieldTelefono) fieldTelefono.value = usuario.telefono || "-";
      if (fieldCorreo)
        fieldCorreo.value = usuario.correo || usuario.email || "-";
      if (fieldDireccion) fieldDireccion.value = usuario.direccion || "-";
    }
  } catch (error) {
    console.error("Error al cargar los datos del usuario:", error);
  }
}

const guardarCambiosPerfil = async (datosActualizados) => {
  try {
    const usuarioId =
      localStorage.getItem("usuarioId") || sessionStorage.getItem("usuarioId");

    if (!usuarioId) return;
    await actualizarUsuario(usuarioId, datosActualizados);

    await cargarDatosUsuario();

    mostrarMensaje(
      "success",
      "circle-check",
      "Los datos han sido actualizados con éxito!",
    );
  } catch (error) {
    console.error("Error en handleFormSubmit: ", error);
    mostrarMensaje(
      "danger",
      "circle-x",
      error.message || "Error al actualizar los datos",
    );
  }
};

if (btnEditar) {
  btnEditar.addEventListener("click", async () => {
    editando = !editando;

    inputsPerfil.forEach((input) => {
      if (input && input.tagName === "INPUT") {
        input.disabled = !editando;
      }
    });

    if (editando) {
      btnEditar.textContent = "Guardar cambios";
      if (fieldNombre) fieldNombre.focus();
    } else {
      const datosActualizados = {
        nombre: fieldNombre?.value || "",
        apellido: fieldApellido?.value || "",
        documento: fieldDocumento?.value || "",
        telefono: fieldTelefono?.value || "",
        email: fieldCorreo?.value || "",
        direccion: fieldDireccion?.value || "",
      };
      await guardarCambiosPerfil(datosActualizados);
      btnEditar.textContent = "Editar perfil";
    }
  });
}

async function cargarCompras() {
  try {
    const usuarioId = localStorage.getItem("usuarioId");
    if (!usuarioId) return;

    const res = await fetch(
      `http://localhost:8080/api/ventas/usuario/${usuarioId}`,
      {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      },
    );

    if (res.ok) {
      const listaVentas = await res.json();
      listaVentas.sort((a, b) => {
        const fechaA = new Date(a.fechaVenta || 0);
        const fechaB = new Date(b.fechaVenta || 0);
        return fechaB - fechaA;
      });
      const ventasRecientes = listaVentas.slice(0, 4);
      renderizarTablaCompras(ventasRecientes, "tabla-compra");
      renderizarTablaCompras(listaVentas, "tabla-todas-compras");
    }
  } catch (error) {
    console.error("Error al obtener los pedidos pendientes:", error);
  }
}

function renderizarTablaCompras(ventas, tbodyId) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  const formatoMoneda = new Intl.NumberFormat("es-PY");

  tbody.innerHTML = "";

  if (!ventas || ventas.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="py-6 text-center">
          No tienes compras registradas todavía.
        </td>
      </tr>
    `;
    return;
  }

  ventas.forEach((v) => {
    const esCompletado = v.estado === "COMPLETADO";
    const badgeClase = esCompletado
      ? "bg-green-600/10 text-green-600 ring-green-500/20"
      : "bg-amber-600/10 text-amber-600 ring-amber-500/20";
    const fecha = v.fechaVenta
      ? new Date(v.fechaVenta).toLocaleString("es-PY")
      : new Date().toLocaleString("es-PY");

    const tr = document.createElement("tr");
    tr.className = "hover:bg-slate-50/80 transition text-slate-600";

    tr.innerHTML = `
      <td class="py-4 px-5 ">#${v.id}</td>
      <td class="py-4 px-5">${fecha}</td>
      <td class="py-3 px-3">${v.detalles ? v.detalles.length : 1} productos</td>
      <td class="py-4 px-5">Gs. ${formatoMoneda.format(v.precioTotal || v.total || 0)}</td>
      <td class="py-3 px-3">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${badgeClase} ring-1 ring-inset">
          ${v.estado || "PENDIENTE"}
        </span>
      </td>
      <td class="py-3 px-3 text-right">
        <button
          onclick="descargarComprobante('${v.id}')"
          class="text-indigo-600 hover:text-indigo-800 font-bold hover:underline"
          title="Ver comprobante de compra"
        >
          Ver Comprobante
        </button>
      </td>
      
    `;
    tbody.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  cargarDatosUsuario();
  cargarCompras();
});
