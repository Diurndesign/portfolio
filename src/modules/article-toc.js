// ============================================================
//  Sommaire des articles — surligne la section en cours de lecture
// ============================================================

function initArticleToc() {
  const links = [...document.querySelectorAll(".article-toc a[href^='#']")];
  if (!links.length || !("IntersectionObserver" in window)) return;

  const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const sections = [...byId.keys()]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.remove("is-active"));
        const link = byId.get(entry.target.id);
        if (link) link.classList.add("is-active");
      });
    },
    // bande au tiers haut de l'écran : la section lue est celle qui la croise
    { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
  );

  sections.forEach((s) => observer.observe(s));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initArticleToc);
} else {
  initArticleToc();
}
