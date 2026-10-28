// ============================================================
//  Consentement cookies (RGPD / CNIL)
//  Google Analytics et Microsoft Clarity ne sont chargés QU'APRÈS un
//  « Accepter » explicite. Le choix est mémorisé 6 mois (localStorage),
//  puis le bandeau réapparaît. Il reste modifiable depuis le footer.
// ============================================================

const CLARITY_ID = 'A_REMPLACER';
const GA_ID = "G-FGQXLJR38H";
const STORAGE_KEY = "diurn-cookie-consent"; // "granted" | "denied"
const STORAGE_DATE_KEY = "diurn-cookie-consent-date"; // horodatage du choix (ms)
// Durée de validité du choix : 6 mois. Garder la même valeur que le script
// d'affichage immédiat du bandeau (vite.config.js, optimizeHtml).
const CONSENT_MAX_AGE = 182 * 24 * 60 * 60 * 1000;

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

// Clarity : chargé seulement après acceptation, puis signal de consentement
// (obligatoire pour les visiteurs européens). Tant que l'ID n'est pas
// renseigné, rien n'est chargé.
function loadClarity() {
  if (!CLARITY_ID || CLARITY_ID === "A_REMPLACER") return;

  if (!window.__clarityLoaded) {
    window.__clarityLoaded = true;
    // File d'attente : les appels à window.clarity() faits avant le chargement
    // du script sont rejoués par Clarity une fois chargé.
    window.clarity =
      window.clarity ||
      function () {
        (window.clarity.q = window.clarity.q || []).push(arguments);
      };
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.clarity.ms/tag/" + CLARITY_ID;
    document.head.appendChild(s);
  }

  window.clarity("consentv2", {
    ad_Storage: "denied",
    analytics_Storage: "granted",
  });
}

// Retrait du consentement (« Gérer les cookies » puis « Refuser ») :
// Clarity efface ses cookies, GA cesse d'envoyer des données sur cette page.
// Aux visites suivantes, le refus mémorisé empêche tout rechargement.
function revokeConsent() {
  if (window.__clarityLoaded && typeof window.clarity === "function") {
    window.clarity("consent", false);
  }
  if (window.__gaLoaded) {
    window["ga-disable-" + GA_ID] = true;
  }
}

// Renvoie "granted" | "denied", ou null si aucun choix valide (absent,
// sans date ou plus vieux que 6 mois : le bandeau doit alors réapparaître).
function readChoice() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    const date = Number(localStorage.getItem(STORAGE_DATE_KEY));
    if (value !== "granted" && value !== "denied") return null;
    if (!date || Date.now() - date > CONSENT_MAX_AGE) return null;
    return value;
  } catch (e) {
    return null;
  }
}

function saveChoice(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
    localStorage.setItem(STORAGE_DATE_KEY, String(Date.now()));
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
    if (value === "granted") {
      loadGoogleAnalytics();
      loadClarity();
    } else {
      revokeConsent();
    }
  }

  // État initial selon le choix déjà mémorisé (et encore valide)
  const stored = readChoice();
  if (stored === "granted") {
    // consentement déjà donné : on charge sans afficher le bandeau
    loadGoogleAnalytics();
    loadClarity();
  } else if (stored === "denied") {
    // refus déjà exprimé : rien à faire
  } else {
    show(); // premier passage, ou choix expiré : on demande
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
