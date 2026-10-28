// ============================================================
//  Photo « À propos » — révèle les compétences
// ============================================================
// Le survol souris révèle les compétences via le CSS. Un vrai <button>,
// posé sur la photo, ajoute le support clavier et clic : il bascule l'état
// et tient aria-expanded à jour. Sur tactile, le CSS masque ce bouton et
// affiche les compétences d'office sous la photo.

function initAboutPhoto() {
  const fig = document.querySelector(".about__photo");
  const btn = fig && fig.querySelector(".about__photo-toggle");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const open = fig.classList.toggle("is-revealed");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAboutPhoto);
} else {
  initAboutPhoto();
}
