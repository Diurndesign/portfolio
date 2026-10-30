// ============================================================
//  /api/lead — chaque demande du site arrive dans Notion
// ============================================================
// Fonction serveur Vercel appelée par src/modules/contact-form.js, en
// parallèle de l'envoi Web3Forms (l'e-mail de notification) : si l'un
// des deux échoue, la demande n'est pas perdue.
//
// Réglages (Vercel, Settings, Environment Variables) :
//   NOTION_TOKEN    clé de l'intégration Notion (ou NOTION_KEY)
//   NOTION_PAGE_ID  (facultatif) page Notion partagée avec l'intégration ;
//                   par défaut la page « Diurn studio ». La base
//                   « Prospects du site » y est créée à la première demande
//   NOTION_DATABASE_ID (facultatif) pour viser une base existante

const NOTION = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";
const DB_TITLE = "Prospects du site";

// Domaines autorisés à envoyer une demande (site, prévisualisations, local)
const ALLOWED = [/^https:\/\/(www\.)?diurnstudio\.fr$/, /^https:\/\/[a-z0-9-]+\.vercel\.app$/, /^http:\/\/localhost(:\d+)?$/];

const STATUTS = [
  ["Nouveau", "blue"],
  ["Contacté", "yellow"],
  ["Appel fait", "orange"],
  ["Devis envoyé", "purple"],
  ["Signé", "green"],
  ["Perdu", "gray"],
];

// Page Notion « Diurn studio » (identifiant public, pas un secret)
const PAGE_ID = process.env.NOTION_PAGE_ID || "4017472ce4448019b9afc5b6ad540d02";

// Base « Prospects du site », créée dans cette page (identifiant public)
const DATABASE_ID = process.env.NOTION_DATABASE_ID || "fc3b659862bb47e59c288be61cbffd50";
const TOKEN = process.env.NOTION_TOKEN || process.env.NOTION_KEY;

let databaseId = DATABASE_ID;
const hits = new Map(); // anti-abus simple : adresse IP -> horodatages récents

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

// Base « Prospects du site » : retrouvée dans la page, sinon créée
async function getDatabase() {
  if (databaseId) return databaseId;
  // accepte l'identifiant seul ou le lien complet de la page Notion
  const page = PAGE_ID.split("?")[0].replace(/-/g, "").slice(-32);
  const children = await notion(`/blocks/${page}/children?page_size=100`, "GET");
  const found = children.results.find((b) => b.type === "child_database" && b.child_database.title === DB_TITLE);
  if (found) return (databaseId = found.id);

  const db = await notion("/databases", "POST", {
    parent: { type: "page_id", page_id: page },
    title: [{ type: "text", text: { content: DB_TITLE } }],
    properties: {
      Nom: { title: {} },
      Statut: { select: { options: STATUTS.map(([name, color]) => ({ name, color })) } },
      Email: { email: {} },
      Formulaire: { select: { options: [{ name: "contact" }, { name: "devis" }, { name: "audit" }] } },
      Objet: { rich_text: {} },
      "Site actuel": { url: {} },
      Entreprise: { rich_text: {} },
      Page: { rich_text: {} },
      Provenance: { rich_text: {} },
      "Reçu le": { date: {} },
      "Montant du devis": { number: { format: "euro" } },
      Relance: { date: {} },
    },
  });
  return (databaseId = db.id);
}

const clean = (v, max = 300) => String(v ?? "").trim().slice(0, max);
const text = (v) => (v ? [{ type: "text", text: { content: v } }] : []);

// Message découpé en paragraphes (Notion limite un bloc à 2 000 caractères)
function messageBlocks(message) {
  return message
    .split(/\n{2,}/)
    .flatMap((p) => p.match(/[\s\S]{1,1900}/g) || [])
    .slice(0, 40)
    .map((p) => ({ object: "block", type: "paragraph", paragraph: { rich_text: text(p) } }));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false });
  }
  const origin = req.headers.origin || "";
  if (!ALLOWED.some((re) => re.test(origin))) return res.status(403).json({ ok: false });

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  // pot de miel : un robot coche la case cachée, on fait semblant d'accepter
  if (body.botcheck) return res.status(200).json({ ok: true });

  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "inconnue";
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  if (recent.length >= 5) return res.status(429).json({ ok: false });
  hits.set(ip, [...recent, now]);

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ ok: false });

  if (!TOKEN) {
    return res.status(200).json({ ok: false, reason: "notion_non_configure" });
  }

  const website = clean(body.website, 300);
  const formName = clean(body.form_name, 30) || "contact";
  try {
    const db = await getDatabase();
    await notion("/pages", "POST", {
      parent: { database_id: db },
      properties: {
        Nom: { title: text(name) },
        Statut: { select: { name: "Nouveau" } },
        Email: { email },
        Formulaire: { select: { name: formName } },
        Objet: { rich_text: text(clean(body.subject, 300)) },
        "Site actuel": { url: /^https?:\/\//i.test(website) ? website : null },
        Entreprise: { rich_text: text(clean(body.company, 200)) },
        Page: { rich_text: text(clean(body.page, 200)) },
        Provenance: { rich_text: text(clean(body.source, 300)) },
        "Reçu le": { date: { start: new Date().toISOString() } },
      },
      children: messageBlocks(clean(body.message, 20000)),
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("lead:", err.message);
    // base supprimée ou déplacée : on la recherchera à la prochaine demande
    databaseId = "";
    return res.status(502).json({ ok: false });
  }
}
