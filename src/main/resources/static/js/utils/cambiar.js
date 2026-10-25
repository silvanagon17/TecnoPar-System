function verTodasLasCompras() {
  const encabezado = document.getElementById("encabezado");
  const vistaDatos = document.getElementById("vista-perfil");
  const listaCompras = document.getElementById("lista-compras");

  encabezado.classList.add("hidden");
  vistaDatos.classList.add("hidden");
  listaCompras.classList.remove("hidden");
}

function volver() {
  const encabezado = document.getElementById("encabezado");
  const vistaDatos = document.getElementById("vista-perfil");
  const listaCompras = document.getElementById("lista-compras");

  encabezado.classList.remove("hidden");
  vistaDatos.classList.remove("hidden");
  listaCompras.classList.add("hidden");
}
