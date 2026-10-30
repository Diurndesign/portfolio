// ============================================================
//  Réservation d'appel — fenêtre Calendly légère
// ============================================================
// Le bouton « Réserver un appel » reste un VRAI lien (href vers Calendly,
// target="_blank"), donc il fonctionne même sans JavaScript. Au clic, la
// page de réservation s'ouvre dans une fenêtre du site, en iframe directe :
// pas de script Calendly à télécharger (plus rapide que leur widget).
// Le calendrier est préparé dès le survol ou le premier toucher du bouton,
// pour qu'il soit déjà chargé au moment du clic. L'iframe est un peu plus
// large que la fenêtre : sa barre de défilement reste hors champ.
// L'événement GA4 « click_calendly » est envoyé par track.js.

let modal = null;
let frame = null;
let loadedUrl = "";
let lastFocus = null;

function embedUrl(url) {
  const u = new URL(url);
  u.searchParams.set("embed_domain", location.host);
  u.searchParams.set("embed_type", "PopupText");
  u.searchParams.set("hide_gdpr_banner", "1");
  return u.toString();
}

function build() {
  if (modal) return;
  modal = document.createElement("div");
  modal.className = "booking";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "Réserver un appel découverte de 30 minutes");
  modal.hidden = true;
  modal.innerHTML = `
    <div class="booking__backdrop" data-booking-close></div>
    <div class="booking__panel">
      <button class="booking__close" type="button" data-booking-close aria-label="Fermer la réservation">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>
      </button>
      <div class="booking__frame">
        <p class="booking__loader">Chargement du calendrier…</p>
        <iframe title="Calendrier de réservation de l'appel découverte" loading="eager"></iframe>
      </div>
    </div>`;
  document.body.appendChild(modal);
  frame = modal.querySelector("iframe");
  frame.addEventListener("load", () => {
    if (frame.src) modal.classList.add("is-loaded");
  });

  modal.addEventListener("click", (e) => {
    if (e.target.closest("[data-booking-close]")) close();
  });
  document.addEventListener("keydown", (e) => {
    if (modal.hidden) return;
    if (e.key === "Escape") close();
    // garde le focus dans la fenêtre (bouton fermer ↔ calendrier)
    if (e.key === "Tab" && !modal.contains(document.activeElement)) {
      e.preventDefault();
      modal.querySelector(".booking__close").focus();
    }
  });
}

// Prépare le calendrier (sans l'afficher) : il charge en arrière-plan
function preload(url) {
  build();
  if (loadedUrl === url) return;
  loadedUrl = url;
  modal.classList.remove("is-loaded");
  frame.src = embedUrl(url);
}

function open(url) {
  preload(url);
  lastFocus = document.activeElement;
  modal.hidden = false;
  document.documentElement.classList.add("booking-open");
  requestAnimationFrame(() => modal.classList.add("is-open"));
  modal.querySelector(".booking__close").focus();
}

function close() {
  modal.classList.remove("is-open");
  document.documentElement.classList.remove("booking-open");
  modal.hidden = true;
  if (lastFocus) lastFocus.focus();
}

function initCalendly() {
  // Préchargement à l'intention : survol, focus clavier ou toucher
  const warm = (e) => {
    const trigger = e.target.closest && e.target.closest("[data-calendly]");
    if (trigger) preload(trigger.getAttribute("href"));
  };
  document.addEventListener("pointerover", warm, { passive: true });
  document.addEventListener("focusin", warm);
  document.addEventListener("touchstart", warm, { passive: true });

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-calendly]");
    if (!trigger) return;
    // Respecte l'intention d'ouvrir dans un nouvel onglet (clic milieu,
    // Cmd/Ctrl/Maj) : on laisse le navigateur suivre le lien normalement.
    if (e.button === 1 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    open(trigger.getAttribute("href"));
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCalendly);
} else {
  initCalendly();
}
