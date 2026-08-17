function toggleSidebar() {
  const sidebarComponent = document.querySelector("app-sidebar");
  const aside = document.getElementById("sidebar");
  const toggleIcon = document.getElementById("toggle-icon");
  const sidebarTexts = document.querySelectorAll(".sidebar-text");

  if (!aside) return;

  const isCollapsed = aside.classList.contains("w-20");

  if (isCollapsed) {
    aside.classList.remove("w-20");
    aside.classList.add("w-64");
    toggleIcon.classList.remove("rotate-180");

    if (sidebarComponent) sidebarComponent.style.width = "16rem";

    sidebarTexts.forEach((el) => el.classList.remove("hidden"));
    cTitles.forEach((el) => el.classList.remove("hidden"));
  } else {
    aside.classList.remove("w-64");
    aside.classList.add("w-20");
    toggleIcon.classList.add("rotate-180");

    if (sidebarComponent) sidebarComponent.style.width = "4rem";

    sidebarTexts.forEach((el) => el.classList.add("hidden"));
    cTitles.forEach((el) => el.classList.add("hidden"));

    const dropdownContent = document.getElementById("dropdown-content");
    const dropdownArrow = document.getElementById("dropdown-arrow");
    dropdownContent.classList.remove("open");
    dropdownArrow.style.transform = "rotate(0deg)";
  }
}

function toggleDropdown() {
  const sidebar = document.getElementById("sidebar");
  const dropdownContent = document.getElementById("dropdown-content");
  const dropdownArrow = document.getElementById("dropdown-arrow");

  if (sidebar.classList.contains("collapsed")) {
    toggleSidebar();
    setTimeout(() => {
      dropdownContent.classList.add("open");
      dropdownArrow.style.transform = "rotate(180deg)";
    }, 150);
    return;
  }

  const isOpen = dropdownContent.classList.contains("open");
  if (isOpen) {
    dropdownContent.classList.remove("open");
    dropdownArrow.style.transform = "rotate(0deg)";
  } else {
    dropdownContent.classList.add("open");
    dropdownArrow.style.transform = "rotate(180deg)";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const url = window.location.pathname.split("/").pop();

  document.querySelectorAll(".nav-link, .dropdown-item").forEach((link) => {
    const href = link.getAttribute("href");

    if (href && href === url) {
      link.classList.add("active");

      const dropdown = link.closest(".dropdown");
      if (dropdown) {
        dropdown.querySelector(".nav-link").classList.add("active");
      }
    }
  });
});

document.querySelector(".sidebar-responsive")?.addEventListener(
  "wheel",
  (e) => {
    e.stopPropagation();
  },
  { passive: true },
);

function expandMenu(id, arrowId) {
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
