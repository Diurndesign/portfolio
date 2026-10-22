// ============================================================
//  Consentement cookies (RGPD / CNIL)
//  Google Analytics n'est chargé QU'APRÈS un « Accepter » explicite.
//  Le choix est mémorisé (localStorage) et modifiable depuis le footer.
// ============================================================

const GA_ID = "G-FGQXLJR38H";
const STORAGE_KEY = "diurn-cookie-consent"; // "granted" | "denied"

function loadGoogleAnalytics() {
  if (window.__gaLoaded) return;
  window.__gaLoaded = true;

  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_ID, { anonymize_ip: true });
}

function readChoice() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    return null;
  }
}

function saveChoice(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch (e) {
    /* stockage indisponible : on ignore silencieusement */
  }
}

function initConsent() {
  const banner = document.getElementById("cookie-consent");
  if (!banner) return;

  const show = () => banner.classList.add("is-visible");
  const hide = () => banner.classList.remove("is-visible");

  function decide(value) {
    saveChoice(value);
    hide();
    if (value === "granted") loadGoogleAnalytics();
  }

  // État initial selon le choix déjà mémorisé
  const stored = readChoice();
  if (stored === "granted") {
    loadGoogleAnalytics(); // consentement déjà donné : on charge sans afficher le bandeau
  } else if (stored === "denied") {
    // refus déjà exprimé : rien à faire
  } else {
    show(); // premier passage : on demande
  }

  banner
    .querySelector("[data-consent-accept]")
    ?.addEventListener("click", () => decide("granted"));
  banner
    .querySelector("[data-consent-refuse]")
    ?.addEventListener("click", () => decide("denied"));

  // « Gérer les cookies » (footer) : rouvre le bandeau pour changer d'avis
  document.querySelectorAll("[data-consent-manage]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      show();
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initConsent);
} else {
  initConsent();
}
