// Point d'entrée JS — importe les styles pour que Vite les compile.
import "./scss/main.scss";
import "./modules/modal.js";
import "./modules/nav-toggle.js";
import "./modules/scroll-nav.js";
import "./modules/site-logo.js";
import "./modules/consent.js";
import "./modules/contact-form.js";
import "./modules/about-photo.js";
import "./modules/hero-card.js";
import "./modules/track.js";
import "./modules/calendly.js";

// Grille de projets filtrable (React). Chargée à la demande, uniquement sur
// la page qui la contient : les autres pages n'embarquent pas React.
if (document.getElementById("projects-root")) {
  import("./projects/mount.jsx").then((m) => m.mountProjects());
}
