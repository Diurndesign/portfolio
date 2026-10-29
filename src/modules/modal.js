// ============================================================
//  Modal projets — ouverture/fermeture accessible
// ============================================================
// La fiche d'un projet est GÉNÉRÉE à partir des données (projects.data.js) :
// ajouter un projet là-bas suffit, pas besoin de toucher au HTML.
// Le seul contenu encore en <template> est « Mentions légales » (#detail-legal).

import { projects } from "../projects/projects.data.js";
import { renderTech } from "../projects/tech-icons.js";

// Construit le HTML d'une fiche projet à partir de son objet `detail`.
// Mise en page « verre » : le texte à gauche (en-tête, fiche technique,
// rubriques), les images et la démo à droite.
function renderFiche(proj) {
  const d = proj.detail;
  const num = String(projects.indexOf(proj) + 1).padStart(2, "0");
  const cat = d.cat || proj.cat || "";
  const title = d.title || proj.title || "";
  const tags = (d.stack || []).map((t) => `<li>${t}</li>`).join("");
  const techs = (d.tech || []).map(renderTech).join("");
  // Fiche structurée (Contexte, Objectifs…) si `sections`, sinon paragraphes libres.
  const body = d.sections
    ? d.sections
        .map(
          (s) => `<section class="project__section">
              <h4 class="project__section-title">${s.heading}</h4>
              <p>${s.text}</p>
            </section>`
        )
        .join("")
    : (d.body || []).map((p) => `<p>${p}</p>`).join("");
  const links = (d.links || [])
    .map(
      (l) =>
        `<a class="project__link" href="${l.href}" target="_blank" rel="noopener">${l.label} <span aria-hidden="true">↗</span></a>`
    )
    .join("");
  const g = d.gallery;
  const imgs = g
    ? g.images
        .map(
          (im) =>
            `<img src="${im.src}" alt="${im.alt}" loading="lazy" width="${im.width}" height="${im.height}" />`
        )
        .join("")
    : "";

  // Fiche technique, façon « spec sheet » : une ligne par information.
  const tools = techs
    ? `<ul class="project__techs" aria-label="Technologies utilisées">${techs}</ul>`
    : tags
      ? `<ul class="project__tags">${tags}</ul>`
      : "";
  const spec = `<dl class="project__spec">
      <div class="project__spec-row"><dt>N°</dt><dd>${num}</dd></div>
      ${cat ? `<div class="project__spec-row"><dt>Catégorie</dt><dd>${cat}</dd></div>` : ""}
      ${tools ? `<div class="project__spec-row"><dt>Outils</dt><dd>${tools}</dd></div>` : ""}
    </dl>`;

  // Démo jouable (iframe) + QR code, pour les projets qui l'exposent (ex. Murmure).
  // L'iframe n'est créée qu'à l'ouverture de la modale (pas au chargement de la page).
  const demo = d.demo
    ? `<div class="project__demo">
         <div class="project__phone">
           <div class="project__screen">
             <iframe
               class="project__iframe"
               src="${d.demo.url}"
               title="${d.demo.title || "Démo de l'application"}"
               loading="lazy"
               allow="clipboard-write"
             ></iframe>
           </div>
         </div>
         ${
           d.qr
             ? `<figure class="project__qr">
                  <img src="${d.qr.src}" alt="QR code pour ouvrir l'application sur mobile" width="235" height="234" loading="lazy" />
                  <figcaption>${d.qr.label || "Scanne pour tester sur mobile."}</figcaption>
                </figure>`
             : ""
         }
       </div>`
    : "";
  const gallery = g
    ? `<div class="project__gallery${g.screens ? " project__gallery--screens" : ""}">${imgs}</div>`
    : "";

  return `
    <article class="project">
      <div class="project__main">
        <header class="project__head">
          <h3 class="project__title" id="modal-title">${title}</h3>
          ${d.tagline ? `<p class="project__tagline">${d.tagline}</p>` : ""}
        </header>
        ${spec}
        <div class="project__text${d.sections ? " project__text--sections" : ""}">${body}</div>
        ${links ? `<div class="project__links">${links}</div>` : ""}
      </div>
      ${demo || gallery ? `<div class="project__media">${demo}${gallery}</div>` : ""}
    </article>`;
}

function initModal() {
  const modal = document.getElementById("modal");
  const body = document.getElementById("modal-body");
  if (!modal || !body) return;

  const dialog = modal.querySelector(".modal__dialog");
  const closeBtn = modal.querySelector(".modal__close");
  let lastFocused = null;

  const isOpen = () => modal.classList.contains("is-open");

  function open(id) {
    const tpl = document.getElementById("detail-" + id);
    const proj = projects.find((p) => p.id === id && p.detail);
    if (!tpl && !proj) return;

    body.innerHTML = "";
    if (tpl) {
      // Contenu encore en <template> (ex. mentions légales)
      body.appendChild(tpl.content.cloneNode(true));
    } else {
      // Fiche projet générée depuis les données
      body.innerHTML = renderFiche(proj);
    }
    body.scrollTop = 0;

    // Nomme la fenêtre avec le titre du projet (accessibilité) ; l'attribut
    // reste valide au chargement (aria-label statique dans le HTML).
    const titleEl = body.querySelector(".project__title");
    dialog.setAttribute(
      "aria-label",
      titleEl ? titleEl.textContent.trim() : "Détail du projet"
    );

    // Fiche projet : habillage « verre » et page en noir et blanc derrière.
    // Les autres contenus (mentions légales) gardent le panneau clair.
    modal.classList.toggle("modal--project", !tpl);

    lastFocused = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");

    // focus sur le bouton de fermeture
    closeBtn.focus();
    document.addEventListener("keydown", onKeydown);
  }

  function close() {
    if (!isOpen()) return;

    // Nettoie le deep-link (#projet-…) pour ne pas rouvrir au rechargement.
    if (/^#projet-/i.test(location.hash)) {
      history.replaceState(null, "", location.pathname + location.search);
    }

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    document.removeEventListener("keydown", onKeydown);

    // on vide après la transition pour éviter un flash
    window.setTimeout(() => {
      if (!isOpen()) body.innerHTML = "";
    }, 300);

    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  function onKeydown(e) {
    if (e.key === "Escape") {
      close();
      return;
    }
    if (e.key === "Tab") trapFocus(e);
  }

  // piège à focus basique à l'intérieur du dialog
  function trapFocus(e) {
    const focusables = dialog.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  // Ouverture depuis les cartes : délégation d'événement au niveau du
  // document, afin que les cartes rendues dynamiquement (grille React
  // filtrable) déclenchent le modal au même titre que le HTML statique.
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-project]");
    if (trigger) open(trigger.getAttribute("data-project"));
  });

  // fermeture (croix + overlay)
  modal.querySelectorAll("[data-close]").forEach((el) => {
    el.addEventListener("click", close);
  });

  // Deep-link : ouverture directe d'un projet via l'URL (#projet-<id>),
  // utilisé par les cartes « réalisations » des pages landing.
  function openFromHash() {
    const m = location.hash.match(/^#projet-([a-z0-9-]+)$/i);
    if (m) open(m[1]);
  }
  openFromHash();
  window.addEventListener("hashchange", openFromHash);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initModal);
} else {
  initModal();
}
