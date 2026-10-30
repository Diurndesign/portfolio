// ============================================================
//  Sigles dans la police d'affichage
// ============================================================
// Dans Hello Paris Serif, les capitales sont ornées (arabesques) et les
// minuscules s'affichent en petites capitales droites. Une capitale
// isolée en début de mot reste ornée (c'est le style des titres), mais
// une suite de capitales (IA, FAQ, GPT…) devient illisible : elle est
// enveloppée dans <span class="caps">, affichée en minuscules, donc en
// petites capitales nettes. Le texte source ne change pas.

const RUN = /[A-ZÀ-ÖØ-Þ]{2,}/;
const RUN_ALL = /[A-ZÀ-ÖØ-Þ]{2,}/g;

function isDisplay(el) {
  return getComputedStyle(el).fontFamily.startsWith('"Hello Paris');
}

function wrapText(node) {
  const text = node.nodeValue;
  if (!RUN.test(text)) return;
  const el = node.parentElement;
  if (!el || el.closest(".caps, script, style, textarea, [contenteditable]") || !isDisplay(el)) return;
  const frag = document.createDocumentFragment();
  let last = 0;
  text.replace(RUN_ALL, (match, index) => {
    if (index > last) frag.appendChild(document.createTextNode(text.slice(last, index)));
    const span = document.createElement("span");
    span.className = "caps";
    span.textContent = match;
    frag.appendChild(span);
    last = index + match.length;
    return match;
  });
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
    acceptNode: (n) => (RUN.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
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
