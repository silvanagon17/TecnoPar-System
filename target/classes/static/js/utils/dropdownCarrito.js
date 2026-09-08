const initCarritoDropdown = () => {
  const btnCarrito = document.getElementById("btn-carrito");
  const dropdown = document.getElementById("carrito-dropdown");

  if (btnCarrito && dropdown) {
    btnCarrito.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
      if (
        !dropdown.classList.contains("hidden") &&
        !dropdown.contains(e.target) &&
        !btnCarrito.contains(e.target)
      ) {
        dropdown.classList.add("hidden");
      }
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initCarritoDropdown();
});
