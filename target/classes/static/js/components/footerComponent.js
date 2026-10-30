class footer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <footer class="pt-10 pb-10 px-6">
      <div
        class="footer max-w-7xl mx-auto pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600 text-[10px] font-bold uppercase tracking-widest"
      >
        <div class="flex flex-col">
          <p>© 2026 TecnoPar S.A.</p>
          <p>Versión 1.0</p>
        </div>
        
        <div class="flex gap-6">
          <a href="#">Privacidad</a>
          <a href="#">Términos</a>
        </div>
        <span>Desarrollado por Silvana Quintana</span>
      </div>
    </footer>
        `;
  }
}
customElements.define("footer-component", footer);
