// ============================================================
//  Navbar adaptative — passe en foncé quand une section claire
//  (marquée [data-nav-light]) traverse le centre du viewport. En thème
//  orange, les sections [data-nav-paper] sont claires aussi, et les
//  sections [data-nav-dark] (charbon) passent le menu en clair.
// ============================================================

function initScrollNav() {
  const nav = document.querySelector(".nav");
  const sections = document.querySelectorAll(
    "[data-nav-light], [data-nav-paper], [data-nav-dark]"
  );
  if (!nav || !sections.length || !("IntersectionObserver" in window)) return;

  const active = new Set();

  function update() {
    const orange = document.documentElement.dataset.theme === "orange";
    const list = [...active];
    const light = list.some(
      (s) => s.hasAttribute("data-nav-light") || (orange && s.hasAttribute("data-nav-paper"))
    );
    nav.classList.toggle("nav--light", light);
    nav.classList.toggle("nav--dark", list.some((s) => s.hasAttribute("data-nav-dark")));
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) active.add(entry.target);
        else active.delete(entry.target);
      });
      update();
    },
    // bande fine au centre vertical : actif quand la section croise le milieu
    { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
  // le bouton de thème (theme.js) change la nature des sections
  document.addEventListener("themechange", update);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initScrollNav);
} else {
  initScrollNav();
}
