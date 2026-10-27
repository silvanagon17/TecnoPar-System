import { obtenerUsuarios } from "../service/usuarioService.js";
import { initNotificationListeners } from "../utils/dropdownNotif.js";

const tbodyUsuario = document.getElementById("tbody");

let listaUsuarios = [];

document.addEventListener("DOMContentLoaded", () => {
  initNotificationListeners();
});

const fetchRenderUsuarios = async () => {
  try {
    listaUsuarios = await obtenerUsuarios();
    renderTabla(listaUsuarios);
  } catch (error) {
    console.error("Error al obtener los usuarios: ", error);
    tbodyUsuario.innerHTML =
      '<tr><td colspan="8" class="text-center text-danger">Error al cargar los datos.</td></tr>';
  }
};

/**
 * @param {Array} usuarios
 */
const renderTabla = (usuarios) => {
  tbodyUsuario.innerHTML = "";
  if (usuarios.length === 0) {
    tbodyUsuario.innerHTML =
      '<tr><td colspan="10" class="text-center">No hay categorias registradas.</td></tr>';
    return;
  }
  usuarios.forEach((u) => {
    const nombre = u.nombre || (u.usuario && u.usuario.nombre) || "";
    const apellido = u.apellido || (u.usuario && u.usuario.apellido) || "";
    const cliente = `${nombre} ${apellido}`.trim() || "Sin nombre";
    const tr = document.createElement("tr");
    tr.className = "text-center item-table";
    tr.innerHTML = `
                    <td class="text-left px-5 ">${u.id}</td>
                      <td class="text-center">${cliente}</td>
                      <td class="text-center">${u.email}</td>
                      <td class="text-center">${u.documento}</td>
                      <td class="text-center">${u.direccion}</td>      
        `;
    tbodyUsuario.appendChild(tr);
  });
};

document.addEventListener("DOMContentLoaded", fetchRenderUsuarios);
