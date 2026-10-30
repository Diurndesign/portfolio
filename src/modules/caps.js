// ============================================================
//  Capitales dans la police d'affichage
// ============================================================
// Dans Hello Paris Serif, les capitales sont ornées (arabesques) et les
// minuscules s'affichent en petites capitales droites. Seule la première
// lettre d'un titre garde sa capitale ornée (c'est le style des titres) :
// au milieu d'un titre, une capitale ornée déborde sur le mot d'avant
// (« chezDiurn ») et une suite de capitales (IA, FAQ…) devient illisible.
// Ces capitales sont enveloppées dans <span class="caps">, affichées en
// minuscules, donc en petites capitales nettes. Le texte ne change pas.
// Les noms de projets (cartes, fiches) gardent leur graphie : seules
// leurs suites de capitales sont adoucies.

const CAP = /[A-ZÀ-ÖØ-Þ]/;
const CAPS_ALL = /[A-ZÀ-ÖØ-Þ]+/g;
const LETTER = /[A-Za-zÀ-ÖØ-öø-ÿ]/;
const BRAND = ".card__title, .project__title";

function isDisplay(el) {
  return getComputedStyle(el).fontFamily.startsWith('"Hello Paris');
}

// Bloc qui porte le titre (premier ancêtre qui n'est pas « inline »)
function blockOf(el) {
  let b = el;
  while (b.parentElement && getComputedStyle(b).display.startsWith("inline")) b = b.parentElement;
  return b;
}

function wrapText(node) {
  const text = node.nodeValue;
  if (!CAP.test(text)) return;
  const el = node.parentElement;
  if (!el || el.closest(".caps, script, style, textarea, [contenteditable]") || !isDisplay(el)) return;
  const brand = !!el.closest(BRAND);
  // lettres déjà présentes avant ce texte dans le même titre
  const range = document.createRange();
  range.setStart(blockOf(el), 0);
  range.setEnd(node, 0);
  let seenLetter = LETTER.test(range.toString());

  const frag = document.createDocumentFragment();
  let last = 0;
  let changed = false;
  text.replace(CAPS_ALL, (match, index) => {
    if (!seenLetter) seenLetter = LETTER.test(text.slice(0, index));
    const initial = !seenLetter;
    // capitale initiale du titre : gardée ; ailleurs, adoucie (sauf noms
    // de projets, où seules les suites de capitales le sont)
    const keep = match.length === 1 && (initial || brand);
    const start = initial && match.length > 1 ? 1 : 0;
    if (!keep && match.length > start) {
      if (index + start > last) frag.appendChild(document.createTextNode(text.slice(last, index + start)));
      const span = document.createElement("span");
      span.className = "caps";
      span.textContent = match.slice(start);
      frag.appendChild(span);
      last = index + match.length;
      changed = true;
    }
    seenLetter = true;
    return match;
  });
  if (!changed) return;
  if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
  node.replaceWith(frag);
}

function scan(root) {
  if (root.nodeType === Node.TEXT_NODE) {
    wrapText(root);
    return;
  }
  if (root.nodeType !== Node.ELEMENT_NODE) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (CAP.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(wrapText);
}

function initCaps() {
  scan(document.body);
  // Contenu ajouté ensuite : grille de projets (React), fiches en fenêtre
  new MutationObserver((records) => {
    records.forEach((r) => r.addedNodes.forEach(scan));
  }).observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCaps);
} else {
  initCaps();
}
