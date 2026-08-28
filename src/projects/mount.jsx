// Montage du composant React « Projets » dans la page d'accueil.
// Chargé dynamiquement par main.js uniquement si #projects-root existe,
// pour que React ne pèse pas sur les autres pages (code-splitting).
import { createRoot } from "react-dom/client";
import Projects from "./Projects.jsx";

export function mountProjects() {
  const el = document.getElementById("projects-root");
  if (!el) return;
  createRoot(el).render(<Projects />);
}
