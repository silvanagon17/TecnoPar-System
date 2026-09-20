class SidebarElement extends HTMLElement {
  connectedCallback() {
    this.style.display = "block";
    this.style.position = "sticky";
    this.style.top = "0";
    this.style.height = "100vh";
    this.style.zIndex = "40";
    this.classList.add("flex-shrink-0");

    this.render();
    this.setActiveLink();

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  setActiveLink() {
    const currentPath =
      window.location.pathname.split("/").pop() || "index.html";
    const links = this.querySelectorAll("a");
    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (href && href === currentPath) {
        link.classList.add("bg-blue-400/20", "border-1", "border-blue-400/20");
      }
    });
  }

  render() {
    this.innerHTML = `
      <aside
        id="sidebar"
        class="sidebar-transition h-full w-64 flex flex-col pt-[60px] justify-between"
      >
        <div
          class="py-6 px-3 md:px-4 space-y-6 sidebar-responsive flex-1 overflow-y-auto"
          style="
            max-height: auto;
            overflow-y: auto;
            scrollbar-color: #818181 #02001800;
            scrollbar-width: none;
          "
        >
          <button
            id="toggle-btn"
            onclick="toggleSidebar()"
            class="d-flex w-full align-items-center justify-content-between px-3 transition"
          >
            <span
              class="text-[12px] sidebar-text font-bold uppercase tracking-widest block"
              >Menú Principal</span
            >
            <i data-lucide="chevron-left" id="toggle-icon" class="h-5 w-5"></i>
          </button>
          <nav class="space-y-1">
            <a
              href="index.html"
              class="w-full menu-item flex items-center space-x-2 px-3 py-[13px] rounded-xl font-medium transition"
            >
              <i data-lucide="house" class="w-5 h-5 shrink-0"></i>
              <span class="sidebar-text hidden md:inline text-sm">Hogar</span>
            </a>

            <span
              class="c-title text-[10px] sidebar-text font-bold uppercase tracking-widest px-3 block mb-3"
              >General</span
            >
            
            <a
              href="dashboard.html"
              class="w-full menu-item flex items-center space-x-2 px-3 py-[13px] rounded-xl font-medium transition"
            >
              <i data-lucide="layout-grid" class="w-5 h-5 shrink-0"></i>
              <span class="sidebar-text hidden md:inline text-sm">Panel Inicial</span>
            </a>

            <a
              href="#"
              class="w-full menu-item flex items-center space-x-2 px-3 py-[13px] rounded-xl font-medium transition"
            >
              <i data-lucide="file-chart-line" class="w-5 h-5 shrink-0"></i>
              <span class="sidebar-text hidden md:inline text-sm">Reportes</span>
            </a>

            <span
              class="c-title text-[10px] sidebar-text font-bold uppercase tracking-widest px-3 block pt-3 mb-3"
              >Registros</span
            >

            <a
              href="productos.html"
              class="w-full menu-item flex items-center space-x-2 px-3 py-[13px] rounded-xl font-medium transition"
            >
              <i data-lucide="layers" class="w-5 h-5 shrink-0"></i>
              <span class="sidebar-text hidden md:inline text-sm">Productos</span>
            </a>

            <a
              href="categoria.html"
              class="w-full menu-item flex items-center space-x-2 px-3 py-[13px] rounded-xl font-medium transition"
            >
              <i data-lucide="tags" class="w-5 h-5 shrink-0"></i>
              <span class="sidebar-text hidden md:inline text-sm">Categorias</span>
            </a>

            <span
              class="c-title text-[10px] sidebar-text font-bold uppercase tracking-widest px-3 block pt-3 mb-3"
              >Operaciones</span
            >

            <a
              href="pedido.html"
              class="w-full menu-item flex items-center space-x-2 px-3 py-[13px] rounded-xl font-medium transition"
            >
              <i data-lucide="package" class="w-5 h-5 shrink-0"></i>
              <span class="sidebar-text hidden md:inline text-sm">Pedidos</span>
            </a>

            <a
              href="venta.html"
              class="w-full menu-item flex items-center space-x-2 px-3 py-[13px] rounded-xl font-medium transition"
            >
              <i
                data-lucide="chart-no-axes-combined"
                class="w-5 h-5 shrink-0"
              ></i>
              <span class="sidebar-text hidden md:inline text-sm">Ventas</span>
            </a>

            <a
             
              class="w-full menu-item flex items-center space-x-2 px-3 py-[13px] rounded-xl font-medium transition"
            >
              <i data-lucide="newspaper" class="w-5 h-5 shrink-0"></i>
              <span class="sidebar-text hidden md:inline text-sm">Facturas</span>
            </a>

            <span
              class="c-title text-[10px] sidebar-text font-bold uppercase tracking-widest px-3 block pt-4 mb-3"
              >Usuario y Soporte</span
            >

            <a
                href="usuario.html"
              class="w-full menu-item flex items-center space-x-2 px-3 py-[13px] rounded-xl font-medium transition"
            >
              <i data-lucide="user" class="w-5 h-5 shrink-0"></i>
              <span class="sidebar-text hidden md:inline text-sm">Usuarios</span>
            </a>

            <a
              href="#"
              class="w-full menu-item flex items-center space-x-2 px-3 py-[13px] rounded-xl font-medium transition"
            >
              <i data-lucide="settings" class="w-5 h-5 shrink-0"></i>
              <span class="sidebar-text hidden md:inline text-sm">Ajustes</span>
            </a>
          </nav>
        </div>

        <div class="footer-sidebar p-3 md:p-4">
          <button
                id="btn-logout-sb"
                class="text-[14px] font-bold leading-none bg-red-500/10 hover:bg-red-500/30 text-red-500 rounded-xl w-full flex items-center justify-center text-[10px] space-x-2 px-2 py-[17px]"
              >
                <i data-lucide="log-out" class="w-5 h-5 shrink-0"></i>
                <span class="sidebar-text"> Cerrar Sesión</span>
              </button>
        </div>
      </aside>
    `;
  }
}

customElements.define("app-sidebar", SidebarElement);
