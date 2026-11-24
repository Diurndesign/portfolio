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
//   cat         : catégorie affichée sur la carte de la page /realisations.
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
    cat: "Identité · Site web",
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
    cat: "Identité de marque",
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
    cat: "Refonte · Couture",
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
  // ----------------------------------------------------------------
  // Les trois études ci-dessous ont été rédigées à partir des fiches
  // existantes (src/projects/projects.data.js) et des pages de service.
  // Les passages marqués « À VÉRIFIER » sont des déductions ou des
  // formulations ajoutées : à relire et corriger avant de les considérer
  // comme définitifs.
  // ----------------------------------------------------------------
  {
    slug: "beauty-corner",
    lastmod: "2026-11-24",
    seo: {
      title: "Site internet d'un institut de beauté à Nice : The Beauty Corner | Diurn Studio",
      description:
        "Étude de cas : le site de The Beauty Corner by Alex, institut de beauté à Nice. Site codé sur mesure en deux semaines, avant/après interactifs, réservation Planity, avis Google et espace d'administration.",
      ogImage: "https://www.diurnstudio.fr/img/projets/bcorner-mockup.webp",
      canonical: "https://www.diurnstudio.fr/realisations/beauty-corner",
    },
    breadcrumb: "The Beauty Corner",
    cat: "Site internet",
    h1: "The Beauty Corner : le site sur mesure d'un institut de beauté à Nice",
    intro:
      "Alexandra tient The Beauty Corner, un institut de beauté à Nice. J'ai conçu et codé son site internet : un site à son image, qu'elle met à jour seule et qui l'aide à être trouvée sur Google.",
    hero: {
      src: "/img/projets/bcorner-mockup.webp",
      alt: "Le site The Beauty Corner by Alex présenté sur ordinateur et mobile",
      width: 1080,
      height: 1080,
    },
    facts: [
      { label: "Client", value: "The Beauty Corner by Alex" },
      { label: "Secteur", value: "Institut de beauté, Nice" },
      { label: "Prestations", value: "Design web · Développement · Espace admin · SEO local" },
      { label: "Délai", value: "Deux semaines" },
    ],
    live: { url: "https://thebeautycornerbyalex.fr", label: "Voir le site en ligne" },
    sections: [
      {
        type: "text",
        heading: "Le point de départ",
        paragraphs: [
          "Alexandra est esthéticienne depuis 20 ans et spécialiste de la dermopigmentation des sourcils. Ses clientes la découvraient sur Instagram et réservaient sur Planity, mais il lui manquait un site à elle.",
          // À VÉRIFIER : phrase de reformulation, pas tirée telle quelle de la fiche.
          "Pour une prestation comme la dermopigmentation, une cliente veut être rassurée avant de réserver : voir le travail, lire des avis, comprendre comment se passe le rendez-vous. Le site devait répondre à ces questions.",
        ],
      },
      {
        type: "cards",
        heading: "Ce que j'ai fait",
        intro: "Un site codé sur mesure à partir de son logo, sans template, pensé pour qu'elle reste autonome.",
        cards: [
          {
            // À VÉRIFIER : fonctionnement du comparateur (curseur à faire glisser) supposé.
            title: "Des avant/après interactifs.",
            text: "La cliente fait glisser le curseur pour comparer le résultat d'une prestation : la meilleure preuve du savoir-faire, bien plus parlante qu'un long texte.",
          },
          {
            title: "La réservation reliée à Planity.",
            text: "Alexandra garde son outil de réservation habituel. Le site y envoie directement, sans étape en plus pour la cliente.",
          },
          {
            title: "Ses avis Google mis en avant.",
            text: "Les avis de ses clientes sont affichés sur le site, là où une nouvelle cliente hésite encore.",
          },
          {
            title: "Un espace d'administration sur Supabase.",
            text: "Elle ajoute et change ses photos elle-même, sans passer par un développeur.",
          },
        ],
      },
      {
        type: "gallery",
        images: [
          { src: "/img/projets/bcorner-2.webp", alt: "Section des prestations du site The Beauty Corner, soirée beauté entre amies", width: 1543, height: 753, full: true },
        ],
      },
      {
        type: "text",
        heading: "Le résultat",
        paragraphs: [
          "Le site a été livré en deux semaines. Le site, l'hébergement et le nom de domaine sont au nom d'Alexandra : elle en est propriétaire.",
          "L'institut est mieux positionné sur Google, et de nouvelles clientes sont venues grâce au site.",
        ],
      },
    ],
    cta: {
      heading: "Vous tenez un institut ou un commerce à Nice ?",
      text: "Je crée des sites sur mesure qui rassurent vos futures clientes, se relient à vos outils de réservation et vous aident à être trouvé sur Google. Parlons de votre projet lors d'un court appel.",
    },
  },
  {
    slug: "pressing-azur-eco",
    lastmod: "2026-11-24",
    seo: {
      title: "Logo et mascotte rétro pour un pressing : Pressing Azur Eco | Diurn Studio",
      description:
        "Étude de cas : le logo de Pressing Azur Eco. Une mascotte rétro inspirée du style « rubber hose » des années 30, un alphabet dessiné sur mesure et une palette sauge, bleu nuit et crème.",
      ogImage: "https://www.diurnstudio.fr/img/projets/az-1.webp",
      canonical: "https://www.diurnstudio.fr/realisations/pressing-azur-eco",
    },
    breadcrumb: "Pressing Azur Eco",
    cat: "Logo · Mascotte",
    h1: "Pressing Azur Eco : un logo-mascotte rétro pour un pressing",
    intro:
      "Pour Pressing Azur Eco, j'ai créé un logo porté par une mascotte rétro, dans le style « rubber hose » des dessins animés des années 30, avec un alphabet dessiné sur mesure.",
    hero: {
      src: "/img/projets/az-1.webp",
      alt: "La mascotte du Pressing Azur Eco, personnage-boîte avec chapeau et nœud papillon",
      width: 1000,
      height: 1000,
    },
    facts: [
      { label: "Client", value: "Pressing Azur Eco" },
      { label: "Secteur", value: "Pressing" },
      { label: "Prestations", value: "Logo · Mascotte · Recherche typographique" },
      { label: "Supports", value: "Emblème, étiquette" },
    ],
    sections: [
      {
        type: "text",
        heading: "Le point de départ",
        paragraphs: [
          // À VÉRIFIER : la fiche indique seulement l'objectif (un personnage joyeux et mémorable) ; le contexte du pressing est déduit.
          "Un pressing est un commerce de proximité : on y passe souvent, on le choisit parce qu'on s'en souvient et qu'on lui fait confiance. Azur Eco voulait une image qui sorte du lot, loin des logos impersonnels du secteur.",
          "L'objectif : incarner le pressing par un personnage joyeux et mémorable, avec une typographie qui lui soit propre.",
        ],
      },
      {
        type: "cards",
        heading: "Ce que j'ai fait",
        cards: [
          {
            title: "Une mascotte « rubber hose ».",
            text: "Un personnage-boîte avec chapeau et nœud papillon, aux bras et jambes en tuyau souple, inspiré des dessins animés des années 30. Il donne au pressing un visage et un caractère.",
          },
          {
            title: "Un alphabet display sur mesure.",
            text: "Une recherche typographique pour dessiner des lettres qui vont avec la mascotte, au lieu de poser une police du commerce à côté d'elle.",
          },
          {
            title: "Une palette sauge, bleu nuit et crème.",
            text: "Des couleurs douces et un peu vintage, qui évoquent le propre et le soin du linge sans tomber dans le bleu clinique habituel.",
          },
          {
            title: "Des mises en situation.",
            text: "Le logo a été testé sur ses supports, notamment l'étiquette, pour vérifier qu'il reste lisible et reconnaissable en petit.",
          },
        ],
      },
      {
        type: "gallery",
        images: [
          { src: "/img/projets/az-2.webp", alt: "Logo complet Pressing Azur Eco", width: 500, height: 500 },
          { src: "/img/projets/az-5.webp", alt: "Emblème Azur Eco", width: 500, height: 500 },
          { src: "/img/projets/az-3.webp", alt: "Planche Azur Eco : recherche typographique, couleurs et déclinaisons", width: 1000, height: 1250 },
          { src: "/img/projets/az-4.webp", alt: "Mise en situation du logo Azur Eco sur une étiquette", width: 1000, height: 1250 },
        ],
      },
      {
        type: "text",
        heading: "Le résultat",
        paragraphs: [
          "Une mascotte qui incarne le pressing avec malice, dans une palette sauge, bleu nuit et crème.",
          // À VÉRIFIER : conclusion rédigée pour la page, à confirmer ou adapter.
          "Un personnage se retient bien mieux qu'un simple nom : il donne aux clients une raison de sourire et de se souvenir de l'enseigne.",
        ],
      },
    ],
    cta: {
      heading: "Votre commerce mérite une image qu'on retient ?",
      text: "Logo, mascotte ou identité complète : je dessine des marques qui ont du caractère et je les décline sur vos supports et votre site. Parlons-en lors d'un court appel.",
    },
  },
  {
    slug: "tournoi-judo-monaco",
    lastmod: "2026-11-24",
    seo: {
      title: "Affiche et magazine du Tournoi de Judo de Monaco | Diurn Studio",
      description:
        "Étude de cas : l'identité visuelle du 24e Tournoi International de Judo de Monaco (2017). L'affiche, de l'abribus au Stade Louis II, puis le magazine officiel mis en page jusqu'au bon à tirer.",
      ogImage: "https://www.diurnstudio.fr/img/projets/tijm-4.webp",
      canonical: "https://www.diurnstudio.fr/realisations/tournoi-judo-monaco",
    },
    breadcrumb: "Tournoi International de Judo de Monaco",
    cat: "Affiche & édition",
    h1: "Tournoi International de Judo de Monaco : l'affiche et le magazine officiel",
    intro:
      "Pour la 24e édition du Tournoi International de Judo de Monaco (Trophée Gérard Bertrand, 2017), j'ai conçu l'affiche puis le magazine officiel de l'événement.",
    hero: {
      src: "/img/projets/tijm-4.webp",
      alt: "Combat de judo en noir et blanc, Tournoi International de Judo de Monaco",
      width: 1000,
      height: 666,
    },
    facts: [
      { label: "Événement", value: "24<sup>e</sup> Tournoi International de Judo de Monaco" },
      { label: "Année", value: "2017" },
      { label: "Prestations", value: "Affiche · Mise en page · Magazine · Direction artistique" },
      { label: "Supports", value: "Affichage urbain, magazine officiel" },
    ],
    sections: [
      {
        type: "text",
        heading: "Le point de départ",
        paragraphs: [
          "Un tournoi international se joue aussi dans la rue. L'affiche devait tenir aussi bien sur un panneau urbain de la Principauté que dans le hall du Stade Louis II, et le magazine officiel devait être à la hauteur de l'événement.",
        ],
      },
      {
        type: "cards",
        heading: "Ce que j'ai fait",
        cards: [
          {
            title: "Une affiche lisible de loin.",
            // À VÉRIFIER : description du parti pris graphique déduite des visuels.
            text: "Une image forte et une hiérarchie claire : le nom du tournoi et les dates se lisent en quelques secondes, à pied comme en voiture.",
          },
          {
            title: "Le magazine officiel.",
            text: "La conception et la mise en page complètes : doubles pages, hiérarchie typographique et intégration des photographies de combat.",
          },
          {
            title: "Une identité de l'affiche au magazine.",
            text: "Les mêmes règles graphiques d'un support à l'autre, pour que le public reconnaisse l'événement partout où il le croise.",
          },
          {
            title: "Un suivi jusqu'au bon à tirer.",
            text: "Le projet a été mené jusqu'à la validation finale avant impression, pour que le résultat imprimé soit fidèle à la maquette.",
          },
        ],
      },
      {
        type: "gallery",
        images: [
          { src: "/img/projets/tijm-affiche.webp", alt: "Affiche à plat du 24e Tournoi International de Judo de Monaco", width: 1000, height: 1415 },
          { src: "/img/projets/tijm-1.webp", alt: "Affiche du tournoi sur un panneau urbain à Monaco", width: 864, height: 1222 },
          { src: "/img/projets/tijm-3.webp", alt: "Double page du magazine officiel du tournoi", width: 1000, height: 1000, full: true },
        ],
      },
      {
        type: "text",
        heading: "Le résultat",
        paragraphs: [
          "Une identité cohérente de l'affiche au magazine, menée jusqu'au bon à tirer.",
          // À VÉRIFIER : phrase de transition vers les services, à garder ou non.
          "Concevoir pour un événement, c'est travailler pour des supports très différents et des délais fixes : la même exigence s'applique à un site internet qui doit être prêt pour une date de lancement.",
        ],
      },
    ],
    cta: {
      heading: "Vous organisez un événement ?",
      text: "Affiche, programme, magazine ou site de l'événement : je conçois des supports cohérents et je les suis jusqu'à l'impression ou la mise en ligne. Parlons-en lors d'un court appel.",
    },
  },
];
