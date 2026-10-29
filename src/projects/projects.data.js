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
      src: "/img/projets/alu/beautycorner.webp",
      alt: "Aperçu du site The Beauty Corner by Alex, institut de beauté à Nice, sur ordinateur et mobile",
      width: 640,
      height: 800,
    },
    detail: {
      cat: "Site internet · Sur mesure",
      stack: ["Design web", "Développement", "Espace admin", "Supabase", "SEO local"],
      sections: [
        { heading: "Contexte", text: "Alexandra, esthéticienne depuis 20 ans et spécialiste de la dermopigmentation des sourcils, tient un institut à Nice. Ses clientes la découvraient sur Instagram et réservaient sur Planity, mais il lui manquait un site à elle." },
        { heading: "Objectifs", text: "Un site qui lui ressemble, qui rassure avant une prestation comme la dermopigmentation, qu'elle puisse mettre à jour seule, et qui l'aide à être mieux trouvée sur Google." },
        { heading: "Ce que j'ai réalisé", text: "Un site codé sur mesure à partir de son logo, des avant/après interactifs, la réservation reliée à Planity, ses avis Google mis en avant, et un espace d'administration sur Supabase pour gérer ses photos en toute autonomie." },
        { heading: "Résultat", text: "Livré en deux semaines, le site est à son nom. L'institut est mieux positionné sur Google, et de nouvelles clientes sont venues grâce au site." },
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
      src: "/img/projets/alu/gdunan.webp",
      alt: "Site internet Gdunan présenté sur un ordinateur portable",
      width: 640,
      height: 800,
    },
    detail: {
      stack: ["Logo", "Site web", "Carte gaufrée", "Shooting photo"],
      sections: [
        { heading: "Contexte", text: "Gdunan est une marque haut de gamme où la matière et le geste priment. Le projet couvre toute son image, du logo au site internet." },
        { heading: "Objectifs", text: "Une identité épurée et cohérente sur tous les supports, du web au print, qui met la matière au premier plan." },
        { heading: "Ce que j'ai réalisé", text: "Un monogramme « GD » épuré, la conception et la direction artistique du site internet, une carte de visite gaufrée à froid, sans encre, et un shooting photo dédié à son travail." },
        { heading: "Résultat", text: "Une identité globale déclinée du site à la papeterie, avec des visuels sombres et texturés qui mettent la matière en lumière." },
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
      src: "/img/projets/alu/azureco.webp",
      alt: "Emblème du Pressing Azur Eco",
      width: 640,
      height: 800,
    },
    detail: {
      stack: ["Logo", "Mascotte", "Recherche typo", "Étiquette"],
      sections: [
        { heading: "Contexte", text: "Création du logo de Pressing Azur Eco, dans un univers de mascotte rétro inspiré du style « rubber hose » des années 30." },
        { heading: "Objectifs", text: "Incarner le pressing par un personnage joyeux et mémorable, avec une typographie qui lui soit propre." },
        { heading: "Ce que j'ai réalisé", text: "Une recherche typographique (un alphabet display sur mesure), la création d'un personnage-boîte, chapeau et nœud papillon, et sa mise en situation, notamment sur l'étiquette." },
        { heading: "Résultat", text: "Une mascotte qui incarne le pressing avec malice, dans une palette sauge, bleu nuit et crème." },
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
      src: "/img/projets/alu/tijm.webp",
      alt: "Combat de judo en noir et blanc, Tournoi International de Judo de Monaco",
      width: 640,
      height: 800,
    },
    detail: {
      title: "TijM 2017",
      stack: ["Affiche", "Mise en page", "Magazine", "Direction artistique"],
      sections: [
        { heading: "Contexte", text: "Identité visuelle du 24<sup>e</sup> Tournoi International de Judo de Monaco (Trophée Gérard Bertrand, 2017)." },
        { heading: "Objectifs", text: "Une affiche qui tienne aussi bien sur un panneau urbain de la Principauté que dans le hall du Stade Louis II, et un magazine officiel à la hauteur de l'événement." },
        { heading: "Ce que j'ai réalisé", text: "L'affiche, puis la conception et la mise en page du magazine officiel : doubles pages, hiérarchie typographique et intégration des photographies de combat." },
        { heading: "Résultat", text: "Une identité cohérente de l'affiche au magazine, menée jusqu'au bon à tirer." },
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
      src: "/img/projets/alu/elo.webp",
      alt: "Logo Elo posé sur du marbre avec un ruban gansé griffé",
      width: 640,
      height: 800,
    },
    detail: {
      stack: ["Logo", "Refonte", "Couture", "Direction artistique"],
      sections: [
        { heading: "Contexte", text: "Refonte de l'identité d'Elo Ab, couturière." },
        { heading: "Objectifs", text: "Une image à la fois artisanale et raffinée, qui parle directement de son métier." },
        { heading: "Ce que j'ai réalisé", text: "Un logotype tout en rondeurs où l'aiguille et le fil s'invitent dans les lettres, sur une palette douce de crème et de noir, décliné jusqu'à un ruban gansé griffé « Elo »." },
        { heading: "Résultat", text: "Une marque qui se décline avec délicatesse, entre compositions florales et matières textiles." },
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
      src: "/img/projets/alu/ewaflr.webp",
      alt: "Univers de marque Ewa FLR : tote bag, menu et légumes de saison",
      width: 640,
      height: 800,
    },
    detail: {
      stack: ["Logo", "Charte graphique", "Papeterie", "Direction artistique"],
      sections: [
        { heading: "Contexte", text: "Création de l'identité de marque d'Ewa FLR, cheffe." },
        { heading: "Objectifs", text: "Une image de marque sobre et éditoriale, au service de sa cuisine." },
        { heading: "Ce que j'ai réalisé", text: "Un univers minimal et végétal, structuré autour d'un logotype vertical tout en finesse (Modenica light) et d'une couleur unique, le « bleu béton »." },
        { heading: "Résultat", text: "Une charte déclinée sur l'ensemble des supports : papeterie, carte de visite et tablier." },
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
      src: "/img/projets/alu/sophiebluel.webp",
      alt: "Portfolio d'architecte : galerie de projets filtrable, développée en JavaScript",
      width: 640,
      height: 800,
    },
    detail: {
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
    id: "ninacarducci",
    kind: "modal",
    title: "Nina Carducci",
    cat: "Optimisation SEO · Performance",
    tags: ["web"],
    img: {
      src: "/img/projets/alu/ninacarducci.webp",
      alt: "Site de Nina Carducci : page d'accueil, illustrée ici avec des photos d'architecture",
      width: 640,
      height: 800,
    },
    detail: {
      cat: "Projet de formation · SEO, performance, accessibilité",
      tagline: "Le même site de photographe, 98 % plus léger, mieux référencé et accessible à tous, sans toucher au design.",
      tech: ["html", "css", "javascript", "jquery", "bootstrap", "lighthouse"],
      sections: [
        { heading: "Contexte", text: "Nina Carducci, photographe à Bordeaux, a un site lent et mal référencé. Ma mission : optimiser son référencement, ses performances et son accessibilité, sans modifier le design." },
        { heading: "Objectifs", text: "Obtenir de bons scores aux audits Lighthouse et WAVE, rendre le site éligible aux résultats enrichis de Google et ancrer son référencement local à Bordeaux." },
        { heading: "Stack technique", text: "HTML, CSS et JavaScript avec jQuery et Bootstrap, audités avec Google Lighthouse, l'extension WAVE et le test des résultats enrichis de Google." },
        { heading: "Compétences développées", text: "Diagnostiquer un site avec des outils d'audit, compresser et redimensionner les images (AVIF, WebP), prioriser le chargement (préchargement, scripts différés), écrire des données structurées LocalBusiness et corriger l'accessibilité : balises sémantiques, labels, contrastes et textes alternatifs." },
        { heading: "Résultats et impact", text: "Les images passent de 88 Mo à 1,2 Mo (moins 98 %). Lighthouse donne 97 en performance et 100 en accessibilité, bonnes pratiques et SEO ; WAVE ne relève aucune erreur et le site est éligible aux résultats enrichis de Google." },
        { heading: "Perspectives d'amélioration", text: "Remplacer jQuery et Bootstrap par du CSS et du JavaScript natifs pour alléger encore le site, et suivre son positionnement dans la Google Search Console." },
      ],
      links: [
        { href: "https://diurndesign.github.io/ninacarducci/", label: "Voir le site optimisé" },
        { href: "https://github.com/Diurndesign/ninacarducci", label: "Voir le code sur GitHub" },
      ],
      gallery: {
        screens: true,
        images: [
          { src: "/img/projets/nina-accueil.webp", alt: "Nina Carducci : page d'accueil et son carrousel, illustrés avec des photos d'architecture", width: 1440, height: 900 },
          { src: "/img/projets/nina-galerie.webp", alt: "Nina Carducci : galerie filtrable par catégorie, illustrée avec des intérieurs", width: 1440, height: 900 },
          { src: "/img/projets/nina-mobile.webp", alt: "Nina Carducci : la page d'accueil en version mobile", width: 390, height: 820 },
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
      src: "/img/projets/alu/murmure.webp",
      alt: "L'application Murmure ouverte sur un téléphone",
      width: 640,
      height: 800,
    },
    detail: {
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
