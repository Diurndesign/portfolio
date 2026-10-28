// ============================================================
//  Réservation d'appel — popup Calendly (chargée à la demande)
// ============================================================
// Le bouton « Réserver un appel » reste un VRAI lien (href vers Calendly,
// target="_blank"), donc il fonctionne même sans JavaScript. Le script
// Calendly n'est chargé qu'au PREMIER clic, jamais au chargement des pages
// (préserve la performance). Si le script échoue, on ouvre l'URL dans un
// nouvel onglet. L'événement GA4 « click_calendly » est envoyé par track.js.

const CSS_URL = "https://assets.calendly.com/assets/external/widget.css";
const JS_URL = "https://assets.calendly.com/assets/external/widget.js";

let loadPromise = null;

// Charge le CSS puis le JS Calendly une seule fois par visite.
function loadCalendly() {
  if (window.Calendly) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    if (!document.querySelector(`link[href="${CSS_URL}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = CSS_URL;
      document.head.appendChild(link);
    }
    const script = document.createElement("script");
    script.src = JS_URL;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("Calendly: échec du chargement"));
    document.head.appendChild(script);
  });
  return loadPromise;
}

function initCalendly() {
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-calendly]");
    if (!trigger) return;

    const url = trigger.getAttribute("href");

    // Respecte l'intention d'ouvrir dans un nouvel onglet (clic milieu,
    // Cmd/Ctrl/Maj) : on laisse le navigateur suivre le lien normalement.
    if (e.button === 1 || e.metaKey || e.ctrlKey || e.shiftKey) return;

    e.preventDefault();
    loadCalendly()
      .then(() => {
        if (window.Calendly && typeof window.Calendly.initPopupWidget === "function") {
          window.Calendly.initPopupWidget({ url });
        } else {
          window.open(url, "_blank", "noopener");
        }
      })
      .catch(() => {
        // Script indisponible : repli sur l'ouverture de la page Calendly.
        window.open(url, "_blank", "noopener");
      });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCalendly);
} else {
  initCalendly();
}
