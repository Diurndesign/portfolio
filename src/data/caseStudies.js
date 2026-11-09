// ============================================================
//  Études de cas — SOURCE UNIQUE
// ============================================================
// Chaque étude de cas est décrite ici, dans un seul objet. La page
// /realisations/<slug> est GÉNÉRÉE à partir de ces données au build
// (voir src/case-study/generate.js + render.js). Pour AJOUTER UNE ÉTUDE :
// copier un bloc ci-dessous, changer les valeurs, mettre les images dans
// public/img/realisations/<slug>/, puis `git push`. Rien d'autre à toucher
// (la page, l'entrée du sitemap et les liens « autres réalisations » se font
// tout seuls).
//
// Champs d'une entrée :
//   slug        : identifiant d'URL (/realisations/<slug>).
//   lastmod     : date ISO pour le sitemap (AAAA-MM-JJ).
//   seo         : { title, description, ogImage, canonical }.
//   breadcrumb  : libellé de la page dans le fil d'Ariane.
//   h1, intro   : titre principal + accroche.
//   hero        : { src, alt, width, height } (image principale).
//   facts[]     : { label, value } (repères).
//   live        : { url, label } (lien « voir le site en ligne »), optionnel.
//   sections[]  : blocs dans l'ordre d'affichage. type =
//                 "text"    → { heading, paragraphs[] }
//                 "cards"   → { heading, intro?, cards: [{ title, text }] }
//                 "gallery" → { images: [{ src, alt, width, height, full? }] }
//                 "quote"   → { heading, quote, author }
//                 "faq"     → { heading, label, items: [{ q, a }] }
//   cta         : { heading, text } (bloc d'appel final).

export const caseStudies = [
  {
    slug: "gdunan",
    lastmod: "2026-11-10",
    seo: {
      title: "Identité de marque et site internet haut de gamme : GdunaN | Diurn Studio",
      description:
        "Étude de cas : l'identité complète de GdunaN, marque haut de gamme. Monogramme GD, site internet codé sur mesure, carte de visite gaufrée à froid et shooting photo, par un seul interlocuteur.",
      ogImage: "https://www.diurnstudio.fr/img/projets/gd-2.webp",
      canonical: "https://www.diurnstudio.fr/realisations/gdunan",
    },
    breadcrumb: "GdunaN",
    h1: "GdunaN : une identité haut de gamme, du monogramme au site internet",
    intro:
      "GdunaN est une marque haut de gamme où la matière et le geste priment. J'ai conçu toute son image : le logo, le site internet, la carte de visite et les photos.",
    hero: {
      src: "/img/projets/gd-2.webp",
      alt: "Site internet GdunaN présenté sur un ordinateur portable",
      width: 1000,
      height: 1000,
    },
    facts: [
      { label: "Client", value: "GdunaN" },
      { label: "Secteur", value: "Marque haut de gamme" },
      { label: "Prestations", value: "Logo · Site internet · Carte gaufrée · Shooting photo" },
      { label: "Supports", value: "Web et print" },
    ],
    sections: [
      {
        type: "text",
        heading: "Le point de départ",
        paragraphs: [
          "GdunaN met en avant la matière et le travail de la main. La marque avait besoin d'une image à la hauteur de ce positionnement, cohérente partout où elle apparaît : à l'écran comme sur le papier.",
          "L'objectif : une identité épurée, qui laisse la place à la matière au lieu de la couvrir d'effets.",
        ],
      },
      {
        type: "cards",
        heading: "Ce que j'ai fait",
        intro: "Tout le projet a été mené par la même personne, du premier croquis du logo à la mise en ligne du site.",
        cards: [
          {
            title: "Un monogramme « GD » épuré.",
            text: "Deux lettres réduites à l'essentiel, assez simples pour être lisibles en petit sur un écran de téléphone et assez fortes pour tenir seules sur un support imprimé.",
          },
          {
            title: "Un site internet codé sur mesure.",
            text: "J'ai mené la conception et la direction artistique du site, puis son développement. Il est aussi soigné sur mobile que sur ordinateur.",
          },
          {
            title: "Une carte de visite gaufrée à froid.",
            text: "Le monogramme est imprimé en relief, sans encre : on le voit à la lumière et on le sent sous les doigts. La carte parle de matière avant même d'être lue.",
          },
          {
            title: "Un shooting photo dédié.",
            text: "Des images sombres et texturées, prises au plus près du travail de la matière, utilisées sur le site et dans la communication de la marque.",
          },
        ],
      },
      {
        type: "gallery",
        images: [
          { src: "/img/projets/gd-1.webp", alt: "Composition de marque GdunaN avec le monogramme GD", width: 1000, height: 1250 },
          { src: "/img/projets/gd-5.webp", alt: "Macro du travail de la matière, shooting photo GdunaN", width: 1000, height: 1250 },
          { src: "/img/projets/gd-3.webp", alt: "Site internet GdunaN affiché sur mobile", width: 1000, height: 563, full: true },
          { src: "/img/projets/gd-4.webp", alt: "Carte de visite gaufrée à froid avec le monogramme GD", width: 1000, height: 1000 },
          { src: "/img/projets/gd-2.webp", alt: "Site internet GdunaN sur ordinateur portable", width: 1000, height: 1000 },
        ],
      },
      {
        type: "text",
        heading: "Le résultat",
        paragraphs: [
          "Une identité globale, déclinée du site à la papeterie, où chaque support raconte la même histoire. Les visuels sombres et texturés mettent la matière en lumière, et le monogramme relie l'ensemble.",
          "C'est l'intérêt de confier l'identité et le site à la même personne : rien ne se perd entre le graphiste et le développeur, parce qu'il n'y en a qu'un.",
        ],
      },
    ],
    cta: {
      heading: "Votre marque mérite la même cohérence ?",
      text: "Logo, site internet et supports imprimés : je les conçois ensemble, pour qu'ils parlent d'une seule voix. Parlons de votre projet lors d'un court appel.",
    },
  },
  {
    slug: "ewa-flr",
    lastmod: "2026-11-10",
    seo: {
      title: "Identité de marque pour une cheffe : Ewa FLR | Diurn Studio",
      description:
        "Étude de cas : l'identité de marque d'Ewa FLR, cheffe. Logotype vertical, une couleur unique, le bleu béton, et une charte déclinée sur la papeterie, les cartes de visite et le tablier.",
      ogImage: "https://www.diurnstudio.fr/img/projets/ewa-5.webp",
      canonical: "https://www.diurnstudio.fr/realisations/ewa-flr",
    },
    breadcrumb: "Ewa FLR",
    h1: "Ewa FLR : l'identité de marque d'une cheffe",
    intro:
      "Ewa FLR est cheffe. J'ai créé son identité de marque : un univers minimal et végétal, un logotype tout en finesse et une seule couleur, le bleu béton.",
    hero: {
      src: "/img/projets/ewa-5.webp",
      alt: "Univers de marque Ewa FLR : tote bag, menu et légumes de saison",
      width: 1000,
      height: 666,
    },
    facts: [
      { label: "Client", value: "Ewa FLR" },
      { label: "Secteur", value: "Cheffe, cuisine" },
      { label: "Prestations", value: "Logo · Charte graphique · Papeterie · Direction artistique" },
      { label: "Supports", value: "Cartes de visite, menu, tablier, tote bag" },
    ],
    sections: [
      {
        type: "text",
        heading: "Le point de départ",
        paragraphs: [
          "Une cheffe se fait connaître par sa cuisine. Son image doit l'accompagner sans lui voler la vedette : sur un menu, un tablier ou une carte de visite, elle doit rester discrète et reconnaissable.",
          "Ewa voulait une image de marque sobre et éditoriale, au service de ce qu'elle met dans l'assiette.",
        ],
      },
      {
        type: "cards",
        heading: "Ce que j'ai fait",
        cards: [
          {
            title: "Un logotype vertical tout en finesse.",
            text: "Dessiné en Modenica Light, il se lit de haut en bas, comme une signature posée sur le côté d'un menu ou d'un tablier.",
          },
          {
            title: "Une seule couleur : le bleu béton.",
            text: "Un bleu grisé et minéral, qui se marie aux couleurs des produits frais au lieu de rivaliser avec elles. Une couleur unique rend aussi la marque simple à décliner.",
          },
          {
            title: "Un univers minimal et végétal.",
            text: "Beaucoup d'espace, peu d'éléments, et les légumes de saison en guise de décor : l'identité laisse parler les produits.",
          },
          {
            title: "Une charte déclinée sur tous les supports.",
            text: "Cartes de visite recto-verso, menu, tablier et tote bag : chaque support reprend les mêmes règles, pour une image cohérente du premier contact jusqu'au service.",
          },
        ],
      },
      {
        type: "gallery",
        images: [
          { src: "/img/projets/ewa-1.webp", alt: "La cheffe Ewa avec une cagette de légumes", width: 1000, height: 1250 },
          { src: "/img/projets/ewa-4.webp", alt: "Planche d'identité Ewa FLR : couleur, mise en situation et typographie", width: 1000, height: 1414 },
          { src: "/img/projets/ewa-2.webp", alt: "Cartes de visite recto-verso Ewa FLR", width: 1000, height: 750, full: true },
          { src: "/img/projets/ewa-3.webp", alt: "Tablier bleu béton brodé du logo Ewa FLR", width: 1000, height: 667, full: true },
        ],
      },
      {
        type: "text",
        heading: "Le résultat",
        paragraphs: [
          "Une charte complète et facile à appliquer : une typographie, une couleur, des règles claires. Ewa peut faire imprimer un nouveau menu ou un nouveau support sans repartir de zéro.",
          "Une identité pensée de cette façon se prolonge naturellement sur un site internet, quand le moment est venu.",
        ],
      },
    ],
    cta: {
      heading: "Restaurant, traiteur ou chef à domicile ?",
      text: "Je crée des identités qui tiennent sur un menu comme sur un écran de téléphone, et le site qui va avec. Parlons de votre projet lors d'un court appel.",
    },
  },
  {
    slug: "elo-ab",
    lastmod: "2026-11-10",
    seo: {
      title: "Logo et refonte d'identité pour une couturière : Elo Ab | Diurn Studio",
      description:
        "Étude de cas : la refonte de l'identité d'Elo Ab, couturière. Un logotype tout en rondeurs où l'aiguille et le fil s'invitent dans les lettres, décliné jusqu'au ruban gansé griffé.",
      ogImage: "https://www.diurnstudio.fr/img/projets/elo-2.webp",
      canonical: "https://www.diurnstudio.fr/realisations/elo-ab",
    },
    breadcrumb: "Elo Ab",
    h1: "Elo Ab : la refonte du logo d'une couturière",
    intro:
      "Elo Ab est couturière. J'ai refondu son identité autour d'un logotype tout en rondeurs où l'aiguille et le fil se glissent dans les lettres.",
    hero: {
      src: "/img/projets/elo-2.webp",
      alt: "Logo Elo posé sur du marbre avec un ruban gansé griffé",
      width: 1000,
      height: 770,
    },
    facts: [
      { label: "Client", value: "Elo Ab" },
      { label: "Secteur", value: "Couture" },
      { label: "Prestations", value: "Refonte de logo · Direction artistique" },
      { label: "Supports", value: "Logo, ruban gansé griffé" },
    ],
    sections: [
      {
        type: "text",
        heading: "Le point de départ",
        paragraphs: [
          "Elo avait déjà une identité, mais elle ne racontait pas son métier. Pour une couturière, le logo doit dire d'un coup d'œil ce qu'elle fait, avec la même délicatesse que son travail.",
          "L'objectif : une image à la fois artisanale et raffinée, qui parle directement de couture.",
        ],
      },
      {
        type: "cards",
        heading: "Ce que j'ai fait",
        cards: [
          {
            title: "Un logotype tout en rondeurs.",
            text: "Des lettres souples et arrondies, qui évoquent le tissu et le geste de la main plutôt que la rigueur d'un caractère standard.",
          },
          {
            title: "L'aiguille et le fil dans les lettres.",
            text: "Les outils du métier sont intégrés au dessin des lettres : le logo raconte la couture sans avoir besoin d'une illustration à côté.",
          },
          {
            title: "Une palette douce de crème et de noir.",
            text: "Deux couleurs seulement, qui donnent un ton élégant et restent faciles à imprimer sur une étiquette, un sac ou une carte.",
          },
          {
            title: "Un ruban gansé griffé « Elo ».",
            text: "Le logo passe du papier au textile : un ruban à coudre sur les créations, comme la griffe d'une maison de couture.",
          },
        ],
      },
      {
        type: "gallery",
        images: [
          { src: "/img/projets/elo-1.webp", alt: "Logotype Elo Ab avec l'aiguille et le fil intégrés aux lettres", width: 1000, height: 770, full: true },
          { src: "/img/projets/elo-3.webp", alt: "Composition florale avec le logo Elo Ab", width: 1000, height: 1254 },
        ],
      },
      {
        type: "text",
        heading: "Le résultat",
        paragraphs: [
          "Une marque qui se décline avec délicatesse, entre compositions florales et matières textiles. Le logo fonctionne aussi bien sur un écran que cousu sur un vêtement.",
          "Une refonte réussie ne repart pas de rien : elle garde ce qui fait l'identité d'une personne et le rend enfin lisible.",
        ],
      },
    ],
    cta: {
      heading: "Votre logo ne raconte pas votre métier ?",
      text: "Création ou refonte, je dessine des identités qui disent tout de suite ce que vous faites, et je les décline sur vos supports et votre site. Parlons-en lors d'un court appel.",
    },
  },
];
