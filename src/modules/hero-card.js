// ============================================================
//  Hero — carte de visite à retourner
// ============================================================
// Un clic (ou Entrée / Espace) sur le recto retourne la carte ; le bouton
// « Retourner la carte » du verso la remet à l'endroit. La face cachée est
// rendue inerte : ni focus clavier, ni lecture par les lecteurs d'écran.
// Avec une souris, la carte s'incline et un reflet suit le pointeur.
// Au doigt, on fait glisser la carte pour la faire tourner : elle suit le
// geste, puis se pose sur la face la plus proche (ou se retourne si le
// geste est rapide).

const MAX_TILT = 8; // degrés
const DRAG_START = 10; // px avant de considérer le geste comme un glissé
const FLICK_SPEED = 0.3; // px/ms : un geste plus rapide retourne la carte

function initHeroCard() {
  const card = document.querySelector(".hero__card");
  if (!card) return;

  const front = card.querySelector(".hero__card-face--front");
  const back = card.querySelector(".hero__card-face--back");
  const flipBtn = card.querySelector(".hero__card-flip");
  const backBtn = card.querySelector(".hero__card-back");

  const flipper = card.querySelector(".hero__card-flipper");
  let angle = 0; // rotation cumulée (0, 180, 360…), pour tourner sans revenir en arrière

  // Met à jour l'état (faces inertes, aria) selon la face visible
  function syncFaces(focus) {
    const flipped = Math.round(angle / 180) % 2 !== 0;
    card.classList.toggle("is-flipped", flipped);
    flipBtn.setAttribute("aria-pressed", flipped ? "true" : "false");
    back.inert = !flipped;
    front.inert = flipped;
    if (focus) (flipped ? backBtn : flipBtn).focus({ preventScroll: true });
  }

  function rotateTo(deg, animate = true) {
    angle = deg;
    flipper.style.transition = animate ? "" : "none";
    flipper.style.transform = `rotateY(${angle}deg)`;
  }

  flipBtn.addEventListener("click", () => {
    rotateTo(angle + 180);
    syncFaces(true);
  });
  backBtn.addEventListener("click", () => {
    rotateTo(angle - 180);
    syncFaces(true);
  });

  initSwipe(card, {
    getAngle: () => angle,
    rotateTo,
    settle(deg) {
      rotateTo(deg);
      syncFaces(false);
    },
  });

  initTilt(card);
}

// Glisser au doigt (ou au stylet) pour faire tourner la carte. Le défilement
// vertical de la page reste possible (touch-action: pan-y en CSS).
function initSwipe(card, { getAngle, rotateTo, settle }) {
  let startX = 0;
  let startAngle = 0;
  let lastX = 0;
  let lastT = 0;
  let speed = 0;
  let dragging = false;
  let pointerId = null;

  card.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse") return; // la souris clique, elle ne glisse pas
    pointerId = e.pointerId;
    startX = lastX = e.clientX;
    lastT = e.timeStamp;
    startAngle = getAngle();
    dragging = false;
    speed = 0;
  });

  card.addEventListener("pointermove", (e) => {
    if (e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!dragging && Math.abs(dx) < DRAG_START) return;
    if (!dragging) {
      dragging = true;
      card.setPointerCapture(pointerId);
    }
    const dt = e.timeStamp - lastT || 1;
    speed = (e.clientX - lastX) / dt;
    lastX = e.clientX;
    lastT = e.timeStamp;
    // largeur de la carte = un demi-tour
    rotateTo(startAngle + (dx / card.offsetWidth) * 180, false);
  });

  function end(e) {
    if (e.pointerId !== pointerId) return;
    pointerId = null;
    if (!dragging) return;
    let target = Math.round(getAngle() / 180) * 180;
    // geste rapide : on retourne dans le sens du geste, même si court
    if (target === startAngle && Math.abs(speed) > FLICK_SPEED) {
      target = startAngle + Math.sign(speed) * 180;
    }
    settle(target);
  }

  card.addEventListener("pointerup", end);
  card.addEventListener("pointercancel", end);

  // Un glissé ne doit pas déclencher le clic des boutons de la carte
  card.addEventListener(
    "click",
    (e) => {
      if (dragging) {
        e.preventDefault();
        e.stopPropagation();
        dragging = false;
      }
    },
    true
  );
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

// Contact du hero : « Discutons de votre projet » ouvre deux bulles
// (Appeler, Écrire). Survol à la souris, toucher ou clavier sinon ;
// Échap ou un clic ailleurs les referme.
function initHeroContact() {
  const box = document.querySelector(".hero__contact");
  if (!box) return;
  const toggle = box.querySelector(".hero__contact-toggle");
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  let closeTimer = 0;

  function setOpen(open) {
    clearTimeout(closeTimer);
    box.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  toggle.addEventListener("click", (e) => {
    // à la souris, le survol a déjà ouvert : le clic ne doit pas refermer
    // (detail > 0 = vrai clic ; 0 = Entrée / Espace au clavier)
    if (canHover && e.detail > 0) setOpen(true);
    else setOpen(!box.classList.contains("is-open"));
  });

  if (canHover) {
    box.addEventListener("mouseenter", () => setOpen(true));
    // petit délai : laisse le temps de rejoindre une bulle
    box.addEventListener("mouseleave", () => {
      closeTimer = setTimeout(() => setOpen(false), 250);
    });
  }

  box.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && box.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  box.addEventListener("focusout", (e) => {
    if (!box.contains(e.relatedTarget)) setOpen(false);
  });

  document.addEventListener("click", (e) => {
    if (!box.contains(e.target)) setOpen(false);
  });

  // après un choix, les bulles se referment
  box.querySelectorAll(".hero__bubble").forEach((a) =>
    a.addEventListener("click", () => setOpen(false))
  );
}

function init() {
  initHeroCard();
  initHeroContact();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
