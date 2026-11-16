/**
 * Zero Plague — Navegación móvil accesible y utilidades globales (Fase 2)
 */
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const closeBtn = document.getElementById("mobile-menu-close");

  if (!toggleBtn || !mobileMenu) return;

  const setMenuState = (isOpen) => {
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.classList.toggle("hidden", !isOpen);
    document.body.classList.toggle("overflow-hidden", isOpen);

    if (isOpen) {
      const firstLink = mobileMenu.querySelector("a, button");
      if (firstLink) firstLink.focus();
    }
  };

  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isCurrentlyOpen = toggleBtn.getAttribute("aria-expanded") === "true";
    setMenuState(!isCurrentlyOpen);
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      setMenuState(false);
      toggleBtn.focus();
    });
  }

  // Cerrar al seleccionar cualquier enlace del menú móvil
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  // Cerrar al pulsar fuera del menú
  document.addEventListener("click", (e) => {
    const isOpen = toggleBtn.getAttribute("aria-expanded") === "true";
    if (isOpen && !mobileMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
      setMenuState(false);
    }
  });

  // Cerrar con tecla Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggleBtn.getAttribute("aria-expanded") === "true") {
      setMenuState(false);
      toggleBtn.focus();
    }
  });

  // Cerrar automáticamente si se redimensiona a escritorio (>= 1280px / xl)
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1280 && toggleBtn.getAttribute("aria-expanded") === "true") {
      setMenuState(false);
    }
  });
});
