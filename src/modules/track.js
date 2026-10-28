// ============================================================
//  Suivi des conversions — clics mail / téléphone / Calendly / CTA
// ============================================================
// Envoie des événements GA4 sur les actions de conversion secondaires
// (en complément de « generate_lead », envoyé par contact-form.js au succès
// réel de l'envoi d'un formulaire).
// RGPD : gtag n'existe qu'après consentement (voir consent.js), donc rien
// n'est envoyé tant que l'utilisateur n'a pas accepté les cookies.

// Boutons d'appel à l'action du site (+ data-cta pour en marquer d'autres).
const CTA_SELECTOR =
  ".hero__cta, .about__cta, .landing__cta, .landing__midcta, [data-cta]";

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
      track("click_call", { page_path: location.pathname });
      return;
    }

    // Clic sur un lien de réservation Calendly
    if (/calendly\.com/i.test(href)) {
      track("click_calendly", { page_path: location.pathname });
      return;
    }

    // Clic sur un lien d'appel à l'action. Seuls les liens comptent :
    // .landing__cta habille aussi des sections entières (ex. contact).
    const cta = link && link.closest(CTA_SELECTOR);
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
