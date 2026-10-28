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
    slug: "beauty-corner",
    lastmod: "2026-10-24",
    seo: {
      title:
        "Site internet pour un institut de beauté à Nice : The Beauty Corner | Diurn Studio",
      description:
        "Étude de cas : création du site sur mesure de The Beauty Corner, institut de beauté à Nice. Design, réservation Planity, avant/après, avis Google et référencement local, livré en deux semaines.",
      ogImage: "https://www.diurnstudio.fr/img/projets/bcorner-mockup.webp",
      canonical: "https://www.diurnstudio.fr/realisations/beauty-corner",
    },
    breadcrumb: "The Beauty Corner",
    h1: "Un site sur mesure pour un institut de beauté à Nice",
    intro:
      "The Beauty Corner by Alex est un institut de beauté du quartier Riquier, spécialisé en dermopigmentation des sourcils. J'ai conçu et développé son site en deux semaines, avec une interface pour que la gérante le modifie elle-même.",
    hero: {
      src: "/img/projets/bcorner-mockup.webp",
      alt: "Site internet de The Beauty Corner by Alex, institut de beauté à Nice, sur ordinateur et mobile",
      width: 1080,
      height: 1080,
    },
    facts: [
      { label: "Client", value: "The Beauty Corner by Alex" },
      { label: "Secteur", value: "Institut de beauté, Nice" },
      {
        label: "Prestations",
        value: "Design web · Développement sur mesure · Référencement local",
      },
      { label: "Délai", value: "2 semaines" },
    ],
    live: {
      url: "https://thebeautycornerbyalex.fr/",
      label: "Voir le site en ligne",
    },
    sections: [
      {
        type: "text",
        heading: "Le point de départ",
        paragraphs: [
          "Alexandra est esthéticienne depuis 20 ans et spécialiste de la dermopigmentation des sourcils. Son institut est installé au sein du studio de tatouage Frères d'Encre, rue Arson à Nice.",
          "Ses clientes la découvraient sur Instagram et réservaient sur Planity. Mais il lui manquait un site à elle : une vraie carte de visite en ligne pour présenter son savoir-faire, et un moyen d'être mieux trouvée sur Google.",
          "Elle voulait un site qui lui ressemble, qui rassure avant une prestation comme la dermopigmentation, et qu'elle puisse mettre à jour seule.",
        ],
      },
      {
        type: "cards",
        heading: "Ce que j'ai fait",
        cards: [
          {
            title: "Une ambiance douce et premium.",
            text: "Des tons chauds et une typographie élégante, pour traduire l'idée d'un « cocon » plutôt que celle d'un salon standard.",
          },
          {
            title: "Des avant/après interactifs.",
            text: "Pour la dermopigmentation, le résultat est l'argument principal. J'ai développé un curseur avant/après : la visiteuse choisit une prestation, puis fait glisser le curseur pour révéler le résultat.",
          },
          {
            title: "La réservation sans friction.",
            text: "Chaque bouton « Prendre rendez-vous » mène directement à son agenda Planity. Pas de double gestion des rendez-vous.",
          },
          {
            title: "Les avis Google mis en avant.",
            text: "Sa note de 5,0 apparaît dès le haut de la page, puis dans une section dédiée.",
          },
          {
            title: "Une interface d'administration.",
            text: "Alexandra ajoute et modifie elle-même ses textes, ses photos et ses avant/après, sans passer par moi.",
          },
          {
            title: "Le référencement local intégré.",
            text: "Une page pensée pour les recherches comme « dermopigmentation Nice » ou « institut de beauté Nice », une FAQ sur les questions que se posent ses clientes, et la configuration de Google Search Console et Analytics.",
          },
          {
            title: "Le site à son nom.",
            text: "Hébergement et nom de domaine sont à son nom : elle est entièrement propriétaire de son site.",
          },
        ],
      },
      {
        type: "gallery",
        images: [
          {
            src: "/img/realisations/beauty-corner/bc-accueil.webp",
            alt: "Page d'accueil du site The Beauty Corner sur ordinateur",
            width: 1537,
            height: 745,
          },
          {
            src: "/img/realisations/beauty-corner/bc-avant-apres.webp",
            alt: "Curseur avant/après interactif pour la dermopigmentation des sourcils",
            width: 1537,
            height: 705,
          },
          {
            src: "/img/realisations/beauty-corner/bc-mobile.webp",
            alt: "Trois écrans du site The Beauty Corner sur mobile",
            width: 1310,
            height: 733,
            full: true,
          },
          {
            src: "/img/realisations/beauty-corner/bc-apropos.webp",
            alt: "Section de présentation d'Alexandra, esthéticienne à Nice",
            width: 1537,
            height: 745,
          },
          {
            src: "/img/realisations/beauty-corner/bc-avis.webp",
            alt: "Section des avis clients Google du site The Beauty Corner",
            width: 1537,
            height: 680,
          },
        ],
      },
      {
        type: "text",
        heading: "Le résultat",
        paragraphs: [
          "Le site a été livré en deux semaines : un jour de cadrage, un jour pour valider la direction visuelle, puis le développement, un premier jet à valider, et l'intégration des vrais textes et photos.",
          "Depuis la mise en ligne, l'institut est mieux positionné sur Google, et de nouvelles clientes sont venues grâce au site. Instagram et Planity continuent de jouer leur rôle, mais le site est désormais la vitrine qui relie tout : il présente le savoir-faire d'Alexandra, rassure avant le premier rendez-vous et renvoie directement vers la réservation.",
        ],
      },
      {
        type: "quote",
        heading: "Ce qu'en dit Alexandra",
        quote:
          "Merci à Jérémy pour ses compétences et son professionnalisme, il est toujours à l'écoute et bienveillant. Je suis ravie de mon site internet, qui reflète mon image et qui est très complet. Je le recommande vivement.",
        author: "Alexandra, The Beauty Corner by Alex, Nice",
      },
      {
        type: "faq",
        heading: "Questions fréquentes",
        label: "Questions fréquentes sur le projet The Beauty Corner",
        items: [
          {
            q: "Combien de temps a pris la création du site&nbsp;?",
            a: "Deux semaines, du cadrage à la mise en ligne&nbsp;: un jour de cadrage, un jour pour valider la direction visuelle, puis le développement et l'intégration des vrais textes et photos.",
          },
          {
            q: "La gérante peut-elle modifier son site seule&nbsp;?",
            a: "Oui. Grâce à son interface d'administration, Alexandra ajoute et modifie elle-même ses textes, ses photos et ses avant/après.",
          },
          {
            q: "Le site remplace-t-il Planity&nbsp;?",
            a: "Non, il le complète. Chaque bouton «&nbsp;Prendre rendez-vous&nbsp;» mène directement à son agenda Planity&nbsp;: il n'y a pas de double gestion des rendez-vous.",
          },
          {
            q: "À qui appartient le site&nbsp;?",
            a: "À Alexandra. L'hébergement et le nom de domaine sont à son nom&nbsp;: elle est entièrement propriétaire de son site.",
          },
          {
            q: "Pouvez-vous créer un site similaire pour mon institut ou mon salon&nbsp;?",
            a: "Oui. Chaque site est conçu sur mesure pour votre activité, avec un devis gratuit et sans engagement. Demandez un devis ou réservez un appel de 15&nbsp;min juste en dessous.",
          },
        ],
      },
    ],
    cta: {
      heading: "Vous avez un projet similaire ?",
      text: "Institut, salon, commerce ou artisan à Nice : parlons de votre site.",
    },
  },
];
