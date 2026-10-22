// ============================================================
//  Modal projets — ouverture/fermeture accessible
// ============================================================

function initModal() {
  const modal = document.getElementById("modal");
  const body = document.getElementById("modal-body");
  if (!modal || !body) return;

  const dialog = modal.querySelector(".modal__dialog");
  const closeBtn = modal.querySelector(".modal__close");
  let lastFocused = null;

  const isOpen = () => modal.classList.contains("is-open");

  function open(id) {
    const tpl = document.getElementById("detail-" + id);
    if (!tpl) return;

    body.innerHTML = "";
    body.appendChild(tpl.content.cloneNode(true));
    body.scrollTop = 0;

    // Nomme la fenêtre avec le titre du projet (accessibilité) ; l'attribut
    // reste valide au chargement (aria-label statique dans le HTML).
    const titleEl = body.querySelector(".project__title");
    dialog.setAttribute(
      "aria-label",
      titleEl ? titleEl.textContent.trim() : "Détail du projet"
    );

    // couleur de fond propre au projet (data-bg), sinon défaut CSS
    const detail = body.querySelector(".project");
    const bg = detail && detail.getAttribute("data-bg");
    if (bg) modal.style.setProperty("--modal-bg", bg);
    else modal.style.removeProperty("--modal-bg");

    lastFocused = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");

    // focus sur le bouton de fermeture
    closeBtn.focus();
    document.addEventListener("keydown", onKeydown);
  }

  function close() {
    if (!isOpen()) return;

    // Nettoie le deep-link (#projet-…) pour ne pas rouvrir au rechargement.
    if (/^#projet-/i.test(location.hash)) {
      history.replaceState(null, "", location.pathname + location.search);
    }

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    document.removeEventListener("keydown", onKeydown);

    // on vide après la transition pour éviter un flash
    window.setTimeout(() => {
      if (!isOpen()) body.innerHTML = "";
    }, 300);

    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  function onKeydown(e) {
    if (e.key === "Escape") {
      close();
      return;
    }
    if (e.key === "Tab") trapFocus(e);
  }

  // piège à focus basique à l'intérieur du dialog
  function trapFocus(e) {
    const focusables = dialog.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  // Ouverture depuis les cartes : délégation d'événement au niveau du
  // document, afin que les cartes rendues dynamiquement (grille React
  // filtrable) déclenchent le modal au même titre que le HTML statique.
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-project]");
    if (trigger) open(trigger.getAttribute("data-project"));
  });

  // fermeture (croix + overlay)
  modal.querySelectorAll("[data-close]").forEach((el) => {
    el.addEventListener("click", close);
  });

  // Deep-link : ouverture directe d'un projet via l'URL (#projet-<id>),
  // utilisé par les cartes « réalisations » des pages landing.
  function openFromHash() {
    const m = location.hash.match(/^#projet-([a-z0-9-]+)$/i);
    if (m) open(m[1]);
  }
  openFromHash();
  window.addEventListener("hashchange", openFromHash);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initModal);
} else {
  initModal();
}
