document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");
  const comboCategoriaInput = document.querySelector(
    "#combobox-categoria-table .combo-value",
  );

  searchInput.addEventListener("input", filtrarProductos);
  statusFilter.addEventListener("change", filtrarProductos);

  if (comboCategoriaInput) {
    comboCategoriaInput.addEventListener("change", filtrarProductos);
  }
});

function filtrarProductos() {
  const textBusqueda = document
    .getElementById("searchInput")
    .value.toLowerCase()
    .trim();
  const estadoSeleccionado = document.getElementById("statusFilter").value;
  const idCategoriaSeleccionada =
    document.querySelector("#combobox-categoria-table .combo-value")?.value ||
    "";
  const textoCategoria =
    document
      .querySelector("#combobox-categoria-table .combo-input")
      ?.value.toLowerCase()
      .trim() || "";
  const filas = document.querySelectorAll("#tbody tr");

  filas.forEach((fila) => {
    if (fila.classList.contains("no-results-row")) return;

    const producto = fila.children[1]?.textContent.toLowerCase() || "";
    const codigo = fila.children[2]?.textContent.toLowerCase() || "";
    const categoria = fila.children[3]?.textContent.toLowerCase() || "";
    const estado =
      fila.children[6]?.textContent.toLowerCase().trim() ||
      fila.children[3]?.textContent.toLowerCase().trim() ||
      "";
    const coincideTexto =
      textBusqueda === "" ||
      producto.includes(textBusqueda) ||
      codigo.includes(textBusqueda);

    let coincideEstado = false;
    if (estadoSeleccionado === "todos") coincideEstado = true;
    if (estadoSeleccionado === "activo" && estado === "activo")
      coincideEstado = true;
    if (estadoSeleccionado === "inactivo" && estado === "inactivo")
      coincideEstado = true;

    const coincideCategoria =
      idCategoriaSeleccionada === "" || textoCategoria === ""
        ? true
        : categoria.includes(textoCategoria);

    if (coincideTexto && coincideEstado && coincideCategoria) {
      fila.style.display = "";
    } else {
      fila.style.display = "none";
    }
  });

  mensajeVacio();
}

function mensajeVacio() {
  const tbody = document.getElementById("tbody");
  const filasVisibles = Array.from(
    tbody.querySelectorAll("tr:not(.no-results-row)"),
  ).filter((f) => f.style.display !== "none");
  const mensajeExistente = tbody.querySelector(".no-results-row");
  if (mensajeExistente) mensajeExistente.remove();

  if (filasVisibles.length === 0) {
    const tr = document.createElement("tr");
    tr.className = "no-results-row border-table text-center text-slate-400";
    tr.innerHTML = `<td colspan="8" class="py-8">No se encontraron resultados.</td>`;
    tbody.appendChild(tr);
  }
}
