import { obtenerProductos } from "../service/productoService.js";

let notificaciones =
  JSON.parse(localStorage.getItem("app_notificaciones")) || [];
/**
 * @param {Array} productos
 */
export const cargarNotificacionStock = async () => {
  try {
    const productos = await obtenerProductos();
    notificaciones = notificaciones.filter(
      (n) => typeof n.id !== "string" || !n.id.startsWith("stock-"),
    );

    productos.forEach((prod) => {
      const stock = Number(prod.stock) || 0;

      if (stock < 5) {
        notificaciones.push({
          id: `stock-critico-${prod.id}`,
          text: `Stock crítico: ${prod.nombreProducto} (${stock} ${stock === 1 ? "unidad" : "unidades"})`,
          type: "warning",
          time: "Revisar inventario",
        });
      } else if (stock >= 5 && stock <= 10) {
        notificaciones.push({
          id: `stock-bajo-${prod.id}`,
          text: `Stock bajo: ${prod.nombreProducto} (${stock} unidades)`,
          type: "info",
          time: "Reponer pronto",
        });
      }
    });
    renderNotify();
  } catch (error) {
    console.error("Error al cargar notificaciones de stock: ", error);
  }
};

export const agregaNotificacion = (
  text,
  type = "info",
  time = "Justo ahora",
) => {
  notificaciones.unshift({
    id: Date.now(),
    text,
    type,
    time,
  });
  renderNotify();
};

export const toggleNotify = () => {
  const dropdown = document.getElementById("notify-dropdown");
  if (dropdown) {
    dropdown.classList.toggle("hidden");
  }
};

export const renderNotify = () => {
  const list = document.getElementById("notif-list");
  const badge = document.getElementById("notif-badge");
  if (!list) return;

  list.innerHTML = "";

  if (notificaciones.length === 0) {
    if (badge) {
      badge.classList.add("hidden");
    }
    list.innerHTML = `<div class="p-6 text-center  text-xs">
                        No hay notificaciones pendientes.
                      </div>`;
    return;
  }

  if (badge) {
    badge.classList.remove("hidden");
  }

  notificaciones.forEach((n) => {
    let colorClass = "bg-yellow-500/20 text-yellow-600 ";
    let icon = "info";
    if (n.type === "warning") {
      colorClass = "bg-rose-500/20 text-rose-600";
      icon = "alert-triangle";
    } else if (n.type === "success") {
      colorClass = "bg-emerald-500/20 text-emerald-600";
      icon = "check";
    }

    const item = document.createElement("div");
    item.className =
      "flex items-start gap-3 p-3  transition cursor-pointer divide";
    item.innerHTML = `
                    <div class="p-2 rounded-lg ${colorClass} shrink-0">
                        <i data-lucide="${icon}" class="w-4 h-4"></i>
                    </div>
                    <div>
                        <p class="text-xs font-bold leading-normal">${n.text}</p>
                        <span class="text-xs font-medium block mt-1">${n.time}</span>
                    </div>
                `;
    list.appendChild(item);
  });
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
};

export const clearNotifications = () => {
  notificaciones = [];
  renderNotify();
};

export const initNotificationListeners = () => {
  const btnBell = document.getElementById("btn-notif-bell");
  const btnClear = document.getElementById("btn-clear-notif");

  if (btnBell) {
    btnBell.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleNotify();
    });
  }

  if (btnClear) {
    btnClear.addEventListener("click", clearNotifications);
  }

  document.addEventListener("click", (e) => {
    const dropdown = document.getElementById("notify-dropdown");
    const btnBell = document.getElementById("btn-notif-bell");
    if (
      dropdown &&
      !dropdown.classList.contains("hidden") &&
      !dropdown.contains(e.target) &&
      !btnBell?.contains(e.target)
    ) {
      dropdown.classList.add("hidden");
    }
  });

  renderNotify();
  cargarNotificacionStock();
};

if (typeof window !== "undefined") {
  window.initNotificationListeners = initNotificationListeners;
  window.agregaNotificacion = agregaNotificacion;
  window.cargarNotificacionStock = cargarNotificacionStock;
}
