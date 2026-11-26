// ============================================================
//  Grille de projets filtrable — composant React
// ============================================================
// Enrichit la grille statique de l'accueil : des filtres par type de projet
// mettent à jour la liste sans rechargement. Les cartes rendues sont
// strictement identiques au HTML statique (mêmes classes, mêmes attributs
// data-project), de sorte que le CSS et l'ouverture des modals (délégation
// d'événements dans modal.js) fonctionnent sans y toucher.
//
// Deux listes : les projets clients d'abord, puis la section « Labo »
// (projets personnels et de formation, group: "labo" dans les données).
// Les filtres s'appliquent aux deux ; la section Labo disparaît si aucun
// de ses projets ne correspond au filtre choisi.

import { useMemo, useState } from "react";
import { filters, projects } from "./projects.data.js";

function Card({ project }) {
  const media = (
    <span className="card__media">
      <img
        src={project.img.src}
        alt={project.img.alt}
        loading="lazy"
        width={project.img.width}
        height={project.img.height}
      />
      <span className="card__overlay">
        <span className="card__cat">{project.cat}</span>
        <span className="card__title">{project.title}</span>
        {project.desc && <span className="card__desc">{project.desc}</span>}
        <span className="card__cta" aria-hidden="true">
          Découvrir
        </span>
      </span>
    </span>
  );

  // Carte-lien vers une autre page (ex. étude de cas) : prioritaire sur la
  // modale, pour que la carte de l'accueil mène à /realisations/<slug>.
  if (project.cardHref) {
    return (
      <a className="card__btn" href={project.cardHref}>
        {media}
      </a>
    );
  }

  // kind "link" : lien externe (ex. Murmure, ouvert dans un nouvel onglet) ;
  // les autres cartes ouvrent une fiche modal.
  if (project.kind === "link") {
    return (
      <a
        className="card__btn"
        href={project.href}
        target={project.target}
        rel={project.rel}
        aria-label={project.ariaLabel}
      >
        {media}
      </a>
    );
  }

  return (
    <button
      className="card__btn"
      type="button"
      data-project={project.id}
      aria-haspopup="dialog"
    >
      {media}
    </button>
  );
}

// Une grille de cartes. `offset` décale le départ de l'animation en
// cascade, pour que la grille Labo enchaîne après celle des clients.
function Grid({ items, offset = 0 }) {
  return (
    <ul className="projets__grid projets__grid--enhanced">
      {items.map((project, i) => (
        <li
          className={"card card--" + (project.tone || "bleu")}
          key={project.id}
          style={{ animationDelay: `${(offset + i) * 45}ms` }}
        >
          <Card project={project} />
        </li>
      ))}
    </ul>
  );
}

export default function Projects() {
  const [active, setActive] = useState("all");

  const visible = useMemo(
    () =>
      active === "all"
        ? projects
        : projects.filter((p) => p.tags.includes(active)),
    [active]
  );

  const clients = visible.filter((p) => p.group !== "labo");
  const labo = visible.filter((p) => p.group === "labo");

  return (
    <>
      <div
        className="projets__filters"
        role="group"
        aria-label="Filtrer les projets par type"
      >
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            className={
              "projets__filter" + (active === f.id ? " is-active" : "")
            }
            aria-pressed={active === f.id}
            onClick={() => setActive(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Annonce discrète pour les lecteurs d'écran à chaque changement de filtre */}
      <p className="sr-only" aria-live="polite">
        {visible.length} projet{visible.length > 1 ? "s" : ""} affiché
        {visible.length > 1 ? "s" : ""}
      </p>

      {/* key : la liste se remonte à chaque filtre, rejouant
          l'animation d'apparition en cascade des cartes. */}
      <Grid key={"clients-" + active} items={clients} />

      {labo.length > 0 && (
        <section className="projets__labo" id="labo" aria-labelledby="labo-title">
          <header className="projets__labo-head">
            <h3 className="projets__labo-title" id="labo-title">
              Labo <span className="projets__labo-sub">— projets personnels et de formation</span>
            </h3>
          </header>
          <Grid key={"labo-" + active} items={labo} offset={clients.length} />
        </section>
      )}
    </>
  );
}
