class navHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <header class="sticky position-fixed w-100 top-0 z-50 pre-scrollable">
      <div
        class="nav-principal w-100 px-6 py-3 flex justify-between items-center gap-4"
      >
        <div class="d-flex items-center gap-2 cursor-pointer">
          <div>
            <img
              src="image/estatico/logoTecnoPar.png"
              class="logo mr-2"
              style="width: 26px"
              alt="Logo TecnoPar"
            />
          </div>
          <span class="titulo text-blue-500">TecnoPar</span>
        </div>

        <div class="flex-1 max-w-2xl relative group hidden md:block">
          <svg
            class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="¿Qué vas a buscar hoy?"
            class="principal w-full rounded-4 h-[38px] py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 transition-all"
          />
        </div>

        <div class="flex items-center justify-content-between gap-4">
          <a
            id="btn-link-admin"
            href="productos.html"
            class="hidden flex items-center gap-1 text-gray-700 hover:text-blue-600 font-semibold px-3 py-1 rounded-lg border border-gray-300 hover:border-blue-500 transition"
            title="Ir al Panel de Administración"
          >
            <i data-lucide="layers-plus" class="w-5 h-5 text-blue-600"></i>
            <span class="text-sm">Admin</span>
          </a>
          <div class="mini-switch-container">
            <input type="checkbox" id="checkbox" class="checkbox-input" />
            <label for="checkbox" class="mini-label principal">
              <span class="icon-small">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.25"
                  stroke="currentColor"
                  class="size-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                  />
                </svg>
              </span>
              <span class="icon-small"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.25"
                  stroke="currentColor"
                  class="size-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                  />
                </svg>
              </span>
              <div class="ball"></div>
            </label>
          </div>

          <div class="h-[35px] w-[35px] flex justify-center rounded-[11px]">
            <button
              id="btn-carrito"
              onclick="initCarritoDropdown()"
              class="relative"
            >
              <i
                data-lucide="shopping-cart"
                class="w-5 h-5"
                stroke-width="1.5"
                stroke="currentColor"
              ></i>
            </button>
            <div
              id="carrito-dropdown"
              class="notif-dropdown absolute right-[195px] mt-[48px] w-[350px] py-2 hidden z-50"
            >
              <div class="notif-b px-4 py-2 flex justify-between items-center">
                <span class="font-bold text-sm">Carrito</span>
              </div>
              <div id="carrito-list" class="max-h-64 overflow-y-auto"></div>
              <div id="carrito-footer">
                <div class="py-2 px-3 flex flex-col gap-2">
                  <div class="flex justify-between font-bold text-[14px]">
                    <span>Total:</span>
                    <span>Gs. 0</span>
                  </div>
                  <button
                    id="btn-procesar-compra"
                    class="w-full bg-blue-600 hover:bg-blue-700 text-[14px] text-white font-bold py-2 px-4 rounded-lg transition active:scale-95 cursor-pointer"
                  >
                    Finalizar Compra
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="user relative">
            <div id="usuario-anonimo">
              <a
                href="login.html"
                class="flex items-center gap-2 hover:text-blue-400 transition"
              >
                <div class="hidden lg:block text-left">
                  <span class="user-name text-[14px] font-bold leading-tight"
                    >Iniciar Sesión</span
                  >
                </div>
                <div
                  class="w-[35px] h-[35px] rounded-[11px] flex items-center justify-center transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="23"
                    height="23"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.25"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="12" cy="8" r="5" />
                    <path d="M20 21a8 8 0 0 0-16 0" />
                  </svg>
                </div>
              </a>
            </div>

            <div id="usuario-logueado" class="hidden relative">
              <button
                id="btn-user-menu"
                class="flex items-center gap-2 hover:text-blue-400 transition"
              >
                <div class="hidden lg:block text-left">
                  <p
                    class="text-[10px] text-slate-400 uppercase tracking-wider font-bold"
                  >
                    Hola,
                  </p>
                  <p
                    id="nav-username"
                    class="text-[14px] font-bold leading-tight text-blue-500"
                  >
                    Usuario
                  </p>
                </div>
                <div
                  class="w-[35px] h-[35px] rounded-5 principal flex items-center justify-center"
                >
                  <i
                    data-lucide="user"
                    class="h-[23px] w-[23px]"
                    stroke-width="1.5"
                  ></i>
                </div>
              </button>

              <div
                id="user-dropdown"
                class="notif-dropdown absolute right-0 mt-2 w-48 rounded-xl shadow-xl py-2 hidden z-50"
              >
                <button
                  id="btn-logout"
                  class="w-full text-left px-4 py-2 text-sm hover:bg-blue-600/20 flex items-center gap-2 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav class="nav-secundario py-1 overflow-x-auto no-scrollbar">
        <div
          class="mx-auto px-6 flex items-center gap-8 text-[13px] font-medium whitespace-nowrap"
        >
          <el-dropdown
            class="relative inline-flex flex-col items-start text-left"
          >
            <button
              popovertarget="sidebar"
              class="inline-flex w-auto items-center flex gap-2 font-bold text-xs uppercase tracking-widest whitespace-nowrap hover:text-blue-600 justify-center gap-x-1.5 rounded-md py-2 text-sm font-semibold inset-ring-1 inset-ring-white/5 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
              Todo
            </button>
          </el-dropdown>
          <div
            class="flex items-center gap-8 text-[11px] font-bold uppercase tracking-wider opacity-60"
          >
            <a href="#" class="hover:text-blue-600 transition-colors"
              >Notebook</a
            >
            <a href="#" class="hover:text-blue-600 transition-colors"
              >Hardware</a
            >
            <a href="#" class="hover:text-blue-600 transition-colors"
              >Consola</a
            >
            <a href="#" class="hover:text-blue-600 transition-colors"
              >Redes y Conectividad</a
            >
            <a
              href="#"
              class="text-pink-500 italic hover:text-amber-300 transition-colors"
              >Ofertas Flash
              <i class="bi bi-fire"></i>
            </a>
            <a href="#" class="hover:text-blue-600 transition-colors"
              >Periféricos</a
            >
            <a href="#" class="hover:text-blue-600 transition-colors"
              >Accesorios</a
            >
            <a
              href="productos.html"
              class="hover:text-blue-600 transition-colors"
              >Panel Admin</a
            >
          </div>
        </div>
      </nav>
    </header>
        `;
  }
}

customElements.define("nav-header", navHeader);
