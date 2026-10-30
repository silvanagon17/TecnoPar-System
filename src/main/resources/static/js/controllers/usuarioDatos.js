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
    const badgeClase = esCompletado ? "text-green-600" : "text-amber-600";
    const fecha = v.fechaVenta
      ? new Date(v.fechaVenta).toLocaleString("es-PY")
      : new Date().toLocaleString("es-PY");

    const tr = document.createElement("tr");
    tr.className =
      "hover:bg-blue-500/10 transition text-slate-400 border-b item-table";

    tr.innerHTML = `
      <td class="text-center py-3">#${v.id}</td>
      <td class="text-center py-3">${fecha}</td>
      <td class="text-center py-3">${v.detalles ? v.detalles.length : 1} productos</td>
      <td class="text-center py-3">Gs. ${formatoMoneda.format(v.precioTotal || v.total || 0)}</td>
      <td class="text-center py-3">
        <span class="inline-flex items-center gap-1.5 text-xs font-semibold ${badgeClase}">
          ${v.estado || "PENDIENTE"}
        </span>
      </td>
      <td class="flex justify-center items-center py-3">
        <button
          onclick="descargarTicket('${v.id}')"
          class="font-bold hover:underline flex items-center bg-blue-500/50 border-1 border-blue-600/20 rounded-4 px-3 py-1"
          title="Ticket de compra"
        ><i data-lucide="file-text" class="h-4 w-4"></i>  
          Ticket
        </button>
      </td>
      
    `;
    tbody.appendChild(tr);
  });
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cargarDatosUsuario();
  cargarCompras();
});
