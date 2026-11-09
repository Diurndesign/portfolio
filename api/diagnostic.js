// ============================================================
//  /api/diagnostic — diagnostic express d'un site, en une minute
// ============================================================
// Appelé par src/modules/diagnostic.js (page /diagnostic-site-gratuit).
//   1. ouvre la page d'accueil du site et relève ce qui freine, avec le
//      même analyseur que le robot de prospection (api/_prospection.js) ;
//   2. en parallèle, mesure le site sur mobile avec Google PageSpeed
//      Insights (vitesse, référencement, accessibilité, bonnes pratiques) ;
//   3. calcule une note sur 100 et les 3 priorités, en mots simples ;
//   4. ajoute la demande dans la base Notion « Prospects du site »
//      (Formulaire : diagnostic) ;
//   5. si Brevo est réglé, envoie le résultat par e-mail au visiteur et,
//      s'il l'a accepté, l'inscrit à la lettre (liste Brevo).
// Le résultat s'affiche toujours à l'écran, même sans Notion ni Brevo.
//
// Réglages (Vercel, Settings, Environment Variables), tous facultatifs :
//   PAGESPEED_KEY    clé API Google PageSpeed Insights (gratuite) : sans
//                    elle, Google limite fortement le nombre de mesures
//   NOTION_TOKEN     déjà utilisé par /api/demande (ou NOTION_KEY)
//   BREVO_API_KEY    clé API Brevo : active l'envoi du résultat par e-mail
//   BREVO_LIST_ID    numéro de la liste Brevo de la lettre (inscription
//                    seulement si la case est cochée)
//   BREVO_SENDER     expéditeur validé dans Brevo (hello@diurnstudio.fr
//                    par défaut)
//
// Contrôle : GET /api/diagnostic?check=1 indique ce qui est réglé (aucune
// clé n'est montrée).

import { lookup } from "node:dns/promises";
import net from "node:net";
import { analyserPage, plateformeDe, hostOf } from "./_prospection.js";

const NOTION = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";
// Base « Prospects du site » (même base que /api/demande, identifiant public)
const DATABASE_ID = process.env.NOTION_DATABASE_ID || "fc3b659862bb47e59c288be61cbffd50";
const NOTION_TOKEN = process.env.NOTION_TOKEN || process.env.NOTION_KEY;
const PSI_KEY = process.env.PAGESPEED_KEY;
const BREVO_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST = Number(process.env.BREVO_LIST_ID) || 0;
const BREVO_SENDER = process.env.BREVO_SENDER || "hello@diurnstudio.fr";

const ALLOWED = [/^https:\/\/(www\.)?diurnstudio\.fr$/, /^https:\/\/[a-z0-9-]+\.vercel\.app$/, /^http:\/\/localhost(:\d+)?$/];
const UA = "Mozilla/5.0 (compatible; DiurnStudioDiagnostic/1.0; +https://www.diurnstudio.fr/diagnostic-site-gratuit)";
const CALENDLY = "https://calendly.com/diurnstudio/appel-decouvert";

// Anti-abus (par instance) : 3 diagnostics par 10 minutes et par adresse IP,
// et un résultat récent réutilisé pour la même adresse de site.
const hits = new Map();
const cache = new Map(); // host -> { at, data }
const CACHE_MS = 15 * 60_000;

const clean = (v, max = 300) => String(v ?? "").trim().slice(0, max);
const virgule = (n) => String(n).replace(".", ",");

// ---------------------------------------------------------------------
//  Sécurité : on n'ouvre que des sites publics (pas d'adresse interne)
// ---------------------------------------------------------------------
function ipPrivee(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    return (
      a === 0 || a === 10 || a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      a >= 224
    );
  }
  const v6 = ip.toLowerCase();
  if (v6.startsWith("::ffff:")) return ipPrivee(v6.slice(7));
  return v6 === "::" || v6 === "::1" || /^f[cd]/.test(v6) || /^fe[89ab]/.test(v6);
}

async function verifierAdresse(url) {
  if (!/^https?:$/.test(url.protocol)) throw Object.assign(new Error("protocole"), { code: "ADRESSE" });
  if (url.port && !["80", "443"].includes(url.port)) throw Object.assign(new Error("port"), { code: "ADRESSE" });
  if (url.username || url.password) throw Object.assign(new Error("identifiants"), { code: "ADRESSE" });
  const host = url.hostname.replace(/^\[|\]$/g, "");
  const ips = net.isIP(host) ? [host] : (await lookup(host, { all: true })).map((r) => r.address);
  if (!ips.length || ips.some(ipPrivee)) throw Object.assign(new Error("adresse interne"), { code: "ADRESSE" });
}

// Adresse saisie → URL complète (https:// ajouté si besoin)
export function normaliser(saisie) {
  let s = clean(saisie, 300).replace(/\s+/g, "");
  if (!s) return null;
  if (!/^https?:\/\//i.test(s)) s = "https://" + s;
  try {
    const u = new URL(s);
    if (!u.hostname.includes(".")) return null;
    u.hash = "";
    return u;
  } catch {
    return null;
  }
}

// Charge la page en suivant au plus 5 redirections, chacune vérifiée
async function charger(depart, ms = 12_000) {
  const t0 = Date.now();
  const signal = AbortSignal.timeout(ms);
  let url = depart;
  for (let i = 0; i < 6; i++) {
    await verifierAdresse(url);
    const r = await fetch(url, {
      redirect: "manual",
      signal,
      headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml", "Accept-Language": "fr-FR,fr;q=0.9" },
    });
    const loc = r.headers.get("location");
    if (r.status >= 300 && r.status < 400 && loc) {
      url = new URL(loc, url);
      continue;
    }
    const html = (await r.text()).slice(0, 800_000);
    const headers = [...r.headers.keys()].join(" ");
    return { status: r.status, html, headers, finalUrl: url.href, ms: Date.now() - t0 };
  }
  throw Object.assign(new Error("trop de redirections"), { code: "REDIRECTIONS" });
}

// ---------------------------------------------------------------------
//  Google PageSpeed Insights (mobile)
// ---------------------------------------------------------------------
const AXES_PSI = [
  ["performance", "Vitesse sur mobile"],
  ["seo", "Bases du référencement"],
  ["accessibility", "Accessibilité"],
  ["best-practices", "Bonnes pratiques"],
];

async function pagespeed(url) {
  const q = new URLSearchParams({ url, strategy: "mobile", locale: "fr" });
  AXES_PSI.forEach(([c]) => q.append("category", c));
  if (PSI_KEY) q.set("key", PSI_KEY);
  const r = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${q}`, {
    signal: AbortSignal.timeout(48_000),
  });
  if (!r.ok) throw new Error(`PageSpeed ${r.status}`);
  const json = await r.json();
  return json.lighthouseResult;
}

// Constats tirés des mesures Google, en mots simples. score = gravité.
export function constatsPagespeed(lhr) {
  const out = [];
  const a = (id) => lhr?.audits?.[id];
  const sec = (ms) => virgule(Math.round(ms / 100) / 10);

  const lcp = a("largest-contentful-paint");
  if (lcp?.numericValue > 2500)
    out.push({
      score: lcp.numericValue > 4000 ? 6 : 3,
      texte: `Sur un téléphone, le contenu principal met ${sec(lcp.numericValue)} s à s'afficher. Google recommande moins de 2,5 s, et chaque seconde de plus fait partir des visiteurs.`,
    });

  const tbt = a("total-blocking-time");
  if (tbt?.numericValue > 600)
    out.push({
      score: 3,
      texte: `La page reste figée environ ${sec(tbt.numericValue)} s pendant le chargement : un visiteur qui touche un bouton ne voit rien se passer.`,
    });

  const cls = a("cumulative-layout-shift");
  if (cls?.numericValue > 0.1)
    out.push({
      score: 2,
      texte: "Des éléments bougent pendant le chargement : le visiteur risque de toucher le mauvais bouton.",
    });

  const octets = ["uses-optimized-images", "modern-image-formats", "uses-responsive-images"]
    .map((id) => a(id)?.details?.overallSavingsBytes || 0)
    .reduce((m, v) => Math.max(m, v), 0);
  if (octets > 150_000)
    out.push({
      score: octets > 1_000_000 ? 4 : 2,
      texte: `Vos images pourraient être allégées d'environ ${octets > 1_000_000 ? virgule(Math.round(octets / 100_000) / 10) + " Mo" : Math.round(octets / 1000) + " Ko"} sans perte visible : la page s'afficherait plus vite.`,
    });

  if (a("is-crawlable")?.score === 0)
    out.push({ score: 8, texte: "La page est bloquée pour Google (balise ou fichier robots) : elle ne peut pas apparaître dans les résultats." });
  if (a("font-size")?.score === 0)
    out.push({ score: 3, texte: "Une partie du texte est trop petite pour être lue confortablement sur un téléphone." });
  if (a("tap-targets")?.score === 0)
    out.push({ score: 2, texte: "Certains boutons ou liens sont trop petits ou trop proches pour être touchés facilement au doigt." });
  if (a("color-contrast")?.score === 0)
    out.push({ score: 2, texte: "Certains textes manquent de contraste avec leur fond : ils sont difficiles à lire, surtout en plein soleil." });
  if (a("image-alt")?.score === 0)
    out.push({ score: 1, texte: "Des images n'ont pas de description : Google et les personnes malvoyantes ne savent pas ce qu'elles montrent." });
  return out;
}

// Points forts, pour un retour juste (pas seulement des reproches)
function pointsForts({ page, axes }) {
  const out = [];
  const perf = axes.find((x) => x.cle === "performance")?.note;
  if (perf >= 90) out.push("Votre site s'affiche vite sur mobile.");
  if (/^https:/i.test(page.finalUrl)) out.push("Votre site est sécurisé (cadenas https).");
  if (/<meta[^>]+name=["']?viewport/i.test(page.html)) out.push("Votre site s'adapte à l'écran des téléphones.");
  return out.slice(0, 2);
}

// ---------------------------------------------------------------------
//  Ce qu'on propose ensuite : trois cas
// ---------------------------------------------------------------------
// Les problèmes « de fond » ne se corrigent pas en une journée : site non
// adapté au mobile, daté, construit sur Wix ou équivalent, sans https.
const DE_FOND = {
  "Pas adapté au mobile": "Votre site n'est pas adapté au téléphone",
  "Site daté": "Votre site repose sur des bases datées",
  "Site Wix ou similaire": "Votre site dépend d'une plateforme (Wix ou équivalent)",
  "Site non sécurisé": "Votre site n'est pas sécurisé (pas de https)",
};

export function choisirCas(note, constatsBruts) {
  const fond = constatsBruts.find((c) => DE_FOND[c.probleme]);
  if (fond) return { cas: "refonte", motif: DE_FOND[fond.probleme] };
  if (note === null) return { cas: "journee", motif: "" }; // mesure partielle : l'appel tranchera
  if (note < 50) return { cas: "refonte", motif: "Votre site cumule trop de freins pour une simple correction" };
  if (note >= 90) return { cas: "image", motif: "" };
  return { cas: "journee", motif: "" };
}

// ---------------------------------------------------------------------
//  Diagnostic complet
// ---------------------------------------------------------------------
export async function diagnostiquer(url, { metier = "", ville = "" } = {}) {
  const [pageR, psiR] = await Promise.allSettled([charger(url), pagespeed(url.href)]);

  if (pageR.status === "rejected") {
    const code = String(pageR.reason?.code || pageR.reason?.cause?.code || pageR.reason?.name || "");
    if (code === "ADRESSE") return { erreur: "adresse" };
    if (/Timeout|Abort/i.test(code)) return { erreur: "lent" };
    return { erreur: "injoignable" };
  }
  const page = pageR.value;
  if (page.status >= 400) return { erreur: "statut", statut: page.status };

  const lhr = psiR.status === "fulfilled" ? psiR.value : null;
  if (!lhr) console.warn("diagnostic: PageSpeed indisponible", psiR.reason?.message || "");

  const brut = analyserPage({ ...page, metier, ville });
  const constatsSite = brut.map((c) => ({ score: c.score, texte: c.texte }));
  const constats = [...constatsSite, ...constatsPagespeed(lhr)].sort((x, y) => y.score - x.score);

  const axes = [];
  if (lhr)
    for (const [cle, label] of AXES_PSI) {
      const s = lhr.categories?.[cle]?.score;
      if (typeof s === "number") axes.push({ cle, label, note: Math.round(s * 100) });
    }
  // Essentiels pour un site d'entreprise : sécurité, mobile, titre, contact…
  const poids = constatsSite.reduce((t, c) => t + c.score, 0);
  axes.push({ cle: "essentiels", label: "Essentiels d'un site pro", note: Math.max(0, 100 - poids * 6) });

  // Sans la mesure Google, pas de note globale : elle ne reposerait que
  // sur les essentiels et pourrait afficher 100/100 pour un site lent.
  const note = lhr ? Math.round(axes.reduce((t, x) => t + x.note, 0) / axes.length) : null;
  const { cas, motif } = choisirCas(note, brut);
  return {
    cas,
    motif,
    site: page.finalUrl,
    host: hostOf(page.finalUrl),
    note,
    axes,
    priorites: constats.slice(0, 3).map((c) => c.texte),
    autres: constats.slice(3).map((c) => c.texte),
    pointsForts: pointsForts({ page, axes }),
    mesureGoogle: Boolean(lhr),
  };
}

// ---------------------------------------------------------------------
//  Notion : le diagnostic arrive dans « Prospects du site »
// ---------------------------------------------------------------------
async function ajouterNotion({ nom, email, lettre, envoye, page, source, d }) {
  if (!NOTION_TOKEN) return false;
  const text = (v) => (v ? [{ type: "text", text: { content: String(v).slice(0, 1900) } }] : []);
  const para = (v) => ({ object: "block", type: "paragraph", paragraph: { rich_text: text(v) } });
  const puce = (v) => ({ object: "block", type: "bulleted_list_item", bulleted_list_item: { rich_text: text(v) } });
  const r = await fetch(`${NOTION}/pages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${NOTION_TOKEN}`, "Notion-Version": NOTION_VERSION, "Content-Type": "application/json" },
    body: JSON.stringify({
      parent: { database_id: DATABASE_ID },
      properties: {
        Nom: { title: text(nom || d.host) },
        Statut: { select: { name: "Nouveau" } },
        Email: { email },
        Formulaire: { select: { name: "diagnostic" } },
        Objet: { rich_text: text(`Diagnostic ${d.note === null ? "partiel" : `${d.note}/100`}${envoye ? "" : " : résultat à envoyer par e-mail"}`) },
        "Site actuel": { url: d.site },
        Page: { rich_text: text(page) },
        Provenance: { rich_text: text(source) },
        "Reçu le": { date: { start: new Date().toISOString() } },
      },
      children: [
        para(d.note === null ? "Résultat partiel : mesure Google indisponible" : `Note globale : ${d.note}/100`),
        ...d.axes.map((x) => puce(`${x.label} : ${x.note}/100`)),
        para("Priorités montrées au visiteur :"),
        ...d.priorites.map(puce),
        ...(d.autres.length ? [para("Autres constats :"), ...d.autres.map(puce)] : []),
        para(`Proposé à la fin : ${{ image: "image de marque", journee: "journée Diurn (350 €)", refonte: "refonte" }[d.cas]}${d.motif ? ` (${d.motif})` : ""}`),
        para(`Résultat envoyé par e-mail : ${envoye ? "oui" : "non, à envoyer à la main"}`),
        para(`Lettre mensuelle : ${lettre ? "oui, acceptée" : "non"}`),
      ],
    }),
  });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error(`Notion ${r.status} : ${j.message || "erreur"}`);
  }
  return true;
}

// ---------------------------------------------------------------------
//  Brevo : résultat par e-mail, et inscription à la lettre si acceptée
// ---------------------------------------------------------------------
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// Fin de l'e-mail : la même proposition qu'à l'écran (trois cas)
const bouton = (txt) =>
  `<p style="margin:0 0 24px"><a href="${CALENDLY}" style="display:inline-block;background:#010d94;color:#ffffff;padding:12px 20px;border-radius:2px;text-decoration:none;font-weight:600">${txt}</a></p>`;
const para = (txt, petit) =>
  `<p style="margin:0 0 ${petit ? 24 : 8}px;color:${petit ? "#6b6d86" : "#17193a"};${petit ? "font-size:13px;" : ""}line-height:1.6">${txt}</p>`;

function finEmail(d) {
  if (d.cas === "image")
    return para("<strong>Votre site tient la route.</strong> S'il ne vous ressemble plus, c'est peut-être l'image qu'il faut retravailler : c'est le cœur de mon métier.", false) + "<br>" + bouton("Parlons de votre image");
  if (d.cas === "refonte")
    return (
      para(`<strong>${esc(d.motif)} : une journée ne suffira pas.</strong> Votre site a besoin d'une base saine. Une refonte sur mesure coûte de 1 500 à 3 500 €, en 3 à 6 semaines, en gardant votre nom de domaine et votre place sur Google.`, false) +
      para("Le prix exact dépend du nombre de pages : je vous le donne après un premier échange, sans engagement.", true) +
      bouton("Parlons de votre refonte")
    );
  return (
    para("<strong>Ces priorités, je peux les corriger en une journée.</strong> C'est la journée Diurn : 350 € prix fixe, et un bilan avant/après chiffré le soir même.", false) +
    para("Lors d'un court appel, je vérifie que votre site tient bien en une journée. Sinon, je vous le dis, avant tout engagement.", true) +
    bouton("Vérifier que ça tient en une journée")
  );
}

export function emailHtml(d, prenom) {
  const ligne = (x) =>
    `<tr><td style="padding:6px 0;color:#17193a">${esc(x.label)}</td><td style="padding:6px 0;text-align:right;font-weight:600;color:#010d94">${x.note}/100</td></tr>`;
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#ebe6db;font-family:Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:6px" cellpadding="0" cellspacing="0"><tr><td style="padding:32px">
<p style="margin:0 0 4px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#6b6d86">Diagnostic express · Diurn Studio</p>
<h1 style="margin:0 0 16px;font-size:24px;color:#010d94">${esc(d.host)}${d.note === null ? " : premiers constats" : ` : ${d.note}/100`}</h1>
<p style="margin:0 0 20px;color:#17193a;line-height:1.6">Bonjour${prenom ? " " + esc(prenom) : ""}, voici le résultat du diagnostic de votre site, mesuré sur mobile.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e3e0d8;border-bottom:1px solid #e3e0d8;margin-bottom:20px">${d.axes.map(ligne).join("")}</table>
<p style="margin:-8px 0 20px;color:#6b6d86;font-size:13px;line-height:1.6">« Bases du référencement » vérifie que Google peut lire et comprendre votre page. Votre position dépend aussi de votre contenu, de votre fiche Google et des sites qui parlent de vous.</p>
<h2 style="margin:0 0 8px;font-size:17px;color:#17193a">Vos 3 priorités</h2>
<ol style="margin:0 0 20px;padding-left:20px;color:#17193a;line-height:1.6">${d.priorites.map((p) => `<li style="margin-bottom:8px">${esc(p)}</li>`).join("") || "<li>Rien de bloquant relevé : bravo.</li>"}</ol>
${finEmail(d)}
<p style="margin:0;color:#6b6d86;font-size:13px;line-height:1.6">Jérémy Bendenoun · Diurn Studio · 06 50 94 96 15<br>Vous pouvez simplement répondre à cet e-mail.</p>
</td></tr></table></td></tr></table></body></html>`;
}

async function brevo(path, body) {
  const r = await fetch(`https://api.brevo.com/v3${path}`, {
    method: "POST",
    headers: { "api-key": BREVO_KEY, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  });
  if (!r.ok && r.status !== 204) {
    const j = await r.json().catch(() => ({}));
    throw new Error(`Brevo ${r.status} : ${j.message || "erreur"}`);
  }
}

async function envoyerBrevo({ email, prenom, lettre, d }) {
  if (!BREVO_KEY) return false;
  await brevo("/smtp/email", {
    sender: { name: "Jérémy · Diurn Studio", email: BREVO_SENDER },
    to: [{ email, ...(prenom ? { name: prenom } : {}) }],
    replyTo: { email: BREVO_SENDER, name: "Jérémy Bendenoun" },
    subject: d.note === null ? `Votre site ${d.host} : premiers constats` : `Votre site ${d.host} : ${d.note}/100`,
    htmlContent: emailHtml(d, prenom),
    tags: ["diagnostic"],
  });
  if (lettre && BREVO_LIST)
    await brevo("/contacts", {
      email,
      listIds: [BREVO_LIST],
      updateEnabled: true,
      attributes: { ...(prenom ? { PRENOM: prenom } : {}), SITE: d.site, NOTE_DIAGNOSTIC: d.note },
    });
  return true;
}

// ---------------------------------------------------------------------
//  Point d'entrée
// ---------------------------------------------------------------------
export default async function handler(req, res) {
  if (req.method === "GET" && "check" in (req.query || {}))
    return res.status(200).json({ pagespeed_cle: Boolean(PSI_KEY), notion: Boolean(NOTION_TOKEN), brevo: Boolean(BREVO_KEY), brevo_liste: Boolean(BREVO_LIST) });

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false });
  }
  const origin = req.headers.origin || "";
  if (!ALLOWED.some((re) => re.test(origin))) return res.status(403).json({ ok: false });

  let body = req.body || {};
  if (typeof body === "string") {
    try {
      body = JSON.parse(body || "{}");
    } catch {
      return res.status(400).json({ ok: false, erreur: "requete" });
    }
  }
  if (body.botcheck) return res.status(200).json({ ok: false, erreur: "injoignable" });

  const url = normaliser(body.site);
  if (!url) return res.status(400).json({ ok: false, erreur: "adresse" });
  if (plateformeDe(url.href)) return res.status(400).json({ ok: false, erreur: "plateforme" });

  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "inconnue";
  const now = Date.now();
  const action = body.action === "email" ? "email" : "diagnostic";
  // limites séparées : lancer un diagnostic, puis demander l'e-mail
  const cle = `${action}:${ip}`;
  const recent = (hits.get(cle) || []).filter((t) => now - t < 10 * 60_000);
  if (recent.length >= 3) return res.status(429).json({ ok: false, erreur: "trop" });
  hits.set(cle, [...recent, now]);

  const ville = clean(body.ville, 80);

  // Résultat récent réutilisé (même site) : pas de nouvelle mesure Google
  let d;
  const enCache = cache.get(url.host);
  if (enCache && now - enCache.at < CACHE_MS && !ville) d = enCache.data;
  else {
    d = await diagnostiquer(url, { ville });
    // un résultat partiel (mesure Google absente) n'est pas gardé : on réessaiera
    if (!d.erreur && d.mesureGoogle) cache.set(url.host, { at: now, data: d });
  }
  if (d.erreur) return res.status(200).json({ ok: false, ...d });

  // 1. Diagnostic : le résultat tout de suite, sans rien demander
  if (action === "diagnostic") return res.status(200).json({ ok: true, ...d });

  // 2. Le visiteur veut le résultat par e-mail : seulement maintenant, on
  //    enregistre son contact (Notion) et on lui envoie (Brevo)
  const email = clean(body.email, 200);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ ok: false, erreur: "email" });
  const prenom = clean(body.prenom, 80);
  const lettre = body.lettre === true || body.lettre === "on" || body.lettre === "true";

  const mail = await envoyerBrevo({ email, prenom, lettre, d }).catch((err) => {
    console.error("diagnostic:", err.message);
    return false;
  });
  const notion = await ajouterNotion({
    nom: prenom,
    email,
    lettre,
    envoye: mail,
    page: clean(body.page, 200) || "/diagnostic-site-gratuit",
    source: clean(body.source, 300),
    d,
  }).catch((err) => {
    console.error("diagnostic:", err.message);
    return false;
  });
  if (!mail && !notion) return res.status(200).json({ ok: false, erreur: "enregistrement" });
  return res.status(200).json({ ok: true, envoye: mail });
}
