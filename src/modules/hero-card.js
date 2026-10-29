// ============================================================
//  Hero — carte de visite à retourner
// ============================================================
// Un clic (ou Entrée / Espace) sur le recto retourne la carte ; le bouton
// « Retourner la carte » du verso la remet à l'endroit. La face cachée est
// rendue inerte : ni focus clavier, ni lecture par les lecteurs d'écran.
// Avec une souris, la carte s'incline et un reflet suit le pointeur.

const MAX_TILT = 8; // degrés

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

  initTilt(card);
}

// Inclinaison : seulement avec une souris, et si les animations sont permises
function initTilt(card) {
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!canHover || reduce) return;

  let frame = 0;

  card.addEventListener("pointermove", (e) => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width; // 0 à 1
      const y = (e.clientY - r.top) / r.height;
      card.classList.remove("is-resting");
      card.style.setProperty("--tilt-x", `${(0.5 - y) * 2 * MAX_TILT}deg`);
      card.style.setProperty("--tilt-y", `${(x - 0.5) * 2 * MAX_TILT}deg`);
      card.style.setProperty("--glare-x", `${x * 100}%`);
      card.style.setProperty("--glare-y", `${y * 100}%`);
      card.style.setProperty("--glare-o", "1");
    });
  });

  card.addEventListener("pointerleave", () => {
    card.classList.add("is-resting"); // retour en douceur à plat
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
    card.style.setProperty("--glare-o", "0");
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHeroCard);
} else {
  initHeroCard();
}
