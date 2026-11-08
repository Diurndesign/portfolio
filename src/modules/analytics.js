// ============================================================
//  Envoi d'un événement à Google Analytics et à Microsoft Clarity
// ============================================================
// Les deux outils n'existent qu'après « Accepter » dans le bandeau cookies,
// et seulement sur diurnstudio.fr (consent.js) : sinon rien n'est envoyé.
// Même nom d'événement des deux côtés, pour comparer les chiffres.

export function track(name, params = {}) {
  if (typeof window.gtag === "function") window.gtag("event", name, params);
  if (typeof window.clarity === "function") {
    window.clarity("event", name);
    // précise d'où vient la demande (simulateur, audit, devis, contact)
    if (params.form_name) window.clarity("set", "formulaire", params.form_name);
  }
}
