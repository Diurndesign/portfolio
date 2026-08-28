// ============================================================
//  Grille de projets filtrable — composant React
// ============================================================
// Enrichit la grille statique de l'accueil : des filtres par type de projet
// mettent à jour la liste sans rechargement. Les cartes rendues sont
// strictement identiques au HTML statique (mêmes classes, mêmes attributs
// data-project), de sorte que le CSS et l'ouverture des modals (délégation
// d'événements dans modal.js) fonctionnent sans y toucher.

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
      </span>
    </span>
  );

  // Murmure renvoie vers sa section dédiée ; les autres ouvrent une fiche modal.
  if (project.kind === "link") {
    return (
      <a className="card__btn" href={project.href} aria-label={project.ariaLabel}>
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

export default function Projects() {
  const [active, setActive] = useState("all");

  const visible = useMemo(
    () =>
      active === "all"
        ? projects
        : projects.filter((p) => p.tags.includes(active)),
    [active]
  );

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

      {/* key={active} : la liste se remonte à chaque filtre, rejouant
          l'animation d'apparition en cascade des cartes. */}
      <ul className="projets__grid projets__grid--enhanced" key={active}>
        {visible.map((project, i) => (
          <li
            className="card"
            key={project.id}
            style={{ animationDelay: `${i * 45}ms` }}
          >
            <Card project={project} />
          </li>
        ))}
      </ul>
    </>
  );
}
