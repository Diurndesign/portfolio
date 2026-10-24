// ============================================================
//  Données des projets — SOURCE UNIQUE
// ============================================================
// Tout un projet (carte de la grille + fiche de la modale) est décrit ici,
// dans un seul objet. Pour AJOUTER UN PROJET : copie un bloc ci-dessous,
// change les valeurs, mets les images dans public/img/projets/, puis
// `git push`. Rien d'autre à toucher (la modale est générée depuis ces data).
//
// Champs d'une carte : id, kind, title, cat, tags, img.
//   - tags  : catégories de filtre (voir `filters` plus bas).
//   - kind "modal" → ouvre la fiche `detail` ci-dessous.
//   - kind "link"  → renvoie vers une section de la page (ex. Murmure).
//
// Champs d'une fiche `detail` (projets "modal") :
//   - bg      : couleur de fond de la modale.
//   - cat     : (optionnel) titre de catégorie dans la fiche, sinon reprend `cat`.
//   - stack   : étiquettes techniques affichées en haut de la fiche.
//   - body    : paragraphes (le HTML <strong> est autorisé).
//   - links   : (optionnel) boutons (démo, GitHub, site en ligne…).
//   - gallery : { screens, images[] }. screens:true = rendu "captures encadrées".

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
    // Sur l'accueil, la carte mène à l'étude de cas (les deep-links
    // #projet-beautycorner des pages locales ouvrent toujours la fiche modale).
    cardHref: "/realisations/beauty-corner",
    cardAriaLabel: "The Beauty Corner, voir l'étude de cas",
    title: "Beauty Corner",
    cat: "Site internet",
    tags: ["web"],
    img: {
      src: "/img/projets/bcorner-mockup.webp",
      alt: "Aperçu du site The Beauty Corner by Alex, institut de beauté à Nice, sur ordinateur et mobile",
      width: 1080,
      height: 1080,
    },
    detail: {
      bg: "#efe8df",
      cat: "Site internet · Sur mesure",
      stack: ["Design web", "Développement", "Espace admin", "Supabase", "SEO local"],
      body: [
        "The Beauty Corner by Alex est un institut de beauté niçois où la dermopigmentation, le soin des ongles et les soirées beauté entre amies se vivent comme des moments d'exception. À partir du logo existant de la marque, la mise en page et l'univers du site prolongent cette douceur : une atmosphère naturelle et sensorielle, des appels à l'action clairs, l'Instagram de la cliente et un espace contact intégrés.",
        "Le cœur du projet est un espace d'administration sur mesure : la cliente ajoute et modifie ses photos elle-même, hébergées sur Supabase, pour montrer l'évolution de son travail au fil des années en toute autonomie. Un site codé main, responsive et facile à maintenir, avec la réservation en ligne via Planity et un référencement local soigné à Nice.",
      ],
      links: [{ href: "https://thebeautycornerbyalex.fr", label: "Voir le site en ligne" }],
      gallery: {
        screens: false,
        images: [
          { src: "/img/projets/bcorner-mockup.webp", alt: "Le site The Beauty Corner by Alex présenté sur ordinateur et mobile", width: 1080, height: 1080 },
          { src: "/img/projets/bcorner-2.webp", alt: "Section des prestations de l'institut, soirée beauté entre amies", width: 1543, height: 753 },
        ],
      },
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
    detail: {
      bg: "#f0efe8",
      stack: ["Logo", "Site web", "Carte gaufrée", "Shooting photo"],
      body: [
        "Identité globale de Gdunan : un monogramme « GD » épuré, pensé pour une marque haut de gamme où la matière et le geste priment. Le logo se décline du web au print, jusqu'à une carte de visite gaufrée à froid, sans encre.",
        "Le projet couvre la création du logo, la conception et la direction artistique du site internet, ainsi qu'un shooting photo dédié à son travail : des visuels sombres et texturés qui mettent la matière en lumière.",
      ],
      gallery: {
        screens: false,
        images: [
          { src: "/img/projets/gd-1.webp", alt: "Composition de marque Gdunan avec le monogramme GD", width: 1080, height: 1350 },
          { src: "/img/projets/gd-2.webp", alt: "Site internet Gdunan sur ordinateur portable", width: 1080, height: 1080 },
          { src: "/img/projets/gd-3.webp", alt: "Site internet Gdunan sur mobile", width: 1600, height: 900 },
          { src: "/img/projets/gd-4.webp", alt: "Carte de visite gaufrée avec le monogramme GD", width: 1080, height: 1080 },
          { src: "/img/projets/gd-5.webp", alt: "Macro du travail de la matière, shooting", width: 1080, height: 1350 },
        ],
      },
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
    detail: {
      bg: "#eef0ea",
      stack: ["Logo", "Mascotte", "Recherche typo", "Étiquette"],
      body: [
        "Création du logo de Pressing Azur Eco dans un univers de mascotte rétro : le style « rubber hose » des années 30. Un personnage-boîte joyeux, chapeau et nœud papillon, qui incarne le pressing avec malice.",
        "Le projet comprend une recherche typographique (un alphabet display sur mesure), la création du personnage et sa mise en situation, notamment sur l'étiquette. Palette sauge, bleu nuit et crème.",
      ],
      gallery: {
        screens: false,
        images: [
          { src: "/img/projets/az-1.webp", alt: "La mascotte Azur Eco", width: 1024, height: 1024 },
          { src: "/img/projets/az-2.webp", alt: "Logo complet Pressing Azur Eco", width: 500, height: 500 },
          { src: "/img/projets/az-5.webp", alt: "Emblème Azur Eco", width: 500, height: 500 },
          { src: "/img/projets/az-3.webp", alt: "Planche : recherche typo, couleurs et déclinaisons", width: 1080, height: 1350 },
          { src: "/img/projets/az-4.webp", alt: "Mise en situation du logo sur une étiquette", width: 1080, height: 1350 },
        ],
      },
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
    detail: {
      bg: "#efe7d7",
      title: "TijM 2017",
      stack: ["Affiche", "Mise en page", "Magazine", "Direction artistique"],
      body: [
        "Identité visuelle du 24<sup>e</sup> Tournoi International de Judo de Monaco (Trophée Gérard Bertrand, 2017). Une affiche pensée pour tenir aussi bien sur un panneau urbain de la Principauté que dans le hall du Stade Louis II.",
        "Au-delà de l'affiche : la conception et la mise en page du magazine officiel du tournoi : doubles pages, hiérarchie typographique et intégration des photographies de combat, jusqu'au bon à tirer.",
      ],
      gallery: {
        screens: false,
        images: [
          { src: "/img/projets/tijm-affiche.webp", alt: "Affiche à plat du 24e Tournoi International de Judo de Monaco", width: 1300, height: 1839 },
          { src: "/img/projets/tijm-1.webp", alt: "Affiche TijM sur un panneau urbain à Monaco", width: 864, height: 1222 },
          { src: "/img/projets/tijm-3.webp", alt: "Double page du magazine officiel du tournoi", width: 1600, height: 1600 },
          { src: "/img/projets/tijm-4.webp", alt: "Photographie de combat de judo en noir et blanc", width: 1600, height: 1065 },
        ],
      },
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
    detail: {
      bg: "#f2efe8",
      stack: ["Logo", "Refonte", "Couture", "Direction artistique"],
      body: [
        "Refonte de l'identité d'Elo Ab, couturière. Un logotype tout en rondeurs où l'aiguille et le fil s'invitent dans les lettres (un clin d'œil direct à son métier) posé sur une palette douce de crème et de noir.",
        "La marque se décline avec délicatesse : ruban gansé griffé « Elo », compositions florales et matières textiles, pour une image à la fois artisanale et raffinée.",
      ],
      gallery: {
        screens: false,
        images: [
          { src: "/img/projets/elo-1.webp", alt: "Logotype Elo Ab avec l'aiguille et le fil dans les lettres", width: 1006, height: 775 },
          { src: "/img/projets/elo-2.webp", alt: "Logo Elo sur marbre avec un ruban gansé griffé", width: 1184, height: 912 },
          { src: "/img/projets/elo-3.webp", alt: "Composition florale avec le logo Elo Ab", width: 1062, height: 1332 },
        ],
      },
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
    detail: {
      bg: "#e7e7e6",
      stack: ["Logo", "Charte graphique", "Papeterie", "Direction artistique"],
      body: [
        "Identité de marque pour Ewa FLR, cheffe. Un univers minimal et végétal, structuré autour d'un logotype vertical tout en finesse (Modenica light) et d'une couleur unique, le « bleu béton ».",
        "La charte se décline sur l'ensemble des supports (papeterie, carte de visite, tablier) pour une image de marque sobre et éditoriale, au service de sa cuisine.",
      ],
      gallery: {
        screens: false,
        images: [
          { src: "/img/projets/ewa-5.webp", alt: "Univers de marque Ewa FLR : tote bag, menu et légumes de saison", width: 1264, height: 842 },
          { src: "/img/projets/ewa-1.webp", alt: "Image de situation : la cheffe Ewa avec une cagette de légumes", width: 1080, height: 1350 },
          { src: "/img/projets/ewa-2.webp", alt: "Cartes de visite recto-verso", width: 1600, height: 1200 },
          { src: "/img/projets/ewa-3.webp", alt: "Tablier bleu béton avec le logo", width: 1600, height: 1067 },
          { src: "/img/projets/ewa-4.webp", alt: "Planche d'identité : couleur, situation et typographie", width: 1600, height: 2263 },
        ],
      },
    },
  },
  {
    id: "sophiebluel",
    kind: "modal",
    title: "Portfolio d'architecte",
    cat: "Site dynamique · JavaScript",
    tags: ["web"],
    img: {
      src: "/img/projets/sophie-bluel.jpg",
      alt: "Portfolio d'architecte : galerie de projets filtrable, développée en JavaScript",
      width: 1280,
      height: 960,
    },
    detail: {
      bg: "#eef0ea",
      stack: ["JavaScript ES6", "API REST", "DOM", "Authentification", "localStorage"],
      body: [
        "Le site d'une architecte d'intérieur, avec deux facettes : une galerie publique qui met en valeur ses réalisations, et un espace privé où elle gère elle-même son contenu.",
        "Côté visiteurs : une galerie que l'on peut filtrer par catégorie, pour retrouver rapidement le type de projet recherché.",
        "Côté administratrice : une fois connectée, elle ajoute ou supprime ses projets en toute autonomie, directement depuis le site, sans avoir besoin d'un développeur.",
        "J'ai particulièrement soigné la fiabilité : vérification des images envoyées, aperçu avant publication et messages clairs en cas de souci.",
      ],
      links: [
        { href: "https://sophiebluel-ten.vercel.app/", label: "Voir la démo" },
        { href: "https://github.com/Diurndesign/Sophie_Bluel", label: "Voir le code sur GitHub" },
      ],
      gallery: {
        screens: true,
        images: [
          { src: "/img/projets/sophiebluel-galerie.png", alt: "Portfolio d'architecte : galerie publique filtrable par catégorie", width: 1440, height: 950 },
          { src: "/img/projets/sophiebluel-admin.png", alt: "Portfolio d'architecte : mode édition après connexion", width: 1440, height: 950 },
          { src: "/img/projets/sophiebluel-modal.png", alt: "Portfolio d'architecte : fenêtre modale d'administration avec ajout et suppression de projets", width: 1440, height: 950 },
          { src: "/img/projets/sophiebluel-login.png", alt: "Portfolio d'architecte : page de connexion de l'administration", width: 1440, height: 900 },
        ],
      },
    },
  },
  {
    id: "kasa",
    kind: "modal",
    title: "Kasa",
    cat: "Application web · React",
    tags: ["web"],
    img: {
      src: "/img/projets/kasa.jpg",
      alt: "Application Kasa : page d'accueil avec bannière et grille de logements, développée en React",
      width: 1280,
      height: 960,
    },
    detail: {
      bg: "#f2e9e6",
      stack: ["React 19", "React Router 7", "Sass", "Vite", "API REST"],
      body: [
        "Kasa est une plateforme de location de logements entre particuliers. J'ai conçu et développé l'interface du site : la page d'accueil qui présente tous les logements, et la fiche détaillée de chacun.",
        "L'expérience se veut fluide et agréable : on passe d'un logement à l'autre sans jamais attendre un rechargement de page. Chaque fiche affiche les photos en diaporama, la description, les équipements et la note du logement.",
        "J'ai soigné les détails qui font la différence : un diaporama d'images réalisé sur mesure, des rubriques qui se déplient, une note en étoiles, et une page claire lorsqu'un logement n'existe pas.",
        "Résultat : un site rapide, aussi agréable sur mobile que sur ordinateur, et pensé pour évoluer facilement.",
      ],
      links: [
        { href: "https://kasa-gold-chi.vercel.app/", label: "Voir la démo" },
        { href: "https://github.com/Diurndesign/Kasa", label: "Voir le code sur GitHub" },
      ],
      gallery: {
        screens: true,
        images: [
          { src: "/img/projets/kasa-accueil.png", alt: "Kasa : page d'accueil avec la bannière et la grille de logements", width: 1440, height: 950 },
          { src: "/img/projets/kasa-fiche.png", alt: "Kasa : fiche d'un logement avec carrousel, loueur, note et volets dépliants", width: 1440, height: 1050 },
          { src: "/img/projets/kasa-mobile.png", alt: "Kasa : la page d'accueil en version mobile (responsive)", width: 390, height: 820 },
          { src: "/img/projets/kasa-fiche-2.png", alt: "Kasa : fiche d'un autre logement", width: 1440, height: 1050 },
        ],
      },
    },
  },
  {
    id: "murmure",
    kind: "modal",
    desc: "Une question anonyme par jour, conçue et développée seul.",
    title: "Murmure",
    cat: "Application web · React",
    tags: ["web"],
    img: {
      src: "/img/projets/murmure-app.webp",
      alt: "L'application Murmure ouverte sur un téléphone",
      width: 703,
      height: 509,
    },
    detail: {
      bg: "#e7e8f0",
      cat: "Application web · React",
      stack: ["React 18", "Vite", "Supabase", "Vercel"],
      body: [
        "Murmure est une application web que j'ai conçue et développée seul, du design de l'interface à la base de données et la mise en ligne.",
        "Le principe : une seule question anonyme par jour, la même pour tous. Pas de compte, pas de « like », pas de fil infini : une application volontairement calme, à rebours des réseaux sociaux.",
        "C'est aussi mon terrain d'expérimentation technique : React pour l'interface, Supabase pour les données, et l'IA utilisée comme accélérateur de développement, sans jamais lui laisser le volant.",
      ],
      // Démo jouable directement dans la modale (iframe chargée à l'ouverture)
      // + QR code pour tester sur mobile.
      demo: {
        url: "https://murmure-orpin.vercel.app/",
        title: "Murmure — l'application en direct",
      },
      qr: {
        src: "/img/murmure-qr.png",
        label: "Scanne pour tester Murmure sur ton mobile.",
      },
      links: [
        { href: "https://murmure-orpin.vercel.app/", label: "Ouvrir en plein écran" },
        { href: "https://github.com/Diurndesign/Murmure", label: "Voir le code sur GitHub" },
      ],
    },
  },
];
