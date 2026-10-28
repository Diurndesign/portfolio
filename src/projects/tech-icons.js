// ============================================================
//  Logos des technologies (fiches projet)
// ============================================================
// Tracés SVG issus de simple-icons. Les imports nommés permettent à Vite de
// n'embarquer que les logos listés ici (tree-shaking), pas toute la librairie.
// Pour ajouter une techno : importer son icône (siXxx) et l'ajouter à `icons`,
// puis utiliser sa clé dans `detail.tech` (projects.data.js).

import {
  siCss,
  siDocker,
  siHtml5,
  siJavascript,
  siJsonwebtokens,
  siReact,
  siReactrouter,
  siSass,
  siSupabase,
  siVercel,
  siVite,
} from "simple-icons";

const icons = {
  html: { label: "HTML5", icon: siHtml5 },
  css: { label: "CSS3", icon: siCss },
  javascript: { label: "JavaScript", icon: siJavascript },
  react: { label: "React", icon: siReact },
  reactrouter: { label: "React Router", icon: siReactrouter },
  sass: { label: "Sass", icon: siSass },
  vite: { label: "Vite", icon: siVite },
  docker: { label: "Docker", icon: siDocker },
  jwt: { label: "JWT", icon: siJsonwebtokens },
  supabase: { label: "Supabase", icon: siSupabase },
  vercel: { label: "Vercel", icon: siVercel },
};

// Renvoie le <li> d'une techno : logo (décoratif) + nom lisible.
export function renderTech(key) {
  const t = icons[key];
  if (!t) return "";
  return `<li class="project__tech">
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${t.icon.path}" /></svg>
    ${t.label}
  </li>`;
}
