// ============================================================
//  Tableaux comparatifs lisibles sur mobile
// ============================================================
// Sous 600 px, chaque ligne du tableau devient une carte (styles dans
// sections/_landing.scss) : chaque cellule reçoit le nom de sa colonne
// (data-label), lu dans l'en-tête. Les rôles ARIA gardent la structure de
// tableau pour les lecteurs d'écran, même avec un affichage en blocs.

function initCompare() {
  document.querySelectorAll("table.compare").forEach((table) => {
    const heads = [...table.querySelectorAll("thead th")].map((th) => th.textContent.trim());
    table.setAttribute("role", "table");
    table.querySelectorAll("thead, tbody").forEach((g) => g.setAttribute("role", "rowgroup"));
    table.querySelectorAll("tr").forEach((tr) => {
      tr.setAttribute("role", "row");
      [...tr.children].forEach((cell, i) => {
        const inHead = cell.closest("thead");
        cell.setAttribute("role", inHead ? "columnheader" : cell.tagName === "TH" ? "rowheader" : "cell");
        if (!inHead && heads[i]) cell.dataset.label = heads[i];
      });
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCompare);
} else {
  initCompare();
}
