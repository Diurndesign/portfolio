// ============================================================
//  Études de cas — gabarit de page (génère le HTML statique)
// ============================================================
// renderCaseStudy(entry, allEntries) renvoie le document HTML complet d'une
// page /realisations/<slug>. Le contenu est inliné (indexable), et les
// fragments partagés sont inclus via <!--#include partials/...--> (résolus
// par le plugin html-partials de Vite, en dev comme au build).

const SITE = "https://www.diurnstudio.fr";
const INDEX_URL = `${SITE}/realisations`;

const p = (html) => `<p>${html}</p>`;

function renderFacts(entry) {
  const facts = (entry.facts || [])
    .map(
      (f) => `          <div class="case-study__fact">
            <dt class="case-study__fact-label">${f.label}</dt>
            <dd class="case-study__fact-value">${f.value}</dd>
          </div>`
    )
    .join("\n");

  const live = entry.live
    ? `        <a class="case-study__live" href="${entry.live.url}" target="_blank" rel="noopener">${entry.live.label} <span aria-hidden="true">↗</span></a>`
    : "";

  return `      <div class="case-study__facts-wrap">
        <dl class="case-study__facts">
${facts}
        </dl>
${live}
      </div>`;
}

// Texte brut d'une question ou d'une réponse (sans balises, espaces normaux),
// pour que le JSON-LD reprenne exactement le texte affiché.
const plainText = (t) =>
  t
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// JSON-LD FAQPage généré depuis la section « faq » de l'étude, s'il y en a une.
function renderFaqJsonLd(entry) {
  const faq = (entry.sections || []).find((s) => s.type === "faq");
  if (!faq) return "";
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((it) => ({
      "@type": "Question",
      name: plainText(it.q),
      acceptedAnswer: { "@type": "Answer", text: plainText(it.a) },
    })),
  };
  return `
    <!-- Données structurées : questions fréquentes (FAQPage) -->
    <script type="application/ld+json">
${JSON.stringify(data, null, 2)}
    </script>`;
}

function renderSection(section) {
  if (section.type === "text") {
    const body = section.paragraphs.map((t) => `          ${p(t)}`).join("\n");
    return `        <section class="landing__section">
          <h2>${section.heading}</h2>
${body}
        </section>`;
  }

  if (section.type === "cards") {
    const intro = section.intro ? `          ${p(section.intro)}\n` : "";
    const cards = section.cards
      .map(
        (c) => `            <li class="case-study__card">
              <h3 class="case-study__card-title">${c.title}</h3>
              <p>${c.text}</p>
            </li>`
      )
      .join("\n");
    return `        <section class="landing__section">
          <h2>${section.heading}</h2>
${intro}          <ul class="case-study__cards">
${cards}
          </ul>
        </section>`;
  }

  if (section.type === "gallery") {
    const figs = section.images
      .map(
        (im) => `          <figure class="case-study__fig${im.full ? " case-study__fig--full" : ""}">
            <img src="${im.src}" alt="${im.alt}" loading="lazy" width="${im.width}" height="${im.height}" />
          </figure>`
      )
      .join("\n");
    return `        <section class="landing__section">
          <div class="case-study__gallery">
${figs}
          </div>
        </section>`;
  }

  if (section.type === "faq") {
    const items = section.items
      .map(
        (it, i) => `            <details class="landing__faq-item"${i === 0 ? " open" : ""}>
              <summary>${it.q}</summary>
              <p>${it.a}</p>
            </details>`
      )
      .join("\n");
    return `        <section class="landing__section">
          <h2>${section.heading}</h2>
          <div class="landing__faq" aria-label="${section.label}">
${items}
          </div>
        </section>`;
  }

  if (section.type === "quote" || section.type === "testimonial") {
    const author = section.author
      ? `\n            <figcaption class="case-study__quote-author">${section.author}</figcaption>`
      : "";
    return `        <section class="landing__section">
          <h2>${section.heading || PARTS.temoignage.heading}</h2>
          <figure class="case-study__quote">
            <blockquote class="case-study__quote-text">${section.quote}</blockquote>${author}
          </figure>
        </section>`;
  }

  // « Le système » : la planche de l'identité (logo, couleurs, typographies,
  // déclinaisons). Images en pleine largeur par défaut (full: false pour
  // une demi-largeur), légende facultative sous chaque image.
  if (section.type === "system") {
    const intro = section.intro ? `          ${p(section.intro)}\n` : "";
    const figs = section.images
      .map((im) => {
        const caption = im.caption
          ? `\n            <figcaption class="case-study__caption">${im.caption}</figcaption>`
          : "";
        return `          <figure class="case-study__fig${im.full === false ? "" : " case-study__fig--full"}">
            <img src="${im.src}" alt="${im.alt}" loading="lazy" width="${im.width}" height="${im.height}" />${caption}
          </figure>`;
      })
      .join("\n");
    return `        <section class="landing__section case-study__system">
          <h2>${section.heading || PARTS.systeme.heading}</h2>
${intro}          <div class="case-study__gallery">
${figs}
          </div>
        </section>`;
  }

  return "";
}

// ------------------------------------------------------------
//  Trame commune des études de cas
// ------------------------------------------------------------
// Chaque étude suit la même trame : L'enjeu → Ce que j'ai fait → Le système
// (planche) → Le résultat → Témoignage. Une partie sans contenu n'est PAS
// affichée (aucun bloc vide en ligne) : le gabarit laisse à sa place un
// commentaire HTML « À COMPLÉTER », invisible pour le visiteur, qui dit quoi
// ajouter dans src/data/caseStudies.js. Rien n'est inventé ici : le contenu
// vient uniquement des données.
const PARTS = {
  enjeu: {
    heading: "L'enjeu",
    todo: "L'enjeu. Le problème du client avant le projet, en deux ou trois phrases (ses propres mots si possible). À ajouter dans src/data/caseStudies.js : { type: \"text\", part: \"enjeu\", heading: \"L'enjeu\", paragraphs: [ ... ] }",
  },
  systeme: {
    heading: "Le système",
    todo: "Le système (planche). La planche de l'identité : logo et déclinaisons, couleurs, typographies, règles d'usage. À ajouter dans src/data/caseStudies.js, après « Ce que j'ai fait » : { type: \"system\", heading: \"Le système\", intro: \"...\", images: [ { src, alt, width, height, caption } ] }",
  },
  resultat: {
    heading: "Le résultat",
    todo: "Le résultat. Ce qui a changé pour le client, avec des faits vérifiables (uniquement des chiffres réels). À ajouter dans src/data/caseStudies.js : { type: \"text\", part: \"resultat\", heading: \"Le résultat\", paragraphs: [ ... ] }",
  },
  temoignage: {
    heading: "Témoignage",
    todo: "Témoignage. Une citation réelle du client, avec son accord (jamais inventée). À ajouter dans src/data/caseStudies.js : { type: \"testimonial\", quote: \"...\", author: \"Prénom, entreprise\" }",
  },
};

// Partie de la trame couverte par une section : champ « part » explicite,
// sinon déduit du type ou du titre (« Le point de départ » = l'enjeu).
function partOf(section) {
  if (section.part) return section.part;
  if (section.type === "system") return "systeme";
  if (section.type === "quote" || section.type === "testimonial") return "temoignage";
  if (section.type === "text") {
    const h = section.heading || "";
    if (/point de départ|enjeu/i.test(h)) return "enjeu";
    if (/résultat/i.test(h)) return "resultat";
  }
  return null;
}

// Une section n'est affichée que si elle a du contenu.
const filled = (t) => typeof t === "string" && t.trim() !== "";
function hasContent(section) {
  switch (section.type) {
    case "text":
      return (section.paragraphs || []).some(filled);
    case "cards":
      return (section.cards || []).length > 0;
    case "gallery":
    case "system":
      return (section.images || []).length > 0;
    case "faq":
      return (section.items || []).length > 0;
    case "quote":
    case "testimonial":
      return filled(section.quote);
    default:
      return false;
  }
}

const todoComment = (key) => `        <!-- À COMPLÉTER : ${PARTS[key].todo} -->`;

// Sections de l'étude dans l'ordre des données, plus un commentaire
// « À COMPLÉTER » pour chaque partie de la trame absente : l'enjeu en tête,
// le système après « Ce que j'ai fait », le résultat et le témoignage à la fin.
function renderSections(entry) {
  const list = (entry.sections || [])
    .filter(hasContent)
    .map((s) => (s.type === "text" ? { ...s, paragraphs: s.paragraphs.filter(filled) } : s));
  const present = new Set(list.map(partOf).filter(Boolean));
  const out = [];

  if (!present.has("enjeu")) out.push(todoComment("enjeu"));

  let systemDone = present.has("systeme");
  for (const section of list) {
    out.push(renderSection(section));
    if (!systemDone && section.type === "cards") {
      out.push(todoComment("systeme"));
      systemDone = true;
    }
  }
  if (!systemDone) out.push(todoComment("systeme"));
  if (!present.has("resultat")) out.push(todoComment("resultat"));
  if (!present.has("temoignage")) out.push(todoComment("temoignage"));

  return out.join("\n\n");
}

function renderOthers(entry, allEntries) {
  // Les deux études suivantes dans la liste (en boucle) : chaque page renvoie
  // vers des études différentes, au lieu de toutes pointer vers les premières.
  const list = allEntries || [];
  const i = list.findIndex((e) => e.slug === entry.slug);
  const others = [1, 2]
    .map((k) => list[(i + k) % list.length])
    .filter((e, idx, arr) => e && e.slug !== entry.slug && arr.indexOf(e) === idx);

  if (!others.length) {
    return `        <section class="landing__section case-study__others">
          <h2>Autres réalisations</h2>
          <p class="landing__work-more"><a href="/realisations">Voir toutes les réalisations <span aria-hidden="true">→</span></a></p>
        </section>`;
  }

  const cards = others
    .map(
      (o) => `            <a class="guide-card" href="/realisations/${o.slug}">
              <span class="guide-card__kicker">Étude de cas</span>
              <h3 class="guide-card__title">${o.breadcrumb}</h3>
              <p class="guide-card__desc">${o.intro}</p>
              <span class="guide-card__more">Voir l'étude de cas <span aria-hidden="true">→</span></span>
            </a>`
    )
    .join("\n");

  return `        <section class="landing__section case-study__others">
          <h2>Autres réalisations</h2>
          <div class="guide-grid">
${cards}
          </div>
          <p class="landing__work-more"><a href="/realisations">Voir toutes les réalisations <span aria-hidden="true">→</span></a></p>
        </section>`;
}

export function renderCaseStudy(entry, allEntries) {
  const { seo } = entry;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Réalisations", item: INDEX_URL },
      { "@type": "ListItem", position: 3, name: entry.breadcrumb, item: seo.canonical },
    ],
  };

  const sections = renderSections(entry);

  return `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- Google Analytics (G-FGQXLJR38H) est chargé après consentement, voir /src/modules/consent.js -->

    <meta name="description" content="${seo.description}" />
    <title>${seo.title}</title>

    <!-- Favicon (carré bleu de marque) -->
    <!--#include partials/head-icons.html-->

    <!-- Open Graph (aperçu de partage) -->
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Diurn Studio" />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:url" content="${seo.canonical}" />
    <meta property="og:title" content="${seo.title}" />
    <meta property="og:description" content="${seo.description}" />
    <meta property="og:image" content="${seo.ogImage}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${entry.hero.alt}" />

    <!-- Twitter / X -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${seo.title}" />
    <meta name="twitter:description" content="${seo.description}" />
    <meta name="twitter:image" content="${seo.ogImage}" />

    <link rel="canonical" href="${seo.canonical}" />

    <!-- Données structurées : fil d'Ariane -->
    <script type="application/ld+json">
${JSON.stringify(breadcrumbJsonLd, null, 2)}
    </script>
${renderFaqJsonLd(entry)}
  </head>
  <body>
    <!-- ===================== NAVBAR ===================== -->
    <!--#include partials/nav.html-->

    <!-- ===================== ÉTUDE DE CAS ===================== -->
    <!-- data-nav-light : page claire → la nav passe en encre (comme la section Projets) -->
    <main class="landing case-study-page" data-nav-light>
      <article class="landing__article case-study">
        <a class="case-study__back" href="/realisations">
          <span class="case-study__back-arrow" aria-hidden="true">←</span> Toutes les réalisations
        </a>

        <header class="landing__head">
          <h1 class="landing__title">${entry.h1}</h1>
          <p class="landing__lede">${entry.intro}</p>
        </header>

        <figure class="case-study__hero">
          <img src="${entry.hero.src}" alt="${entry.hero.alt}" width="${entry.hero.width}" height="${entry.hero.height}" fetchpriority="high" />
        </figure>

${renderFacts(entry)}

${sections}

        <section class="landing__section landing__cta case-study__final">
          <h2>${entry.cta.heading}</h2>
          <p>${entry.cta.text}</p>
          <div class="case-study__cta-actions">
            <a class="landing__btn" href="https://calendly.com/diurnstudio/appel-decouvert" target="_blank" rel="noopener" data-calendly>Réserver un appel de 30 min</a>
            <a class="btn-reserve" href="/#contact">Demander un devis</a>
          </div>
          <p class="case-study__back-bottom">
            <a class="case-study__back" href="/realisations">
              <span class="case-study__back-arrow" aria-hidden="true">←</span> Toutes les réalisations
            </a>
          </p>
        </section>

${renderOthers(entry, allEntries)}

        <div class="case-study__fade" aria-hidden="true"></div>
      </article>
    </main>

    <!-- ===================== FOOTER ===================== -->
    <!--#include partials/footer.html-->

    <!-- ===================== OVERLAYS (cookies, mentions légales, modal) ===================== -->
    <!--#include partials/overlays.html-->

    <script type="module" src="/src/main.js"></script>
  </body>
</html>
`;
}

// ------------------------------------------------------------
//  Page index /realisations : liste de toutes les études de cas
// ------------------------------------------------------------
export function renderCaseStudyIndex(allEntries) {
  const title = "Réalisations : sites, logos et identités | Diurn Studio";
  const description =
    "Les réalisations de Diurn Studio à Nice : sites internet sur mesure, logos, identités de marque et affiches pour des clients de la Côte d'Azur.";
  const ogImage = allEntries[0] ? allEntries[0].seo.ogImage : `${SITE}/img/og-cover.png`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Réalisations", item: INDEX_URL },
    ],
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Réalisations Diurn Studio",
    itemListElement: allEntries.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: plainText(e.h1),
      url: e.seo.canonical,
    })),
  };

  const cards = allEntries
    .map(
      (e) => `            <li class="card"><a class="card__btn" href="/realisations/${e.slug}"><span class="card__media"><img src="${e.hero.src}" alt="${e.hero.alt}" loading="lazy" width="${e.hero.width}" height="${e.hero.height}" /><span class="card__overlay"><span class="card__cat">${e.cat || ""}</span><span class="card__title">${e.breadcrumb}</span></span></span></a></li>`
    )
    .join("\n");

  const list = allEntries
    .map(
      (e) => `            <a class="guide-card" href="/realisations/${e.slug}">
              <span class="guide-card__kicker">${e.cat || "Étude de cas"}</span>
              <h3 class="guide-card__title">${e.breadcrumb}</h3>
              <p class="guide-card__desc">${e.intro}</p>
              <span class="guide-card__more">Voir l'étude de cas <span aria-hidden="true">→</span></span>
            </a>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- Google Analytics (G-FGQXLJR38H) est chargé après consentement, voir /src/modules/consent.js -->

    <meta name="description" content="${description}" />
    <title>${title}</title>

    <!-- Favicon (carré bleu de marque) -->
    <!--#include partials/head-icons.html-->

    <!-- Open Graph (aperçu de partage) -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Diurn Studio" />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:url" content="${INDEX_URL}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Réalisations de Diurn Studio" />

    <!-- Twitter / X -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${ogImage}" />

    <link rel="canonical" href="${INDEX_URL}" />

    <!-- Données structurées : fil d'Ariane -->
    <script type="application/ld+json">
${JSON.stringify(breadcrumbJsonLd, null, 2)}
    </script>

    <!-- Données structurées : liste des études de cas -->
    <script type="application/ld+json">
${JSON.stringify(itemListJsonLd, null, 2)}
    </script>
  </head>
  <body>
    <!-- ===================== NAVBAR ===================== -->
    <!--#include partials/nav.html-->

    <!-- ===================== RÉALISATIONS (index des études de cas) ===================== -->
    <main class="landing case-study-page" data-nav-light>
      <article class="landing__article case-study">
        <a class="case-study__back" href="/">
          <span class="case-study__back-arrow" aria-hidden="true">←</span> Accueil
        </a>

        <header class="landing__head">
          <h1 class="landing__title">Réalisations : sites internet, logos et identités de marque</h1>
          <p class="landing__lede">Chaque projet raconte une marque. Voici, en détail, ce que j'ai conçu pour mes clients&nbsp;: le point de départ, ce que j'ai fait et le résultat, du logo au site internet.</p>
        </header>

        <section class="landing__section landing__work" aria-label="Études de cas">
          <ul class="projets__grid">
${cards}
          </ul>
        </section>

        <section class="landing__section case-study__others">
          <h2>Les études de cas en détail</h2>
          <div class="guide-grid">
${list}
          </div>
          <p class="landing__work-more"><a href="/#labo">Voir aussi les projets personnels et de formation <span aria-hidden="true">→</span></a></p>
        </section>

        <section class="landing__section landing__cta case-study__final">
          <h2>Un projet en tête&nbsp;?</h2>
          <p>Site internet, logo ou identité complète&nbsp;: parlons de votre projet lors d'un court appel, ou décrivez-le-moi pour recevoir un devis.</p>
          <div class="case-study__cta-actions">
            <a class="landing__btn" href="https://calendly.com/diurnstudio/appel-decouvert" target="_blank" rel="noopener" data-calendly>Réserver un appel de 30 min</a>
            <a class="btn-reserve" href="/#contact">Demander un devis</a>
          </div>
        </section>

        <div class="case-study__fade" aria-hidden="true"></div>
      </article>
    </main>

    <!-- ===================== FOOTER ===================== -->
    <!--#include partials/footer.html-->

    <!-- ===================== OVERLAYS (cookies, mentions légales, modal) ===================== -->
    <!--#include partials/overlays.html-->

    <script type="module" src="/src/main.js"></script>
  </body>
</html>
`;
}
