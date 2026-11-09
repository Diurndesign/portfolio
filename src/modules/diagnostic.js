// ============================================================
//  Diagnostic express (page /diagnostic-site-gratuit)
// ============================================================
// 1. Le visiteur entre l'adresse de son site, rien d'autre : le résultat
//    s'affiche tout de suite (note, axes, 3 priorités).
// 2. La fin du résultat propose ce qui convient vraiment au site, selon
//    le cas renvoyé par /api/diagnostic : image de marque, journée Diurn
//    ou refonte. Le bouton mène toujours à un court appel, qui confirme.
// 3. Recevoir le résultat par e-mail est facultatif : c'est seulement là
//    que l'adresse est demandée (et la fiche créée dans Notion).
// Le résultat reste lisible par les lecteurs d'écran (zone aria-live,
// focus posé sur le titre du résultat).

import { track } from "./analytics.js";

const CALENDLY = "https://calendly.com/diurnstudio/appel-decouvert";

const ETAPES = [
  "Ouverture de votre page d'accueil…",
  "Mesure de la vitesse sur un téléphone…",
  "Vérification des bases du référencement…",
  "Contrôle de l'accessibilité et des bonnes pratiques…",
  "Recherche des points à corriger en priorité…",
  "Calcul de votre note…",
];

const ERREURS = {
  email: "Vérifiez votre adresse e-mail.",
  adresse: "Cette adresse ne semble pas être celle d'un site public. Vérifiez-la (exemple : www.monsite.fr).",
  plateforme: "C'est une page de réseau social ou d'annuaire : le diagnostic porte sur un site à votre nom. Pas encore de site ? Parlons-en.",
  injoignable: "Je n'arrive pas à ouvrir ce site. Vérifiez l'adresse, ou réessayez dans quelques minutes.",
  lent: "Le site n'a pas répondu en 12 secondes : c'est déjà un signal fort de lenteur. Réessayez dans un instant.",
  statut: "La page d'accueil renvoie une erreur : vos visiteurs ne voient probablement pas votre site en ce moment.",
  trop: "Vous avez lancé plusieurs diagnostics d'affilée. Réessayez dans 10 minutes.",
  reseau: "La connexion a été interrompue. Réessayez dans un instant.",
  enregistrement: "L'envoi n'a pas fonctionné. Réessayez, ou écrivez-moi à hello@diurnstudio.fr.",
};

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function source() {
  try {
    return sessionStorage.getItem("diurn-source") || "";
  } catch {
    return "";
  }
}

function appeler(corps) {
  return fetch("/api/diagnostic", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...corps, page: location.pathname, source: source() }),
    signal: AbortSignal.timeout(75_000),
  }).then((r) => r.json().catch(() => ({ ok: false, erreur: r.status === 429 ? "trop" : "injoignable" })));
}

function verdict(note) {
  if (note >= 90) return "Excellent : votre site est bien parti.";
  if (note >= 70) return "Bon, avec quelques marges de progrès.";
  if (note >= 50) return "À améliorer : des points vous font perdre des visiteurs.";
  return "Des freins importants : votre site vous coûte probablement des clients.";
}

// Anneau de note (SVG) : la longueur de l'arc suit la note
function anneau(note) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return `<svg class="diag-score__ring" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
    <circle cx="60" cy="60" r="${r}" class="diag-score__track"/>
    <circle cx="60" cy="60" r="${r}" class="diag-score__arc" stroke-dasharray="${((note / 100) * c).toFixed(1)} ${c.toFixed(1)}"/>
  </svg>`;
}

const bouton = (texte) =>
  `<a class="diag-cta__btn diag-cta__btn--solid" href="${CALENDLY}" target="_blank" rel="noopener" data-calendly data-cta>${texte}</a>`;

// Fin du résultat : ce qui convient à ce site-là
function offre(d) {
  if (d.cas === "image")
    return `<div class="diag-cta">
      <p class="diag-cta__kicker">Et maintenant&nbsp;?</p>
      <p class="diag-cta__text"><strong>Votre site tient la route.</strong> S'il ne vous ressemble plus, c'est peut-être l'image qu'il faut retravailler&nbsp;: c'est le cœur de mon métier.</p>
      <div class="diag-cta__actions">
        ${bouton("Parlons de votre image")}
        <a class="diag-cta__btn" href="/graphiste-nice" data-cta>Voir l'identité de marque</a>
      </div>
    </div>`;

  if (d.cas === "refonte")
    return `<div class="diag-cta">
      <p class="diag-cta__kicker">Refonte · de 1&nbsp;500 à 3&nbsp;500&nbsp;€</p>
      <p class="diag-cta__text"><strong>${esc(d.motif)}&nbsp;: une journée ne suffira pas.</strong> Corriger par petites touches coûterait plus cher qu'un site sur une base saine.</p>
      <ul class="diag-cta__list">
        <li>Un site sur mesure, rapide, à votre nom</li>
        <li>Votre nom de domaine et votre place sur Google conservés</li>
        <li>En ligne en 3 à 6&nbsp;semaines</li>
      </ul>
      <p class="diag-cta__small">Le prix exact dépend du nombre de pages&nbsp;: je vous le donne après un premier échange, sans engagement. Prix nets, TVA non applicable.</p>
      <div class="diag-cta__actions">
        ${bouton("Parlons de votre refonte")}
        <a class="diag-cta__btn" href="/refonte-site-internet-nice" data-cta>Voir la refonte</a>
      </div>
    </div>`;

  return `<div class="diag-cta">
      <p class="diag-cta__kicker">La journée Diurn · 350&nbsp;€</p>
      <p class="diag-cta__text"><strong>Ces priorités, je peux les corriger en une journée.</strong> Prix fixe, un seul interlocuteur, et un bilan avant/après chiffré le soir même.</p>
      <ul class="diag-cta__list">
        <li>Vitesse&nbsp;: images allégées, chargement accéléré sur mobile</li>
        <li>Google&nbsp;: titres et descriptions de vos pages principales, fiche Google complétée</li>
        <li>Téléphone&nbsp;: affichage corrigé, numéro et boutons cliquables</li>
      </ul>
      <p class="diag-cta__small">Lors d'un court appel, je vérifie que votre site tient bien en une journée. Sinon, je vous le dis, avant tout engagement. Prix net, TVA non applicable.</p>
      <div class="diag-cta__actions">
        ${bouton("Vérifier que ça tient en une journée")}
        <a class="diag-cta__btn" href="tel:+33650949615">Appeler&nbsp;: 06&nbsp;50&nbsp;94&nbsp;96&nbsp;15</a>
      </div>
    </div>`;
}

// Recevoir le résultat par e-mail : facultatif, après le résultat
const blocEmail = `<form class="diag-mail" novalidate>
    <p class="diag-mail__title">Recevoir ce résultat par e-mail</p>
    <div class="diag__row">
      <label class="sr-only" for="dg-email">Votre e-mail</label>
      <input type="email" id="dg-email" name="email" autocomplete="email" placeholder="votre@email.fr" required />
      <button type="submit" class="diag__submit diag__submit--ghost">Envoyer</button>
    </div>
    <label class="diag__check">
      <input type="checkbox" name="lettre" />
      <span>Recevoir aussi la lettre mensuelle (un conseil, un projet, désinscription en un clic).</span>
    </label>
    <p class="diag__privacy">Votre e-mail sert à vous envoyer ce résultat et, si vous cochez la case, la lettre. Il n'est jamais revendu et il est conservé 3&nbsp;ans au plus. <button class="diag__legal" type="button" data-project="legal">Données personnelles</button></p>
    <p class="diag__status" role="status" aria-live="polite"></p>
  </form>`;

function rendu(d) {
  const axes = d.axes
    .map(
      (x) => `<li class="diag-axe">
        <span class="diag-axe__label">${esc(x.label)}</span>
        <span class="diag-axe__note">${x.note}<span class="sr-only"> sur 100</span></span>
        <span class="diag-axe__bar" aria-hidden="true"><span style="width:${x.note}%" class="${x.note >= 90 ? "is-good" : x.note >= 50 ? "is-mid" : "is-low"}"></span></span>
      </li>`
    )
    .join("");
  const priorites = d.priorites.length
    ? `<ol class="diag-list diag-list--prio">${d.priorites.map((p) => `<li>${esc(p)}</li>`).join("")}</ol>`
    : `<p>Rien de bloquant relevé automatiquement. Bravo.</p>`;
  const forts = d.pointsForts.length
    ? `<h4 class="diag-result__sub">Ce qui va bien</h4><ul class="diag-list diag-list--ok">${d.pointsForts.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>`
    : "";
  const autres = d.autres.length
    ? `<details class="diag-more"><summary>Voir les ${d.autres.length} autres constats</summary><ul class="diag-list">${d.autres
        .map((p) => `<li>${esc(p)}</li>`)
        .join("")}</ul></details>`
    : "";
  const sansGoogle = d.mesureGoogle
    ? ""
    : `<p class="diag-note">La mesure de Google n'a pas répondu à temps : la note porte seulement sur les essentiels. Relancez le diagnostic dans quelques minutes pour un résultat complet.</p>`;

  return `<div class="diag-result__head">
      <div class="diag-score">${anneau(d.note)}<p class="diag-score__num"><strong>${d.note}</strong><span>/100</span></p></div>
      <div>
        <p class="diag-result__kicker">Résultat pour ${esc(d.host)}</p>
        <h3 class="diag-result__title" tabindex="-1">${esc(verdict(d.note))}</h3>
        ${sansGoogle}
      </div>
    </div>
    <ul class="diag-axes">${axes}</ul>
    <p class="diag-note">« Bases du référencement » vérifie que Google peut lire et comprendre votre page. Votre position dépend aussi de votre contenu, de votre fiche Google et des sites qui parlent de vous.</p>
    <h4 class="diag-result__sub">Vos 3 priorités</h4>
    ${priorites}
    ${forts}
    ${autres}
    ${offre(d)}
    ${blocEmail}
    <button type="button" class="diag-again">Tester un autre site</button>`;
}

function initDiagnostic() {
  const form = document.getElementById("diagnostic-form");
  if (!form) return;
  const progress = document.getElementById("diagnostic-progress");
  const result = document.getElementById("diagnostic-resultat");
  const status = form.querySelector(".diag__status");
  const submit = form.querySelector(".diag__submit");
  const step = progress.querySelector(".diag__progress-step");
  const title = document.getElementById("diag-titre");
  let timer;
  let dernier = null; // dernier résultat affiché (pour l'envoi par e-mail)

  const erreur = (el, code) => {
    el.textContent = ERREURS[code] || ERREURS.injoignable;
    el.classList.add("is-error");
  };

  const setBusy = (busy) => {
    submit.disabled = busy;
    form.hidden = busy;
    progress.hidden = !busy;
    clearInterval(timer);
    if (busy) {
      let i = 0;
      step.textContent = ETAPES[0];
      progress.classList.remove("is-running");
      void progress.offsetWidth; // relance l'animation de la barre
      progress.classList.add("is-running");
      timer = setInterval(() => {
        i = Math.min(i + 1, ETAPES.length - 1);
        step.textContent = ETAPES[i];
      }, 7000);
    }
  };

  // 1. Diagnostic : seulement l'adresse du site
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";
    status.classList.remove("is-error");
    const data = Object.fromEntries(new FormData(form));
    if (!String(data.site || "").trim()) return erreur(status, "adresse");

    setBusy(true);
    track("diagnostic_lance", { page_path: location.pathname });
    try {
      const d = await appeler({ site: data.site, botcheck: data.botcheck });
      setBusy(false);
      if (!d.ok) return erreur(status, d.erreur);

      dernier = d;
      form.hidden = true;
      if (title) title.textContent = "Votre diagnostic";
      result.innerHTML = rendu(d);
      result.hidden = false;
      result.querySelector(".diag-result__title").focus();
      track("diagnostic_termine", { note: d.note, cas: d.cas });
    } catch {
      setBusy(false);
      erreur(status, "reseau");
    }
  });

  // 3. Envoi du résultat par e-mail (facultatif)
  result.addEventListener("submit", async (e) => {
    const mail = e.target.closest(".diag-mail");
    if (!mail || !dernier) return;
    e.preventDefault();
    const st = mail.querySelector(".diag__status");
    const btn = mail.querySelector("button[type=submit]");
    st.textContent = "";
    st.classList.remove("is-error");
    const data = Object.fromEntries(new FormData(mail));
    const email = String(data.email || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return erreur(st, "email");

    btn.disabled = true;
    st.textContent = "Envoi…";
    try {
      const r = await appeler({ action: "email", site: dernier.site, email, lettre: Boolean(data.lettre) });
      btn.disabled = false;
      if (!r.ok) return erreur(st, r.erreur);
      st.textContent = r.envoye
        ? `C'est envoyé à ${email}. Pensez à regarder vos courriers indésirables.`
        : `Merci, c'est noté : je vous envoie le résultat moi-même sous 24 h.`;
      mail.querySelector(".diag__row").hidden = true;
      mail.querySelector(".diag__check").hidden = true;
      mail.querySelector(".diag__privacy").hidden = true;
      // le bouton qui avait le focus vient d'être masqué : le focus va au message
      st.tabIndex = -1;
      st.focus();
      track("generate_lead", { form_name: "diagnostic" });
    } catch {
      btn.disabled = false;
      erreur(st, "reseau");
    }
  });

  // « Tester un autre site » : retour au formulaire
  result.addEventListener("click", (e) => {
    if (!e.target.closest(".diag-again")) return;
    dernier = null;
    result.hidden = true;
    result.innerHTML = "";
    form.hidden = false;
    if (title) title.textContent = "Lancer le diagnostic";
    form.querySelector("#dg-site").value = "";
    form.querySelector("#dg-site").focus();
  });
}

initDiagnostic();
