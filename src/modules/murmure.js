// ============================================================
//  Murmure — chargement de la démo (iframe) à la demande
//  L'iframe n'est injectée qu'au clic : meilleures perfs et,
//  si l'app refuse l'embarquement, la section reste utilisable
//  (poster + bouton « plein écran » toujours présents).
// ============================================================

const APP_URL = "https://murmure-orpin.vercel.app/";

function initMurmure() {
  const btn = document.querySelector("[data-murmure-play]");
  const frame = document.getElementById("murmure-frame");
  if (!btn || !frame) return;

  btn.addEventListener("click", () => {
    if (frame.classList.contains("is-live")) return;

    const iframe = document.createElement("iframe");
    iframe.src = APP_URL;
    iframe.title = "Murmure — l'application en direct";
    iframe.loading = "lazy";
    iframe.className = "phone__iframe";
    // pas de sandbox (l'app garde tous ses droits) ; on laisse le Referer
    // par défaut au cas où l'API le vérifie.

    frame.appendChild(iframe);
    frame.classList.add("is-live"); // masque le poster + le bouton (CSS)
    btn.setAttribute("hidden", "");
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMurmure);
} else {
  initMurmure();
}
