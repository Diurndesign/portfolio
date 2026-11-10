// ============================================================
//  Règles anti-robots, communes au navigateur et aux fonctions /api
// ============================================================
// Utilisées par le formulaire de contact, le simulateur et l'envoi du
// diagnostic par e-mail (src/modules/*.js), puis revérifiées côté serveur
// (api/demande.js, api/diagnostic.js) : un robot qui contourne la page
// tombe quand même sur le contrôle du serveur.

// Services d'adresses e-mail temporaires (« jetables ») : personne ne peut
// y répondre, ils servent surtout aux robots et aux inscriptions sauvages.
// Un sous-domaine est couvert aussi (x.yopmail.com).
const JETABLES = new Set([
  "yopmail.com", "yopmail.fr", "yopmail.net", "cool.fr.nf", "jetable.fr.nf", "courriel.fr.nf",
  "jetable.org", "jetable.com", "mailinator.com", "mailinator.net", "guerrillamail.com",
  "guerrillamail.info", "guerrillamail.net", "guerrillamail.org", "guerrillamailblock.com",
  "sharklasers.com", "grr.la", "spam4.me", "10minutemail.com", "10minutemail.net",
  "temp-mail.org", "temp-mail.io", "tempmail.com", "tempmail.net", "tempmailo.com",
  "tmpmail.org", "tmpmail.net", "tmail.ws", "trashmail.com", "trashmail.fr", "trashmail.de",
  "trashmail.net", "getnada.com", "nada.email", "dispostable.com", "maildrop.cc", "mailnesia.com",
  "mohmal.com", "fakeinbox.com", "throwawaymail.com", "emailondeck.com", "mintemail.com",
  "mailcatch.com", "spamgourmet.com", "moakt.com", "1secmail.com", "1secmail.org", "1secmail.net",
  "emailfake.com", "burnermail.io", "mail.tm", "mail.gw", "minuteinbox.com", "discard.email",
  "spambox.us", "probox.my.id", "cuvox.de", "armyspy.com", "dayrep.com", "einrot.com",
  "fleckens.hu", "gustr.com", "jourrapide.com", "rhyta.com", "superrito.com", "teleworm.us",
  "mytemp.email", "inboxkitten.com", "emailtemporanea.net", "tempinbox.com", "mailpoof.com",
]);

export function adresseJetable(email) {
  const domaine = String(email || "").toLowerCase().trim().split("@")[1] || "";
  const parties = domaine.split(".");
  for (let i = 0; i < parties.length - 1; i++) {
    if (JETABLES.has(parties.slice(i).join("."))) return true;
  }
  return false;
}

// Un humain met plus de 3 secondes entre l'arrivée sur le formulaire et
// l'envoi ; un robot, presque jamais. Durée absente (ancienne page en
// cache) : on ne bloque pas.
export const DUREE_MIN = 3000;
export const tropRapide = (ms) => typeof ms === "number" && ms >= 0 && ms < DUREE_MIN;

// Message qui contient un lien : enregistré quand même (un vrai client peut
// donner l'adresse de son site), mais marqué « À vérifier » dans Notion.
export const contientLien = (...textes) => textes.some((t) => /https?:\/\/|www\.[a-z0-9-]/i.test(String(t || "")));

export const MESSAGE_JETABLE =
  "Les adresses e-mail temporaires ne me permettent pas de vous répondre : merci d'indiquer votre adresse habituelle.";
