// ============================================================
//  /api/prospects — robot de prospection (tâche planifiée Vercel)
// ============================================================
// Du lundi au jeudi, tôt le matin (vercel.json, « crons ») :
//   1. cherche des entreprises sur Google Maps (API Google Places),
//      2 recherches sur 3 pour les architectes et les avocats, la
//      troisième pour les artisans et les commerces ;
//   2. ouvre leur site et relève ce qui freine (pas de site, pas adapté
//      au mobile, pas sécurisé, daté, lent, Wix…) ;
//   3. ajoute les 5 entreprises qui en ont le plus besoin dans la base
//      Notion « Prospection », avec les constats et un message prêt à
//      envoyer. Une entreprise déjà présente n'est jamais ajoutée deux fois.
// Aucun e-mail n'est envoyé : c'est vous qui relisez et envoyez.
//
// Réglages (Vercel, Settings, Environment Variables) :
//   GOOGLE_PLACES_KEY   clé de l'API Google Places (New)
//   NOTION_TOKEN        clé de l'intégration Notion (ou NOTION_KEY)
//   CRON_SECRET         protège le lancement (Vercel l'envoie lui-même)
//   PROSPECTS_PAR_JOUR  (facultatif) 5 par défaut
//
// Contrôle : GET /api/prospects?check=1 indique si tout est réglé (aucune
// clé n'est montrée) et quelle sera la prochaine recherche.

import {
  recherchesDuJour,
  hostOf,
  plateformeDe,
  constatsSansSite,
  constatsPlateforme,
  constatsErreur,
  constatsStatut,
  analyserPage,
  synthese,
  message,
  trouverEmail,
  trouverReseau,
  lienContact,
} from "./_prospection.js";

const NOTION = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";
// Base « Prospection » dans la page Notion « Diurn studio » (identifiant public)
const DATABASE_ID = process.env.NOTION_PROSPECTION_ID || "094bb379ae7b489e9a0ffcd3b7745729";
const TOKEN = process.env.NOTION_TOKEN || process.env.NOTION_KEY;
const PLACES_KEY = process.env.GOOGLE_PLACES_KEY;
const PAR_JOUR = Math.min(Number(process.env.PROSPECTS_PAR_JOUR) || 5, 15);

// Garde-fous : au plus 8 appels Google par passage (environ 140 par mois,
// sous la part gratuite mensuelle de Google), et 50 secondes de travail.
const MAX_APPELS_GOOGLE = 8;
const RECHERCHES_PAR_JOUR = 3;
const DUREE_MAX = 50_000;
const UA = "Mozilla/5.0 (compatible; DiurnStudioAudit/1.0; +https://www.diurnstudio.fr)";

function notion(path, method, body) {
  return fetch(NOTION + path, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  }).then(async (r) => {
    const json = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(`Notion ${r.status} : ${json.message || "erreur"}`);
    return json;
  });
}

// Entreprises déjà dans la base (identifiant Google et domaine du site)
async function dejaVus() {
  const ids = new Set();
  const hosts = new Set();
  let cursor;
  for (let i = 0; i < 30; i++) {
    const page = await notion(`/databases/${DATABASE_ID}/query`, "POST", { page_size: 100, start_cursor: cursor });
    for (const p of page.results) {
      const id = p.properties["Place ID"]?.rich_text?.[0]?.plain_text;
      if (id) ids.add(id);
      const site = p.properties.Site?.url;
      if (site && !plateformeDe(site)) hosts.add(hostOf(site));
    }
    if (!page.has_more) break;
    cursor = page.next_cursor;
  }
  return { ids, hosts };
}

async function places(textQuery, pageToken) {
  const r = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": PLACES_KEY,
      "X-Goog-FieldMask": [
        "places.id",
        "places.displayName",
        "places.formattedAddress",
        "places.websiteUri",
        "places.nationalPhoneNumber",
        "places.rating",
        "places.userRatingCount",
        "places.googleMapsUri",
        "places.businessStatus",
        "nextPageToken",
      ].join(","),
    },
    body: JSON.stringify({ textQuery, languageCode: "fr", regionCode: "FR", pageSize: 20, ...(pageToken ? { pageToken } : {}) }),
  });
  const json = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`Google Places ${r.status} : ${json.error?.message || "erreur"}`);
  return json;
}

async function charger(url, ms = 10_000) {
  const t0 = Date.now();
  const r = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(ms),
    headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml", "Accept-Language": "fr-FR,fr;q=0.9" },
  });
  const html = (await r.text()).slice(0, 800_000);
  const headers = [...r.headers.keys()].join(" ");
  return { status: r.status, html, headers, finalUrl: r.url || url, ms: Date.now() - t0 };
}

// Analyse complète d'une entreprise
async function analyser(place, q) {
  const nom = place.displayName?.text || "Sans nom";
  const ville = (place.formattedAddress || "").match(/\b0\d{4}\s+([^,]+)/)?.[1]?.trim() || q.ville;
  const base = { place, nom, ville, metier: q.metier, cherche: q.cherche, email: "", reseau: "" };
  const site = place.websiteUri;

  if (!site) return { ...base, sansSite: true, ...synthese(constatsSansSite(place, q.metier, ville)) };

  const plateforme = plateformeDe(site);
  if (plateforme)
    return { ...base, sansSite: true, reseau: site, ...synthese(constatsPlateforme(plateforme, place)) };

  let page;
  try {
    page = await charger(site);
  } catch (err) {
    return { ...base, ...synthese(constatsErreur(err)) };
  }
  if (page.status >= 400) return { ...base, ...synthese(constatsStatut(page.status)) };

  const res = synthese(analyserPage({ ...page, metier: q.metier, ville }));
  let email = trouverEmail(page.html, hostOf(page.finalUrl));
  if (!email) {
    const contact = lienContact(page.html, page.finalUrl);
    if (contact) {
      try {
        email = trouverEmail((await charger(contact, 6000)).html, hostOf(page.finalUrl));
      } catch {
        /* page contact inaccessible */
      }
    }
  }
  return { ...base, ...res, email, reseau: trouverReseau(page.html) };
}

const text = (v) => (v ? [{ type: "text", text: { content: String(v).slice(0, 1990) } }] : []);
const today = () => new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" });

async function ajouter(p) {
  const msg = message({ nom: p.nom, metier: p.metier, cherche: p.cherche, ville: p.ville, constats: p.constats, sansSite: p.sansSite });
  const contact = p.email
    ? `E-mail trouvé sur le site : ${p.email}.`
    : p.sansSite
      ? "Pas d'e-mail : appelez, ou écrivez par message sur Instagram ou Facebook."
      : "Pas d'e-mail trouvé sur le site : regardez la page contact ou les mentions légales, ou appelez.";
  const children = [
    { object: "block", type: "heading_3", heading_3: { rich_text: text("Avant d'envoyer") } },
    ...[
      "Ouvrez le site (ou la fiche Google) sur votre téléphone et vérifiez les constats.",
      "Trouvez le prénom du gérant : page À propos, mentions légales, LinkedIn ou avis Google.",
      "Ajoutez un compliment sincère et précis à la place des crochets.",
      contact,
    ].map((t) => ({ object: "block", type: "bulleted_list_item", bulleted_list_item: { rich_text: text(t) } })),
    { object: "block", type: "heading_3", heading_3: { rich_text: text("Message prêt à envoyer") } },
    { object: "block", type: "paragraph", paragraph: { rich_text: text(`Objet : ${msg.objet}`) } },
    { object: "block", type: "code", code: { language: "plain text", rich_text: text(msg.corps) } },
    { object: "block", type: "heading_3", heading_3: { rich_text: text("Tout ce que le robot a relevé") } },
    ...p.tous.map((c) => ({
      object: "block",
      type: "bulleted_list_item",
      bulleted_list_item: { rich_text: text(c.texte) },
    })),
  ];
  const props = {
    Nom: { title: text(p.nom) },
    Statut: { select: { name: "À contacter" } },
    "Problème principal": { select: { name: p.probleme } },
    Score: { number: p.score },
    Constats: { rich_text: text(p.constats.map((c, i) => `${i + 1}. ${c}`).join("\n")) },
    Métier: { select: { name: p.metier } },
    Ville: { select: { name: p.ville.slice(0, 90) } },
    Site: { url: p.place.websiteUri || null },
    "Note Google": { number: p.place.rating ?? null },
    "Avis Google": { number: p.place.userRatingCount ?? null },
    "Fiche Google": { url: p.place.googleMapsUri || null },
    Adresse: { rich_text: text(p.place.formattedAddress) },
    Réseaux: { url: p.reseau || null },
    "Ajouté le": { date: { start: today() } },
    "Place ID": { rich_text: text(p.place.id) },
  };
  if (p.email) props["E-mail"] = { email: p.email };
  if (p.place.nationalPhoneNumber) props["Téléphone"] = { phone_number: p.place.nationalPhoneNumber };
  await notion("/pages", "POST", { parent: { database_id: DATABASE_ID }, properties: props, children });
}

async function lancer() {
  const t0 = Date.now();
  const jour = Math.floor(Date.now() / 86_400_000);
  const vus = await dejaVus();
  const journal = { recherches: [], appelsGoogle: 0, analyses: 0, ajoutes: [] };
  let restant = PAR_JOUR;

  for (let k = 0; k < RECHERCHES_PAR_JOUR && restant > 0; k++) {
    const q = recherchesDuJour(jour)[k];
    const textQuery = `${q.q} ${q.ville}`;
    let pageToken;
    // jusqu'à 3 pages de 20 résultats : les premières sont vite dans Notion,
    // les suivantes prennent le relais au fil des semaines
    for (let pageNo = 0; pageNo < 3 && restant > 0; pageNo++) {
      if (journal.appelsGoogle >= MAX_APPELS_GOOGLE || Date.now() - t0 > DUREE_MAX) break;
      const res = await places(textQuery, pageToken);
      journal.appelsGoogle++;
      const nouveaux = (res.places || []).filter((p) => {
        if (!p.id || vus.ids.has(p.id)) return false;
        if (p.businessStatus && p.businessStatus !== "OPERATIONAL") return false;
        if (!/\b06\d{3}\b/.test(p.formattedAddress || "")) return false; // Alpes-Maritimes
        if (p.websiteUri && !plateformeDe(p.websiteUri) && vus.hosts.has(hostOf(p.websiteUri))) return false;
        return true;
      });
      journal.recherches.push(`${textQuery} (page ${pageNo + 1}) : ${res.places?.length || 0} résultats, ${nouveaux.length} nouveaux`);

      // analyse par lots de 8, en parallèle
      const retenus = [];
      for (let i = 0; i < nouveaux.length; i += 8) {
        if (Date.now() - t0 > DUREE_MAX) break;
        const lot = await Promise.all(nouveaux.slice(i, i + 8).map((p) => analyser(p, q).catch(() => null)));
        journal.analyses += lot.length;
        lot.forEach((r, j) => {
          vus.ids.add(nouveaux[i + j].id); // pas réanalysé dans ce passage
          if (r && r.score >= 3) retenus.push(r);
        });
      }
      retenus.sort((a, b) => b.score - a.score);
      for (const r of retenus.slice(0, restant)) {
        await ajouter(r);
        if (r.place.websiteUri && !plateformeDe(r.place.websiteUri)) vus.hosts.add(hostOf(r.place.websiteUri));
        journal.ajoutes.push(`${r.nom} (${r.ville}, ${r.probleme}, score ${r.score})`);
        restant--;
      }
      pageToken = res.nextPageToken;
      if (!pageToken) break;
    }
  }
  journal.duree = `${Math.round((Date.now() - t0) / 1000)} s`;
  return journal;
}

export default async function handler(req, res) {
  const query = req.query || {};
  if (req.method === "GET" && "check" in query) {
    const jour = Math.floor(Date.now() / 86_400_000);
    const prochaines = recherchesDuJour(jour).map((q) => `${q.q} ${q.ville}`);
    const out = {
      notion: Boolean(TOKEN),
      google: Boolean(PLACES_KEY),
      protection: Boolean(process.env.CRON_SECRET),
      recherches_du_jour: prochaines,
    };
    if (TOKEN) {
      try {
        const db = await notion(`/databases/${DATABASE_ID}`, "GET");
        out.base = `ok : ${db.title?.[0]?.plain_text || "sans titre"}`;
      } catch (err) {
        out.base = err.message;
      }
    }
    return res.status(200).json(out);
  }

  // Lancement : réservé à Vercel (en-tête Authorization avec CRON_SECRET)
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.authorization !== `Bearer ${secret}`) return res.status(401).json({ ok: false });
  if (!TOKEN || !PLACES_KEY) {
    console.error("prospects: clé manquante", { notion: Boolean(TOKEN), google: Boolean(PLACES_KEY) });
    return res.status(200).json({ ok: false, reason: "cle_manquante" });
  }

  try {
    const journal = await lancer();
    console.log("prospects:", JSON.stringify(journal));
    return res.status(200).json({ ok: true, ...journal });
  } catch (err) {
    console.error("prospects:", err.message);
    return res.status(500).json({ ok: false, erreur: err.message });
  }
}
