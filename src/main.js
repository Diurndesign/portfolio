// Point d'entrée JS — importe les styles pour que Vite les compile.
import "./scss/main.scss";
import "./modal.js";
import "./nav-toggle.js";
import "./footer-nav.js";
import "./scroll-nav.js";
import "./site-logo.js";
import "./murmure.js";
import "./consent.js";
import "./contact-form.js";

// Grille de projets filtrable (React). Chargée à la demande, uniquement sur
// la page qui la contient : les autres pages n'embarquent pas React.
if (document.getElementById("projects-root")) {
  import("./projects/mount.jsx").then((m) => m.mountProjects());
}
