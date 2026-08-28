// ============================================================
//  Photo « À propos » — révèle les compétences
// ============================================================
// Le survol souris révèle les compétences via le CSS. Ce module ajoute le
// support clavier et tactile : Entrée / Espace ou un tap basculent l'état,
// pour les utilisateurs sans souris.

function initAboutPhoto() {
  const fig = document.querySelector(".about__photo");
  if (!fig) return;

  function toggle() {
    const open = fig.classList.toggle("is-revealed");
    fig.setAttribute("aria-expanded", open ? "true" : "false");
  }

  fig.addEventListener("click", toggle);

  fig.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAboutPhoto);
} else {
  initAboutPhoto();
}
