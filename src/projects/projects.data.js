// ============================================================
//  Données des projets — source unique de la grille filtrable
// ============================================================
// Chaque projet porte un ou plusieurs `tags` qui alimentent les filtres.
// GdunaN appartient à deux familles (site + identité) : c'est justement ce
// que le filtrage multi-catégories permet de montrer.
//
// `kind: "modal"` ouvre la fiche projet (#detail-<id> dans le HTML statique).
// `kind: "link"`  renvoie vers une section de la page (Murmure, plus bas).

export const filters = [
  { id: "all", label: "Tout" },
  { id: "web", label: "Sites web" },
  { id: "identite", label: "Identité & logo" },
  { id: "edition", label: "Édition & affiche" },
];

export const projects = [
  {
    id: "beautycorner",
    kind: "modal",
    title: "Beauty Corner",
    cat: "Site internet",
    tags: ["web"],
    img: {
      src: "/img/projets/bcorner-mockup.webp",
      alt: "Aperçu du site The Beauty Corner by Alex, institut de beauté à Nice, sur ordinateur et mobile",
      width: 1080,
      height: 1080,
    },
  },
  {
    id: "gdunan",
    kind: "modal",
    title: "GdunaN",
    cat: "Identité · Site web",
    tags: ["web", "identite"],
    img: {
      src: "/img/projets/gd-2.webp",
      alt: "Site internet Gdunan présenté sur un ordinateur portable",
      width: 1080,
      height: 1080,
    },
  },
  {
    id: "azureco",
    kind: "modal",
    title: "Azur Eco",
    cat: "Logo · Mascotte",
    tags: ["identite"],
    img: {
      src: "/img/projets/az-5.webp",
      alt: "Emblème du Pressing Azur Eco",
      width: 500,
      height: 500,
    },
  },
  {
    id: "murmure",
    kind: "link",
    href: "#murmure",
    ariaLabel: "Murmure, voir l'application (section dédiée plus bas)",
    title: "Murmure",
    cat: "Application web · React",
    tags: ["web"],
    img: {
      src: "/img/projets/murmure-app.webp",
      alt: "L'application Murmure ouverte sur un téléphone",
      width: 703,
      height: 509,
    },
  },
  {
    id: "tijm",
    kind: "modal",
    title: "TijM",
    cat: "Affiche & édition",
    tags: ["edition"],
    img: {
      src: "/img/projets/tijm-4.webp",
      alt: "Combat de judo en noir et blanc, Tournoi International de Judo de Monaco",
      width: 1600,
      height: 1065,
    },
  },
  {
    id: "elo",
    kind: "modal",
    title: "Elo Ab",
    cat: "Refonte · Couture",
    tags: ["identite"],
    img: {
      src: "/img/projets/elo-2.webp",
      alt: "Logo Elo posé sur du marbre avec un ruban gansé griffé",
      width: 1184,
      height: 912,
    },
  },
  {
    id: "ewaflr",
    kind: "modal",
    title: "Ewa FLR",
    cat: "Identité de marque",
    tags: ["identite"],
    img: {
      src: "/img/projets/ewa-5.webp",
      alt: "Univers de marque Ewa FLR : tote bag, menu et légumes de saison",
      width: 1264,
      height: 842,
    },
  },
  {
    id: "longwy",
    kind: "modal",
    title: "Longwy",
    cat: "Refonte de logo",
    tags: ["identite"],
    img: {
      src: "/img/projets/lw-2.webp",
      alt: "Arts de la table aux couleurs d'Esprit de Longwy",
      width: 1024,
      height: 878,
    },
  },
  {
    id: "freakshow",
    kind: "modal",
    title: "Freakshow",
    cat: "Édition · Direction artistique",
    tags: ["edition"],
    img: {
      src: "/img/projets/freakshow1.webp",
      alt: "Le livre Freakshow tenu en main, page Fred Wilson avec dorure rouge",
      width: 1600,
      height: 1067,
    },
  },
];
