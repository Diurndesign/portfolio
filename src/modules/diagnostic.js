// ============================================================
//  Diagnostic express (page /diagnostic-site-gratuit)
// ============================================================
// Envoie l'adresse du site à /api/diagnostic, affiche une progression le
// temps de la mesure Google (20 à 50 s), puis la note, les axes, les
// 3 priorités et l'appel à l'action. Le résultat reste lisible par les
// lecteurs d'écran (zone aria-live, focus posé sur le titre du résultat).

import { track } from "./analytics.js";

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
  lent: "Le site n'a pas répondu en 12 secondes : c'est déjà un signal fort de lenteur. Réessayez, ou demandez l'audit détaillé.",
  statut: "La page d'accueil renvoie une erreur : vos visiteurs ne voient probablement pas votre site en ce moment.",
  trop: "Vous avez lancé plusieurs diagnostics d'affilée. Réessayez dans 10 minutes.",
  reseau: "La connexion a été interrompue. Réessayez dans un instant.",
};

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

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

// Fin du résultat : ce qu'on fait ensuite. Un site qui a des freins se
// voit proposer la journée Diurn (je corrige, en une journée, prix fixe) ;
// un site déjà en bonne santé, un échange sur l'image de marque.
function offre(note) {
  const appel = `<a class="diag-cta__btn diag-cta__btn--solid" href="https://calendly.com/diurnstudio/appel-decouvert" target="_blank" rel="noopener" data-calendly data-cta>Réserver ma journée</a>`;
  if (note >= 90)
    return `<div class="diag-cta">
      <p class="diag-cta__kicker">Et maintenant&nbsp;?</p>
      <p class="diag-cta__text"><strong>Votre site tient la route.</strong> S'il ne vous ressemble plus, c'est peut-être l'image qu'il faut retravailler&nbsp;: c'est le cœur de mon métier.</p>
      <div class="diag-cta__actions">
        <a class="diag-cta__btn diag-cta__btn--solid" href="https://calendly.com/diurnstudio/appel-decouvert" target="_blank" rel="noopener" data-calendly data-cta>Parlons de votre image</a>
        <a class="diag-cta__btn" href="/graphiste-nice" data-cta>Voir l'identité de marque</a>
      </div>
    </div>`;
  return `<div class="diag-cta">
      <p class="diag-cta__kicker">La journée Diurn · 350&nbsp;€</p>
      <p class="diag-cta__text"><strong>Ces priorités, je les corrige en une journée.</strong> Prix fixe, un seul interlocuteur, et un bilan avant/après chiffré le soir même.</p>
      <ul class="diag-cta__list">
        <li>Vitesse&nbsp;: images allégées, chargement accéléré sur mobile</li>
        <li>Google&nbsp;: titres et descriptions de vos pages principales, fiche Google complétée</li>
        <li>Téléphone&nbsp;: affichage corrigé, numéro et boutons cliquables</li>
      </ul>
      <p class="diag-cta__small">Si votre site ne peut pas être corrigé en une journée, je vous le dis lors de l'appel, avant tout engagement. Prix net, TVA non applicable.</p>
      <div class="diag-cta__actions">
        ${appel}
        <a class="diag-cta__btn" href="tel:+33650949615">Appeler&nbsp;: 06&nbsp;50&nbsp;94&nbsp;96&nbsp;15</a>
      </div>
    </div>`;
}

function rendu(d, email) {
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
  const envoye = d.emailEnvoye ? `<p class="diag-note">Le résultat vous a aussi été envoyé à ${esc(email)}.</p>` : "";

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
    ${offre(d.note)}
    ${envoye}
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

  const showError = (code) => {
    status.textContent = ERREURS[code] || ERREURS.injoignable;
    status.classList.add("is-error");
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

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";
    status.classList.remove("is-error");

    const data = Object.fromEntries(new FormData(form));
    if (!String(data.site || "").trim()) return showError("adresse");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email || ""))) return showError("email");

    let source = "";
    try {
      source = sessionStorage.getItem("diurn-source") || "";
    } catch {
      /* stockage bloqué */
    }

    setBusy(true);
    track("diagnostic_lance", { page_path: location.pathname });
    try {
      const r = await fetch("/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, lettre: Boolean(data.lettre), page: location.pathname, source }),
        signal: AbortSignal.timeout(75_000),
      });
      const d = await r.json().catch(() => ({ ok: false, erreur: r.status === 429 ? "trop" : "injoignable" }));
      setBusy(false);
      if (!d.ok) return showError(d.erreur);

      form.hidden = true;
      if (title) title.textContent = "Votre diagnostic";
      result.innerHTML = rendu(d, data.email);
      result.hidden = false;
      result.querySelector(".diag-result__title").focus();
      track("generate_lead", { form_name: "diagnostic" });
      track("diagnostic_termine", { note: d.note });
    } catch {
      setBusy(false);
      showError("reseau");
    }
  });

  // « Tester un autre site » : retour au formulaire, e-mail conservé
  result.addEventListener("click", (e) => {
    if (!e.target.closest(".diag-again")) return;
    result.hidden = true;
    result.innerHTML = "";
    form.hidden = false;
    if (title) title.textContent = "Lancer le diagnostic";
    form.querySelector("#dg-site").value = "";
    form.querySelector("#dg-site").focus();
  });
}

initDiagnostic();
