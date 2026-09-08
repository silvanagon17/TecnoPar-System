document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const nombreCompleto = localStorage.getItem("nombreCompleto");
  const divAnonimo = document.getElementById("usuario-anonimo");
  const divLogueado = document.getElementById("usuario-logueado");
  const navUsername = document.getElementById("nav-username");

  if (token && divLogueado) {
    if (divAnonimo) divAnonimo.classList.add("hidden");
    if (divLogueado) divLogueado.classList.remove("hidden");

    if (navUsername) navUsername.textContent = nombreCompleto;

    const btnUserMenu = document.getElementById("btn-user-menu");
    const userDropdown = document.getElementById("user-dropdown");
    const btnLogout = document.getElementById("btn-logout");
    const btnLogoutSb = document.getElementById("btn-logout-sb");
    const confirmModal = document.getElementById("confirm-modal");

    if (btnUserMenu && userDropdown) {
      btnUserMenu.addEventListener("click", (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle("hidden");
      });

      document.addEventListener("click", () => {
        userDropdown.classList.add("hidden");
      });
    }

    if (btnLogout) {
      btnLogout.addEventListener("click", () => {
        confirmModal.show({
          title: "¿Quieres cerrar sesión?",
          message: `¿Estás seguro de que quieres cerrar sesión?`,
          confirmText: "Sí, cerrar sesión",
          onConfirm: async () => {
            localStorage.clear();
            window.location.href = "/index.html";
          },
        });
      });
    }

    if (btnLogoutSb) {
      btnLogoutSb.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "/index.html";
      });
    }
  }
});
