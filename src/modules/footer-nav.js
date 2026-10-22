// ============================================================
//  Footer : colonnes repliables
//  Titres toujours visibles ; les liens se révèlent au survol
//  (desktop, via CSS) ou au clic/tap (mobile, via ce module).
// ============================================================

function initFooterNav() {
  const titles = document.querySelectorAll(".site-footer__title");
  if (!titles.length) return;

  titles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const group = btn.closest(".site-footer__group");
      if (!group) return;
      const open = group.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFooterNav);
} else {
  initFooterNav();
}
