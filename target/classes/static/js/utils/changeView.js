export function goToFormView() {
  const viewListado = document.getElementById("view-listado");
  const viewFormulario = document.getElementById("view-formulario");

  viewListado.classList.add("hidden");
  viewFormulario.classList.remove("hidden");
}

export function goToListarView() {
  document.getElementById("view-formulario").classList.add("hidden");
  document.getElementById("view-listado").classList.remove("hidden");
}
