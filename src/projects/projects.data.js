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
      cat: "Projet de formation · JavaScript",
      tagline: "Une galerie publique, un espace d'administration privé : une architecte qui met à jour son site sans développeur.",
      tech: ["html", "css", "javascript", "jwt"],
      sections: [
        { heading: "Contexte", text: "Sophie Bluel, architecte d'intérieur, veut un site qui présente ses réalisations et qu'elle puisse mettre à jour elle-même. L'API étant fournie, ma mission était de développer tout le front-end." },
        { heading: "Objectifs", text: "Générer la galerie depuis l'API et la filtrer par catégorie, puis créer une page de connexion et une fenêtre d'administration pour ajouter ou supprimer des projets, sans recharger la page." },
        { heading: "Stack technique", text: "HTML et CSS pour la structure et la mise en page, JavaScript sans framework pour toute la logique, une API REST et une authentification par jeton JWT conservé dans le navigateur." },
        { heading: "Compétences développées", text: "Dialoguer avec une API (lecture, envoi de fichier, suppression protégée), manipuler le DOM, et sécuriser l'ajout d'image : vérification du format et du poids, aperçu avant publication, messages d'erreur clairs." },
        { heading: "Résultats et impact", text: "Un site entièrement piloté par les données, avec un parcours d'administration complet, en ligne et documenté sur GitHub." },
        { heading: "Perspectives d'amélioration", text: "Gérer l'expiration du jeton de connexion, découper le code en modules ES et rendre la fenêtre d'administration entièrement navigable au clavier." },
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
      cat: "Projet de formation · React",
      tagline: "Trouver son logement entre particuliers, d'une page à l'autre sans un seul rechargement.",
      tech: ["react", "reactrouter", "sass", "vite"],
      sections: [
        { heading: "Contexte", text: "Kasa, plateforme de location de logements entre particuliers, refait son site en React. Ma mission : développer toute l'interface à partir des maquettes et des données des logements." },
        { heading: "Objectifs", text: "Afficher la liste des logements puis la fiche détaillée de chacun, avec une navigation fluide, une page d'erreur pour les adresses inconnues et un rendu fidèle aux maquettes sur mobile comme sur ordinateur." },
        { heading: "Stack technique", text: "React 19 et React Router 7 pour l'interface et la navigation, Sass pour les styles, Vite pour le build ; les données des logements sont lues depuis un fichier JSON." },
        { heading: "Compétences développées", text: "Découper une interface en composants réutilisables (carrousel d'images, volets dépliants, note en étoiles), gérer leur état, et mettre en place un routage dynamique qui redirige vers la page d'erreur quand un logement n'existe pas." },
        { heading: "Résultats et impact", text: "Une application complète et responsive, déployée en ligne, avec un code source documenté sur GitHub." },
        { heading: "Perspectives d'amélioration", text: "Brancher l'application sur l'API back-end à la place du fichier JSON, ajouter des tests automatisés sur les composants et rendre le carrousel pilotable au clavier." },
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
      cat: "Projet personnel · React + Supabase",
      tagline: "Une question par jour. Des réponses d'inconnus. Rien d'autre.",
      tech: ["react", "vite", "supabase", "vercel"],
      sections: [
        { heading: "Contexte", text: "Un projet personnel né d'un constat : les réseaux sociaux mettent l'individu au centre, au lieu du sujet. Je l'ai conçu et développé seul, du design de l'interface à la base de données et à la mise en ligne." },
        { heading: "Objectifs", text: "Créer un rituel quotidien court et anonyme : une seule question par jour, la même pour tous, sans compte, sans « like », sans fil infini, et sans collecter de données personnelles." },
        { heading: "Stack technique", text: "React 18 et Vite pour l'interface, Supabase (base PostgreSQL hébergée en Europe) pour les réponses, Vercel pour le déploiement." },
        { heading: "Compétences développées", text: "Concevoir un produit de A à Z avec un vrai back-end : modèle de données, limite d'une réponse par jour vérifiée côté navigateur et côté serveur, signalement avec suppression immédiate, question disponible hors ligne. L'IA m'a servi d'accélérateur, chaque ligne relue et comprise." },
        { heading: "Résultats et impact", text: "Une application en ligne et jouable ci-dessous, avec 400 questions en rotation, un mode sombre automatique, une page de confidentialité et des numéros d'écoute accessibles depuis l'app." },
        { heading: "Perspectives d'amélioration", text: "La rendre installable (PWA), puis en faire une application mobile native, avec un tableau de bord de modération et un rappel quotidien optionnel." },
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
