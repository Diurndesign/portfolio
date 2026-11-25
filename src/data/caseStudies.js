// ============================================================
//  Études de cas — SOURCE UNIQUE
// ============================================================
// Chaque étude de cas est décrite ici, dans un seul objet. La page
// /realisations/<slug> est GÉNÉRÉE à partir de ces données au build
// (voir src/case-study/generate.js + render.js). Pour AJOUTER UNE ÉTUDE :
// copier un bloc ci-dessous, changer les valeurs, mettre les images dans
// public/img/realisations/<slug>/, puis `git push`. Rien d'autre à toucher
// (la page, l'entrée du sitemap avec sa date et les liens « autres réalisations » se font
// tout seuls).
//
// Champs d'une entrée :
//   slug        : identifiant d'URL (/realisations/<slug>).
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
    slug: "beauty-corner",
    seo: {
      title: "Site d'un institut de beauté à Nice : The Beauty Corner",
      description:
        "Le site sur mesure de The Beauty Corner, institut de beauté à Nice : livré en 2 semaines, avec avant/après, réservation Planity et avis Google.",
      ogImage: "https://www.diurnstudio.fr/img/og/realisation-beauty-corner.jpg",
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
          "Avant de réserver une dermopigmentation des sourcils, une cliente veut être rassurée : voir des résultats, lire des avis, savoir comment se passe le rendez-vous. Le site internet de l'institut devait répondre à ces questions, et aider les personnes qui cherchent un institut de beauté à Nice à trouver The Beauty Corner.",
        ],
      },
      {
        type: "cards",
        heading: "Ce que j'ai fait",
        intro: "Un site codé sur mesure à partir de son logo, sans template, pensé pour qu'elle reste autonome.",
        cards: [
          {
            title: "Des avant/après interactifs.",
            text: "Dermopigmentation, rehaussement de cils, ongles, soin de la peau, détatouage : la cliente choisit une prestation et fait glisser le curseur sur la photo pour révéler le résultat. Une nouvelle cliente voit le résultat de ses propres yeux, sans avoir à lire une description.",
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
          { src: "/img/projets/bcorner-accueil.webp", alt: "Page d'accueil du site The Beauty Corner by Alex, institut de beauté à Nice, avec la note Google et le bouton de réservation", width: 1552, height: 703, full: true },
          { src: "/img/projets/bcorner-avant-apres.webp", alt: "Comparateur avant/après du site The Beauty Corner : onglets par prestation et curseur à faire glisser sur une dermopigmentation des sourcils", width: 974, height: 784, full: true },
          { src: "/img/projets/bcorner-2.webp", alt: "Section des prestations du site The Beauty Corner, soirée beauté entre amies", width: 1543, height: 753, full: true },
        ],
      },
      {
        type: "quote",
        heading: "Ce qu'en dit Alexandra",
        quote: "Merci à Jeremy pour ses compétences et son professionnalisme, toujours à l'écoute et dans la bienveillance. Je suis ravie de mon site internet, à mon image et très complet. Je recommande vivement.",
        author: "Alexandra, The Beauty Corner by Alex · avis Google 5 étoiles",
      },
      {
        type: "text",
        heading: "Le résultat",
        paragraphs: [
          "Le site a été livré en deux semaines. Le site, l'hébergement et le nom de domaine sont au nom d'Alexandra : elle en est propriétaire, et elle change ses photos seule depuis son espace d'administration.",
          "Une nouvelle cliente trouve au même endroit tout ce qui la décide : les prestations, les résultats en avant/après, les avis et le bouton pour réserver sur Planity.",
        ],
      },
    ],
    cta: {
      heading: "Vous tenez un institut ou un commerce à Nice ?",
      text: "Je crée des sites sur mesure qui rassurent vos futures clientes, se relient à vos outils de réservation et vous aident à être trouvé sur Google. Parlons de votre projet lors d'un court appel.",
    },
  },
  {
    slug: "gdunan",
    seo: {
      title: "Identité de marque haut de gamme : GdunaN | Diurn Studio",
      description:
        "L'identité complète de GdunaN, marque haut de gamme : monogramme GD, site codé sur mesure, carte de visite gaufrée et shooting photo.",
      ogImage: "https://www.diurnstudio.fr/img/og/realisation-gdunan.jpg",
      canonical: "https://www.diurnstudio.fr/realisations/gdunan",
    },
    breadcrumb: "GdunaN",
    cat: "Identité · Site web",
    h1: "GdunaN : une identité haut de gamme, du monogramme au site internet",
    intro:
      "GdunaN est une marque haut de gamme qui met en avant la matière et le geste. J'ai conçu toute son image : le logo, le site internet, la carte de visite et les photos.",
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
          "GdunaN met en avant la matière et le travail de la main. Il lui fallait une image haut de gamme, la même à l'écran et sur le papier.",
          "L'objectif : une identité épurée, qui laisse la place à la matière au lieu de la couvrir d'effets.",
        ],
      },
      {
        type: "cards",
        heading: "Ce que j'ai fait",
        intro: "Tout le projet a été mené par la même personne, du premier croquis du logo à la livraison du site.",
        cards: [
          {
            title: "Un monogramme « GD » épuré.",
            text: "Deux lettres réduites à l'essentiel, assez simples pour être lisibles en petit sur un écran de téléphone et assez fortes pour tenir seules sur un support imprimé.",
          },
          {
            title: "Un site internet codé sur mesure.",
            text: "J'ai mené la conception et la direction artistique du site, puis son développement. Il a été pensé aussi soigneusement pour le mobile que pour l'ordinateur.",
          },
          {
            title: "Une carte de visite gaufrée à froid.",
            text: "Le monogramme est imprimé en relief, sans encre : on le voit à la lumière et on le sent sous les doigts. On remarque le relief avant même de lire la carte.",
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
          "Une identité utilisée du site à la papeterie, avec le monogramme comme point commun. Les photos, sombres et texturées, montrent la matière de près.",
          "C'est l'intérêt de confier l'identité et le site à la même personne : rien ne se perd entre le graphiste et le développeur, parce qu'il n'y en a qu'un.",
        ],
      },
    ],
    cta: {
      heading: "Votre marque mérite la même cohérence ?",
      text: "Logo, site internet et supports imprimés : je les conçois ensemble, pour qu'ils se ressemblent. Parlons de votre projet lors d'un court appel.",
    },
  },
  {
    slug: "ewa-flr",
    seo: {
      title: "Identité de marque pour une cheffe : Ewa FLR | Diurn Studio",
      description:
        "L'identité de marque d'Ewa FLR, cheffe : logotype vertical, une seule couleur, le bleu béton, et une charte déclinée jusqu'au tablier.",
      ogImage: "https://www.diurnstudio.fr/img/og/realisation-ewa-flr.jpg",
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
            text: "Beaucoup d'espace, peu d'éléments, et les légumes de saison en guise de décor : les produits restent au premier plan.",
          },
          {
            title: "Une charte déclinée sur tous les supports.",
            text: "Cartes de visite recto-verso, menu, tablier et tote bag : chaque support reprend les mêmes règles, de la carte de visite jusqu'au service.",
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
          "Le jour où Ewa voudra un site, cette identité pourra s'y appliquer telle quelle.",
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
    seo: {
      title: "Logo d'une couturière : Elo Ab | Diurn Studio",
      description:
        "La refonte de l'identité d'Elo Ab, couturière : un logo tout en rondeurs, l'aiguille et le fil dans les lettres, jusqu'au ruban griffé.",
      ogImage: "https://www.diurnstudio.fr/img/og/realisation-elo-ab.jpg",
      canonical: "https://www.diurnstudio.fr/realisations/elo-ab",
    },
    breadcrumb: "Elo Ab",
    cat: "Refonte · Couture",
    h1: "Elo Ab : la refonte du logo d'une couturière",
    intro:
      "Elo Ab est couturière. J'ai refondu son identité autour d'un logotype tout en rondeurs où l'aiguille et le fil sont dessinés dans les lettres.",
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
          "Elo avait déjà une identité, mais on ne voyait pas qu'elle était couturière. Son logo devait le montrer d'un coup d'œil.",
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
            text: "Les outils du métier sont intégrés au dessin des lettres : on comprend que c'est de la couture sans avoir besoin d'une illustration à côté.",
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
          "Une marque qui s'applique aussi bien aux compositions florales qu'aux tissus. Le logo fonctionne aussi bien sur un écran que cousu sur un vêtement.",
          "Une refonte ne repart pas de rien : on garde ce qui fait l'identité de la personne et on le rend plus lisible.",
        ],
      },
    ],
    cta: {
      heading: "Votre logo ne raconte pas votre métier ?",
      text: "Création ou refonte, je dessine des identités qui disent tout de suite ce que vous faites, et je les décline sur vos supports et votre site. Parlons-en lors d'un court appel.",
    },
  },
  // ----------------------------------------------------------------
  // Les études Beauty Corner (en tête de liste), Pressing Azur Eco et
  // Tournoi de Judo de Monaco ont été rédigées à partir des fiches
  // existantes (src/projects/projects.data.js) et des pages de service.
  // ----------------------------------------------------------------
  {
    slug: "pressing-azur-eco",
    seo: {
      title: "Logo d'un pressing à Nice : Pressing Azur Eco",
      description:
        "Le logo de Pressing Azur Eco, pressing à Nice : une mascotte rétro façon « rubber hose » des années 30, un alphabet sur mesure, une palette sauge.",
      ogImage: "https://www.diurnstudio.fr/img/og/realisation-pressing-azur-eco.jpg",
      canonical: "https://www.diurnstudio.fr/realisations/pressing-azur-eco",
    },
    breadcrumb: "Pressing Azur Eco",
    cat: "Logo · Mascotte",
    h1: "Pressing Azur Eco : un logo-mascotte rétro pour un pressing à Nice",
    intro:
      "Pour Pressing Azur Eco, un pressing à Nice, j'ai créé un logo porté par une mascotte rétro, dans le style « rubber hose » des dessins animés des années 30, avec un alphabet dessiné sur mesure.",
    hero: {
      src: "/img/projets/az-1.webp",
      alt: "La mascotte du Pressing Azur Eco, personnage-boîte avec chapeau et nœud papillon",
      width: 1000,
      height: 1000,
    },
    facts: [
      { label: "Client", value: "Pressing Azur Eco" },
      { label: "Secteur", value: "Pressing, Nice" },
      { label: "Prestations", value: "Logo · Mascotte · Recherche typographique" },
      { label: "Supports", value: "Emblème, étiquette" },
    ],
    sections: [
      {
        type: "text",
        heading: "Le point de départ",
        paragraphs: [
          "Un pressing de quartier à Nice est un commerce de proximité : on y revient souvent, et on choisit celui dont on se souvient. Pour ce type de commerce, le logo fait une grande partie du travail, car c'est lui que le client revoit sur chaque étiquette.",
          "L'objectif : donner au pressing un personnage joyeux, facile à retenir, et une typographie à lui.",
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
          "Une mascotte malicieuse pour le pressing, dans une palette sauge, bleu nuit et crème.",
          "Une mascotte donne un visage à l'enseigne. C'est ce que je cherche en <a href=\"/creation-logo-nice\">création de logo</a> pour un commerce : une image qu'on reconnaît d'un coup d'œil et qui se décline ensuite sur tous les supports, de l'étiquette au site internet, le jour où le commerce en a besoin.",
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
    seo: {
      title: "Affiche du Tournoi de Judo de Monaco | Diurn Studio",
      description:
        "L'identité du 24e Tournoi International de Judo de Monaco (2017) : l'affiche, de l'abribus au Stade Louis II, et le magazine officiel.",
      ogImage: "https://www.diurnstudio.fr/img/og/realisation-tournoi-judo-monaco.jpg",
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
          "Un tournoi international se voit aussi dans la rue. L'affiche devait tenir aussi bien sur un panneau urbain de la Principauté que dans le hall du Stade Louis II, et le magazine officiel devait accompagner l'événement.",
        ],
      },
      {
        type: "cards",
        heading: "Ce que j'ai fait",
        cards: [
          {
            title: "Une affiche lisible de loin.",
            text: "Une prise de judo en noir et blanc sur le rouge et blanc de Monaco, puis trois informations bien détachées : le nom du tournoi, la date du dimanche 10 décembre 2017 et la salle omnisports du Stade Louis II.",
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
          "Un événement impose une date qui ne bouge pas et des supports très différents à tenir ensemble. C'est la même méthode que j'applique en <a href=\"/creation-site-internet-monaco\">création de site internet à Monaco</a> et sur la Côte d'Azur, quand un site doit être en ligne pour un lancement.",
        ],
      },
    ],
    cta: {
      heading: "Vous organisez un événement ?",
      text: "Affiche, programme, magazine ou site de l'événement : je conçois des supports cohérents et je les suis jusqu'à l'impression ou la mise en ligne. Parlons-en lors d'un court appel.",
    },
  },
];
