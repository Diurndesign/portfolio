// ============================================================
//  Robot de prospection : analyse d'un site et rédaction des constats
// ============================================================
// Utilisé par api/prospects.js. Le nom commence par « _ » : Vercel n'en
// fait pas une adresse publique. Chaque constat est formulé au
// vouvoiement, factuel et bienveillant, prêt à coller dans un message.

const NB = " "; // espace insécable avant « : »

// Métiers et villes visés (une recherche Google Maps par couple).
// En priorité : architectes, architectes d'intérieur et avocats (2 recherches
// sur 3 chaque jour, sur 7 villes), puis les artisans et les commerces.
export const PRIORITAIRES = [
  { metier: "Architecte", cherche: "un architecte", q: "architecte" },
  { metier: "Avocat", cherche: "un cabinet d'avocats", q: "avocat" },
  { metier: "Architecte d'intérieur", cherche: "un architecte d'intérieur", q: "architecte d'intérieur" },
  { metier: "Avocat", cherche: "un avocat en droit de la famille", q: "avocat droit de la famille" },
  { metier: "Architecte", cherche: "une agence d'architecture", q: "agence d'architecture" },
  { metier: "Avocat", cherche: "un avocat en droit immobilier", q: "avocat droit immobilier" },
  { metier: "Architecte d'intérieur", cherche: "un architecte d'intérieur", q: "décoration architecture intérieure" },
  { metier: "Avocat", cherche: "un avocat en droit du travail", q: "avocat droit du travail" },
];
export const VILLES_PRIORITAIRES = ["Nice", "Cannes", "Antibes", "Menton", "Grasse", "Cagnes-sur-Mer", "Mougins"];

export const AUTRES = [
  { metier: "Plombier", cherche: "un plombier", q: "plombier" },
  { metier: "Électricien", cherche: "un électricien", q: "électricien" },
  { metier: "Menuisier", cherche: "un menuisier", q: "menuisier ébéniste" },
  { metier: "Peintre en bâtiment", cherche: "un peintre en bâtiment", q: "peintre en bâtiment" },
  { metier: "Maçon", cherche: "un maçon", q: "maçon rénovation" },
  { metier: "Carreleur", cherche: "un carreleur", q: "carreleur" },
  { metier: "Boulangerie", cherche: "une boulangerie", q: "boulangerie pâtisserie" },
  { metier: "Restaurant", cherche: "un restaurant", q: "restaurant" },
  { metier: "Coiffeur", cherche: "un coiffeur", q: "salon de coiffure" },
  { metier: "Institut de beauté", cherche: "un institut de beauté", q: "institut de beauté" },
  { metier: "Boucherie", cherche: "une boucherie", q: "boucherie charcuterie" },
  { metier: "Fromagerie", cherche: "une fromagerie", q: "fromagerie" },
  { metier: "Barbier", cherche: "un barbier", q: "barbier" },
  { metier: "Caviste", cherche: "un caviste", q: "caviste" },
  { metier: "Épicerie fine", cherche: "une épicerie fine", q: "épicerie fine" },
];
export const VILLES = ["Nice", "Antibes", "Cannes", "Menton"];

// n-ième couple (métier, ville) : on change de métier à chaque pas et de
// ville presque à chaque pas, et tous les couples passent avant de revenir
// au premier.
function couple(metiers, villes, n) {
  const total = metiers.length * villes.length;
  const i = ((n % total) + total) % total;
  const tour = Math.floor(i / metiers.length);
  const m = i % metiers.length;
  return { ...metiers[m], ville: villes[(m + tour) % villes.length] };
}

// Les 3 recherches d'un jour : 2 prioritaires, puis 1 autre métier
export function recherchesDuJour(jour) {
  return [
    couple(PRIORITAIRES, VILLES_PRIORITAIRES, jour * 2),
    couple(PRIORITAIRES, VILLES_PRIORITAIRES, jour * 2 + 1),
    couple(AUTRES, VILLES, jour),
  ];
}

// Pages qui ne sont pas un vrai site : réseaux sociaux, annuaires,
// plateformes de réservation
const PLATEFORMES = [
  [/(^|\.)instagram\.com$/, "Instagram"],
  [/(^|\.)(facebook|fb)\.com$/, "Facebook"],
  [/(^|\.)linktr\.ee$/, "Linktree"],
  [/(^|\.)tiktok\.com$/, "TikTok"],
  [/(^|\.)linkedin\.com$/, "LinkedIn"],
  [/(^|\.)tripadvisor\.[a-z.]+$/, "Tripadvisor"],
  [/(^|\.)(thefork|lafourchette)\.[a-z.]+$/, "TheFork"],
  [/(^|\.)planity\.com$/, "Planity"],
  [/(^|\.)treatwell\.[a-z.]+$/, "Treatwell"],
  [/(^|\.)booksy\.com$/, "Booksy"],
  [/(^|\.)doctolib\.fr$/, "Doctolib"],
  [/(^|\.)pagesjaunes\.fr$/, "PagesJaunes"],
  [/(^|\.)(ubereats|deliveroo)\.[a-z.]+$/, "une plateforme de livraison"],
  [/(^|\.)houzz\.[a-z.]+$/, "Houzz"],
  [/(^|\.)(google\.com|g\.page|goo\.gl)$/, "Google"],
];

// Adresses gratuites des créateurs de sites (pas de nom de domaine)
const SOUS_DOMAINES = [
  [/\.wixsite\.com$/, "Wix", "wixsite.com"],
  [/\.(jimdofree|jimdosite|jimdo)\.com$/, "Jimdo", "jimdo"],
  [/\.webnode\.[a-z]+$/, "Webnode", "webnode"],
  [/\.site123\.me$/, "Site123", "site123.me"],
  [/\.e-monsite\.com$/, "e-monsite", "e-monsite.com"],
  [/\.wordpress\.com$/, "WordPress.com", "wordpress.com"],
  [/\.business\.site$/, "Google", "business.site"],
  [/^sites\.google\.com$/, "Google Sites", "sites.google.com"],
  [/\.weebly\.com$/, "Weebly", "weebly.com"],
  [/\.godaddysites\.com$/, "GoDaddy", "godaddysites.com"],
  [/\.squarespace\.com$/, "Squarespace", "squarespace.com"],
  [/\.blogspot\.[a-z]+$/, "Blogger", "blogspot"],
];

// Créateurs de sites reconnaissables dans le code de la page
const CREATEURS = [
  ["Wix", /wixstatic\.com|wix\.com website builder|x-wix-request-id/i],
  ["Jimdo", /jimdo(cdn|free|site)?\.com/i],
  ["Webnode", /webnode\.(com|fr|page)/i],
  ["Site123", /site123\.(com|me)/i],
  ["e-monsite", /e-monsite\.com/i],
  ["Squarespace", /static1\.squarespace\.com|squarespace-cdn/i],
  ["GoDaddy", /img1\.wsimg\.com|godaddy website builder/i],
  ["Weebly", /editmysite\.com|weebly\.com/i],
];

const sans = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
export const hostOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
};

// Texte visible approximatif (pour savoir si la page est rendue en JavaScript)
function texteVisible(html) {
  return html
    .replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function metaContent(html, name) {
  const re1 = new RegExp(`<meta[^>]+name=["']?${name}["']?[^>]*content=["']([^"']*)["']`, "i");
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*name=["']?${name}["']?`, "i");
  return (html.match(re1) || html.match(re2) || [])[1];
}

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&#0?39;|&apos;|&rsquo;|&#8217;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&eacute;/g, "é")
    .replace(/&egrave;/g, "è")
    .replace(/&agrave;/g, "à")
    .replace(/&ccedil;/g, "ç")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// E-mails trouvés dans la page (on garde de préférence celui du domaine)
const EMAIL_DOMAINES_EXCLUS =
  /(^|\.)(wix\.com|wixpress\.com|sentry\.io|example\.(com|fr|org)|domain\.(com|fr)|email\.com|votredomaine\.(com|fr)|yourdomain\.com|godaddy\.com|squarespace\.com|jimdo\.com|w3\.org|schema\.org|mysite\.com|site123\.com|webnode\.(com|fr))$/i;
const EMAIL_LOCAUX_EXCLUS = /^(votre|your|nom|name|exemple|example|email|mail|user|test)([._-]|$)/i;
export function trouverEmail(html, host) {
  const brut = html.replace(/&#64;|&#x40;|\[at\]|\(at\)/gi, "@");
  const found = [...new Set((brut.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || []).map((e) => e.toLowerCase()))].filter(
    (e) => !/\.(png|jpe?g|gif|webp|svg|css|js)$/i.test(e) && !EMAIL_DOMAINES_EXCLUS.test(e.split("@")[1]) &&
      !EMAIL_LOCAUX_EXCLUS.test(e.split("@")[0]) && e.length < 80
  );
  const racine = host.split(".").slice(-2).join(".");
  return found.find((e) => e.endsWith("@" + racine) || e.endsWith("." + racine)) || found[0] || "";
}

export function trouverReseau(html) {
  const m = html.match(/https?:\/\/(?:www\.)?(?:instagram\.com|facebook\.com)\/(?!sharer|share|plugins|dialog|tr\b|tr\?|login|policy|privacy)[A-Za-z0-9_.\-]+\/?/i);
  return m ? m[0] : "";
}

export function lienContact(html, baseUrl) {
  const hrefs = [...html.matchAll(/href=["']([^"'#]+)["']/gi)].map((m) => m[1]);
  const href = hrefs.find((h) => /contact/i.test(h) && !/^mailto:|^tel:/i.test(h));
  if (!href) return "";
  try {
    const u = new URL(href, baseUrl);
    return hostOf(u.href) === hostOf(baseUrl) ? u.href : "";
  } catch {
    return "";
  }
}

// ---------------------------------------------------------------------
//  Constats
// ---------------------------------------------------------------------
// Chaque constat : { score, probleme (colonne Notion), texte, detail? }

export function constatsSansSite(place, metier, ville) {
  const out = [
    {
      score: 9,
      probleme: "Pas de site",
      texte: `Votre fiche Google n'a pas de site${NB}: un client qui veut voir vos services, vos tarifs ou vos réalisations avant de venir ne trouve rien de plus.`,
    },
  ];
  if (place.userRatingCount >= 10)
    out.push({
      score: 1,
      probleme: "Pas de site",
      texte: `Vous avez ${place.userRatingCount} avis Google (${String(place.rating).replace(".", ",")}/5)${NB}: une belle réputation, qu'un site permettrait de prolonger.`,
    });
  out.push({
    score: 1,
    probleme: "Pas de site",
    texte: `Quand on cherche « ${metier.toLowerCase()} ${ville} » sur Google, les entreprises qui ont un site sont mieux placées que celles qui n'ont qu'une fiche.`,
  });
  return out;
}

export function constatsPlateforme(nom, place) {
  const reseau = ["Instagram", "Facebook", "TikTok", "LinkedIn", "Linktree"].includes(nom);
  const out = [
    {
      score: 8,
      probleme: "Réseaux sociaux seulement",
      texte: reseau
        ? `Votre fiche Google renvoie vers votre page ${nom}${NB}: on y voit vos photos, mais pas clairement vos services, vos tarifs ni comment vous contacter.`
        : `Votre fiche Google renvoie vers votre page ${nom}${NB}: vous dépendez de leur plateforme, et Google n'a aucun site à votre nom à montrer.`,
    },
  ];
  if (place.userRatingCount >= 10)
    out.push({
      score: 1,
      probleme: "Réseaux sociaux seulement",
      texte: `Vous avez ${place.userRatingCount} avis Google (${String(place.rating).replace(".", ",")}/5)${NB}: une belle réputation, qu'un site à votre nom permettrait de prolonger.`,
    });
  return out;
}

// Erreur de chargement du site
export function constatsErreur(err) {
  const code = String(err?.cause?.code || err?.code || err?.name || "");
  if (/CERT|SSL|TLS|SELF_SIGNED/i.test(code))
    return [
      {
        score: 7,
        probleme: "Site non sécurisé",
        texte: `Le site affiche une alerte de sécurité (certificat expiré ou invalide)${NB}: la plupart des visiteurs font demi-tour avant de le voir.`,
        detail: code,
      },
    ];
  if (/ENOTFOUND|EAI_AGAIN|ECONNREFUSED|ECONNRESET|EHOSTUNREACH/i.test(code))
    return [
      {
        score: 8,
        probleme: "Site inaccessible",
        texte: `L'adresse du site indiquée sur votre fiche Google ne répond plus${NB}: les clients qui cliquent tombent sur une page d'erreur.`,
        detail: code,
      },
    ];
  if (/Timeout|Abort/i.test(code))
    return [
      {
        score: 4,
        probleme: "Site lent",
        texte: `Le site n'a pas répondu en 10 secondes lors de mon test${NB}: sur téléphone, la plupart des visiteurs partent bien avant.`,
        detail: code,
      },
    ];
  return []; // erreur non qualifiée : on ne conclut rien
}

export function constatsStatut(status) {
  if ([404, 410, 500, 502, 504, 521, 522, 523, 525, 526].includes(status))
    return [
      {
        score: 8,
        probleme: "Site inaccessible",
        texte: `La page d'accueil du site renvoie une erreur (${status})${NB}: les clients qui cliquent depuis votre fiche Google ne voient pas votre site.`,
      },
    ];
  return [];
}

// Analyse d'une page d'accueil chargée correctement
export function analyserPage({ html, headers = "", finalUrl, ms, metier, ville }) {
  const out = [];
  const host = hostOf(finalUrl);
  const texte = texteVisible(html);
  const rendu = texte.length > 600; // assez de texte : page lisible sans JavaScript
  const annee = new Date().getFullYear();

  // Adresse gratuite d'un créateur de sites
  const sd = SOUS_DOMAINES.find(([re]) => re.test(host));
  if (sd) {
    out.push({
      score: 6,
      probleme: "Site Wix ou similaire",
      texte: `Le site est à une adresse en ${sd[2]}, celle de ${sd[1]}${NB}: pas de nom de domaine à votre nom, ce qui inspire moins confiance et pèse sur Google.`,
    });
  } else {
    const createur = CREATEURS.find(([, re]) => re.test(html) || re.test(headers));
    if (createur)
      out.push({
        score: 3,
        probleme: "Site Wix ou similaire",
        texte:
          createur[0] === "Wix"
            ? `Le site est construit avec Wix${NB}: il reste lié à leur abonnement annuel, et ce type de site est souvent lent à s'afficher sur téléphone.`
            : `Le site est construit avec ${createur[0]}${NB}: il reste lié à l'abonnement de la plateforme, sans possibilité de l'emporter ailleurs.`,
      });
  }

  // Sécurité
  if (/^http:/i.test(finalUrl))
    out.push({
      score: 5,
      probleme: "Site non sécurisé",
      texte: `Le site s'ouvre sans cadenas (http)${NB}: Chrome l'affiche « Non sécurisé » à vos visiteurs, et Google le classe moins bien.`,
    });

  // Mobile
  if (!/<meta[^>]+name=["']?viewport/i.test(html))
    out.push({
      score: 6,
      probleme: "Pas adapté au mobile",
      texte: `Le site n'est pas adapté au téléphone${NB}: il faut zoomer pour lire, alors que la majorité de vos visiteurs arrivent depuis un mobile.`,
    });

  // Techniques anciennes
  if (/<frameset|\.swf\b|<marquee|<font\s/i.test(html))
    out.push({
      score: 4,
      probleme: "Site daté",
      texte: `Le site repose sur des techniques d'une autre époque, qui s'affichent mal sur les téléphones et les écrans actuels.`,
    });

  // Année du copyright
  const annees = [...html.matchAll(/(?:©|&copy;|&#169;|copyright)[^0-9<]{0,40}((?:19|20)\d{2})(?:\s*(?:-|–|&ndash;|à)\s*((?:19|20)\d{2}))?/gi)]
    .flatMap((m) => [m[1], m[2]])
    .filter(Boolean)
    .map(Number)
    .filter((y) => y <= annee);
  if (annees.length) {
    const derniere = Math.max(...annees);
    if (derniere <= annee - 3)
      out.push({
        score: 4,
        probleme: "Site daté",
        texte: `Le bas de page affiche « © ${derniere} »${NB}: pour un visiteur, cela donne l'impression d'un site, voire d'une activité, à l'arrêt.`,
      });
  }

  // WordPress ancien
  const wp = (metaContent(html, "generator") || "").match(/WordPress\s+(\d+)\.(\d+)/i);
  if (wp && Number(wp[1]) < 6)
    out.push({
      score: 3,
      probleme: "Site daté",
      texte: `Le site tourne sur une version de WordPress vieille de plusieurs années (${wp[1]}.${wp[2]})${NB}: les mises à jour et les extensions récentes ne suivent plus.`,
    });

  // Lenteur (temps de réponse de la page seule, sans les images)
  if (ms > 3000)
    out.push({
      score: ms > 6000 ? 4 : 2,
      probleme: "Site lent",
      texte: `La page d'accueil a mis ${String(Math.round(ms / 100) / 10).replace(".", ",")}${NB}secondes à répondre lors de mon test, avant même de charger les images.`,
    });

  // Titre et description pour Google
  const titre = decode((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "");
  const generique = /^(accueil|home|bienvenue|index|mon site|untitled|page d'accueil|welcome|site)$/i;
  if (!titre)
    out.push({ score: 2, probleme: "Autre", texte: `La page d'accueil n'a pas de titre pour Google${NB}: le résultat de recherche affiche l'adresse du site à la place.` });
  else if (generique.test(titre))
    out.push({ score: 2, probleme: "Autre", texte: `Le titre de la page dans Google est « ${titre} », sans votre métier ni votre ville.` });
  else if (!sans(titre).includes(sans(ville)))
    out.push({
      score: 1,
      probleme: "Autre",
      texte: `Le titre de la page dans Google ne mentionne pas ${ville}${NB}: vous passez à côté des recherches « ${metier.toLowerCase()} ${ville} ».`,
    });
  const desc = metaContent(html, "description");
  if (!desc || desc.trim().length < 20)
    out.push({
      score: 1,
      probleme: "Autre",
      texte: `La page d'accueil n'a pas de description pour Google${NB}: le résultat de recherche affiche un extrait pris au hasard dans la page.`,
    });

  // Téléphone cliquable (seulement si la page est lisible sans JavaScript)
  if (rendu && !/href=["']?tel:/i.test(html))
    out.push({
      score: 1,
      probleme: "Autre",
      texte: `Sur téléphone, votre numéro n'est pas cliquable${NB}: il faut le recopier pour vous appeler.`,
    });

  return out;
}

// Plateforme (réseau social, annuaire) à la place d'un site ?
export function plateformeDe(url) {
  const host = hostOf(url);
  const p = PLATEFORMES.find(([re]) => re.test(host));
  return p ? p[1] : "";
}

// Synthèse : score total, problème principal, 3 constats les plus forts
export function synthese(constats) {
  const tries = [...constats].sort((a, b) => b.score - a.score);
  return {
    score: tries.reduce((s, c) => s + c.score, 0),
    probleme: tries[0]?.probleme || "Autre",
    constats: tries.slice(0, 3).map((c) => c.texte),
    tous: tries,
  };
}

// ---------------------------------------------------------------------
//  Message prêt à envoyer (repris des « Modèles de prospection »)
// ---------------------------------------------------------------------
const SIGNATURE = "Jérémy Bendenoun\nDiurn Studio · 06 50 94 96 15";
const DESINSCRIPTION = "Si vous ne souhaitez plus recevoir de message de ma part, dites-le-moi simplement.";
const CALENDLY = "https://calendly.com/diurnstudio/appel-decouvert";

export function message({ nom, metier, cherche, ville, constats, sansSite }) {
  const qui = cherche || metier.toLowerCase();
  const liste = [...constats];
  while (liste.length < 3) liste.push("[Constat à compléter en ouvrant le site sur votre téléphone]");

  if (sansSite) {
    return {
      objet: `Votre fiche Google, ${nom}`,
      corps: `Bonjour [Prénom],

En cherchant ${qui} à ${ville} sur Google Maps, je suis tombé sur ${nom}. [Un compliment sincère et précis : vos avis, vos photos, votre carte.]

${constats.join("\n\n")}

Je suis Jérémy, designer et développeur web près de Nice. Je crée des sites d'une page sur mesure, à partir de 900 € et en deux semaines, à votre nom et sans abonnement obligatoire.

Si cela vous intéresse, je vous montre en 30 minutes ce que cela donnerait pour vous : ${CALENDLY}

Bonne journée,
${SIGNATURE}
https://www.diurnstudio.fr

${DESINSCRIPTION}`,
    };
  }

  if (/avocat/i.test(metier)) {
    return {
      objet: `Le site de ${nom}`,
      corps: `Maître [Nom],

En cherchant ${qui} à ${ville}, je suis tombé sur le site de votre cabinet. [Un mot sincère et précis : vos domaines d'intervention, votre parcours, votre présentation.]

En le parcourant, j'ai remarqué trois points qui peuvent freiner un futur client :
1. ${liste[0]}
2. ${liste[1]}
3. ${liste[2]}

Je suis Jérémy, designer et développeur web près de Nice. Je conçois des sites de cabinets sobres et clairs, dans le respect des règles de communication de la profession : une page par domaine d'intervention, vos honoraires présentés simplement si vous le souhaitez, une prise de rendez-vous en ligne, et un bon référencement sur « avocat ${ville} ».

Je peux vous montrer en 30 minutes ce que cela donnerait pour votre cabinet : ${CALENDLY}

Bien à vous,
${SIGNATURE}

${DESINSCRIPTION}`,
    };
  }

  if (/architecte/i.test(metier)) {
    return {
      objet: `Le site de ${nom}`,
      corps: `Bonjour [Prénom],

J'ai découvert le travail de ${nom}, en particulier [projet précis]. [Un compliment sincère sur ce projet.]

En parcourant votre site, j'ai remarqué trois points :
1. ${liste[0]}
2. ${liste[1]}
3. ${liste[2]}

Pour un cabinet, le site est souvent la première impression d'un futur client : vos projets y méritent la même exigence que sur le chantier.

Je suis Jérémy, designer et développeur web près de Nice. Je conçois des sites d'architectes sur mesure : grandes photos, une fiche par projet, un classement par type, et une interface pour ajouter vos réalisations vous-même.

Je peux vous montrer en 30 minutes, en visio ou à votre cabinet, ce que cela donnerait pour vous : ${CALENDLY}

Bien à vous,
${SIGNATURE}

${DESINSCRIPTION}`,
    };
  }

  return {
    objet: `Votre site ${nom} sur téléphone`,
    corps: `Bonjour [Prénom],

En cherchant ${qui} à ${ville}, je suis tombé sur votre site. [Un compliment sincère et précis : vos réalisations, votre carte, vos photos.]

J'ai remarqué trois points qui vous font probablement perdre des clients :
1. ${liste[0]}
2. ${liste[1]}
3. ${liste[2]}

Je suis Jérémy, designer et développeur web près de Nice. Je refais des sites comme le vôtre sur mesure, en gardant votre nom de domaine et votre place sur Google, et sans abonnement à une plateforme.

Si cela vous intéresse, je vous envoie un audit gratuit plus complet (vitesse, affichage mobile, référencement), sans engagement. Il suffit de me répondre « oui ».

Bonne journée,
${SIGNATURE}
https://www.diurnstudio.fr/refonte-site-internet-nice

${DESINSCRIPTION}`,
  };
}
