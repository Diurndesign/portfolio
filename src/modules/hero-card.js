// ============================================================
//  Hero — carte de visite à retourner
// ============================================================
// Un clic (ou Entrée / Espace) sur le recto retourne la carte ; le bouton
// « Retourner la carte » du verso la remet à l'endroit. La face cachée est
// rendue inerte : ni focus clavier, ni lecture par les lecteurs d'écran.

function initHeroCard() {
  const card = document.querySelector(".hero__card");
  if (!card) return;

  const front = card.querySelector(".hero__card-face--front");
  const back = card.querySelector(".hero__card-face--back");
  const flipBtn = card.querySelector(".hero__card-flip");
  const backBtn = card.querySelector(".hero__card-back");

  function setFlipped(flipped) {
    card.classList.toggle("is-flipped", flipped);
    flipBtn.setAttribute("aria-pressed", flipped ? "true" : "false");
    back.inert = !flipped;
    front.inert = flipped;
    (flipped ? backBtn : flipBtn).focus({ preventScroll: true });
  }

  flipBtn.addEventListener("click", () => setFlipped(true));
  backBtn.addEventListener("click", () => setFlipped(false));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHeroCard);
} else {
  initHeroCard();
}
