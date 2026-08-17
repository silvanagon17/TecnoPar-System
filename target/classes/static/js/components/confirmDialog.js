class ConfirmDialogElement extends HTMLElement {
  connectedCallback() {
    this.render();
    this.dialog = this.querySelector("#custom-confirm-dialog");

    // Eventos para cerrar o confirmar
    this.querySelector("#btn-confirm-action").addEventListener("click", () => {
      if (typeof this.onConfirmCallback === "function") {
        this.onConfirmCallback();
      }
      this.close();
    });

    this.querySelector("#btn-cancel-action").addEventListener("click", () => {
      this.close();
    });
  }

  show({ title, message, confirmText, onConfirm }) {
    if (title) this.querySelector("#dialog-title").textContent = title;
    if (message) this.querySelector("#dialog-message").textContent = message;
    if (confirmText)
      this.querySelector("#btn-confirm-action").textContent = confirmText;

    this.onConfirmCallback = onConfirm;

    if (this.dialog) {
      this.dialog.showModal();
    }
  }

  close() {
    if (this.dialog) {
      this.dialog.close();
    }
  }

  render() {
    this.innerHTML = `
      <el-dialog>
        <dialog id="custom-confirm-dialog" aria-labelledby="dialog-title" class="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent">
          <el-dialog-backdrop class="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></el-dialog-backdrop>

            <div tabindex="0" class="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0">
            <el-dialog-panel class="dialog shadow-lg relative transform overflow-hidden rounded-lg text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
             <div class="dialog-panel px-4 pt-4 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-yellow-500/10 sm:mx-0 sm:size-10">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" class="size-6 text-yellow-600">
                      <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                  <div class="text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 id="dialog-title" class="text-base font-semibold ">¿Descartar cambios?</h3>
                    <div class="mt-2">
                      <p id="dialog-message" class="text-sm">Has introducido información en el formulario. Si sales ahora, perderás todos los cambios no guardados.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="dialog-footer px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button type="button" id="btn-confirm-action" class=" inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-400 sm:ml-3 sm:w-auto">
                  Sí, descartar
                </button>
                <button type="button" id="btn-cancel-action" class="inline-flex w-full justify-center rounded-md bg-gray-500 px-3 py-2 text-sm font-semibold text-white inset-ring inset-ring-white/5 sm:mt-0 sm:w-auto">
                  Cancelar
                </button>
              </div>
            </el-dialog-panel>
          </div>
        </dialog>
      </el-dialog>
    `;
  }
}

customElements.define("app-confirm-dialog", ConfirmDialogElement);
