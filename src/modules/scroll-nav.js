// ============================================================
//  Navbar adaptative — passe en foncé quand une section claire
//  (marquée [data-nav-light]) traverse le centre du viewport, et en
//  clair sur une section sombre ([data-nav-dark]).
// ============================================================

function initScrollNav() {
  const nav = document.querySelector(".nav");
  const sections = document.querySelectorAll("[data-nav-light], [data-nav-dark]");
  if (!nav || !sections.length || !("IntersectionObserver" in window)) return;

  const active = new Set();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) active.add(entry.target);
        else active.delete(entry.target);
      });
      const list = [...active];
      nav.classList.toggle("nav--light", list.some((s) => s.hasAttribute("data-nav-light")));
      nav.classList.toggle("nav--dark", list.some((s) => s.hasAttribute("data-nav-dark")));
    },
    // bande fine au centre vertical : actif quand la section croise le milieu
    { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initScrollNav);
} else {
  initScrollNav();
}
