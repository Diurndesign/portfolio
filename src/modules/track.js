// ============================================================
//  Suivi des conversions — clics mail / téléphone / CTA
// ============================================================
// Envoie des événements GA4 sur les actions de conversion secondaires
// (en complément de « generate_lead » déclenché à l'envoi du formulaire).
// RGPD : gtag n'existe qu'après consentement (voir consent.js), donc rien
// n'est envoyé tant que l'utilisateur n'a pas accepté les cookies.

// Boutons d'appel à l'action du site (+ data-cta pour en marquer d'autres).
const CTA_SELECTOR =
  ".hero__cta, .about__cta, .murmure__cta, .landing__cta, .landing__midcta, [data-cta]";

function track(name, params) {
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params || {});
  }
}

function initTracking() {
  // Délégation d'événement : un seul écouteur pour tout le document.
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[href]");
    const href = link ? link.getAttribute("href") || "" : "";

    // Clic sur une adresse e-mail (mailto:)
    if (/^mailto:/i.test(href)) {
      track("contact_email", { method: "email" });
      return;
    }

    // Clic sur un numéro de téléphone (tel:)
    if (/^tel:/i.test(href)) {
      track("clic_telephone", { page: location.pathname });
      track("contact_phone", { method: "phone" }); // événement historique conservé
      return;
    }

    // Clic sur un bouton d'appel à l'action
    const cta = e.target.closest(CTA_SELECTOR);
    if (cta) {
      track("cta_click", {
        cta_label: (cta.textContent || "").trim().slice(0, 80),
        page: location.pathname,
      });
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTracking);
} else {
  initTracking();
}
