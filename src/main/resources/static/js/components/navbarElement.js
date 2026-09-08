class Header extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="sticky position-fixed w-100 top-0 z-50 pre-scrollable">
      <div
        class="nav-principal-2 w-100 px-6 py-[12px] flex justify-between items-center gap-4"
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

        <div class="flex items-center justify-content-between gap-4">
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

          <div
            class="h-[32px] w-[35px] flex justify-center rounded-[11px]"
          >
            <button id="btn-notif-bell" class="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-bell-icon lucide-bell"
              >
                <path d="M10.268 21a2 2 0 0 0 3.464 0" />
                <path
                  d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"
                />
              </svg>
              <span
              id="notif-badge"
              class="absolute top-[-3px] right-[-7px] w-[12px] h-[12px] bg-blue-500 rounded-full text-[14px] text-white text-center"
            ></span>
            </button>
            <div
            id="notify-dropdown"
            class="notif-dropdown absolute right-[195px] mt-[48px] w-80 py-2 hidden z-50"
          >
            <div
              class="notif-b px-4 py-2 flex justify-between items-center"
            >
              <span class="font-bold text-sm">Notificaciones Recientes</span>
              <button
                class="text-xs text-blue-500 hover:underline"
              >
                Limpiar todo
              </button>
            </div>
            <div
              id="notif-list"
              class="max-h-64 overflow-y-auto"
            >
              <!-- Insertadas por JS -->
            </div>
          </div>
          </div>

          <div id="usuario-logueado" class="user hidden relative">
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
                  class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-blue-600/20 flex items-center gap-2 transition"
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
    </header>
        `;
  }
}

customElements.define("main-header", Header);
