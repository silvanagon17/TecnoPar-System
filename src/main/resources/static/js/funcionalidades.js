// *****Para Boton Categoria*****

function toggleDropdown(id, arrowId) {
  const menu = document.getElementById(id);
  const arrow = document.getElementById(arrowId);

  menu.classList.toggle("hidden");
  menu.classList.toggle("flex");

  arrow.classList.toggle("rotate-180");
}

document.getElementById("menu-sidebar").addEventListener("mouseleave", () => {
  const dropdown = document.getElementById("dropdown-cats");
  const arrow = document.getElementById("arrow-icon");
  dropdown.classList.add("hidden");
  dropdown.classList.remove("flex");
  arrow.classList.remove("rotate-180");
});
