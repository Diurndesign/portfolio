# Architecture du portfolio — Diurn Studio

Document de référence : comment le site est construit, et pourquoi. Sert à
comprendre le code et à le présenter (soutenance, entretien technique).

## 1. Vue d'ensemble

Site **multi-pages (MPA) statique**, codé main : **HTML5 sémantique**, **Sass**,
**JavaScript ES6+**, avec **un composant React ciblé** (la grille de projets
filtrable). Build avec **Vite**, déployé sur **Vercel** (domaine `diurnstudio.fr`).

Parti pris : pas de framework global pour un site surtout éditorial — React est
introduit uniquement là où il apporte une vraie valeur (interactivité du filtre),
pas partout.

## 2. Structure des dossiers

```
/                     Pages HTML (une par page : accueil + pages SEO locales)
public/               Fichiers servis tels quels : img/, favicons, sitemap.xml, robots.txt
src/
  main.js             Point d'entrée : importe le CSS et les modules JS
  modules/            Modules JavaScript vanilla (une responsabilité par fichier)
  projects/           Composant React (grille filtrable) + données
  scss/               Styles, architecture 7-1
vite.config.js        Build : entrées multi-pages + plugin d'optimisation
vercel.json           En-têtes de cache pour les assets
```

## 3. Build & déploiement

- **Vite** compile chaque page `.html` déclarée dans `build.rollupOptions.input`.
- **Minification automatique** du JS et du CSS, et **hachage** des noms de fichiers
  (cache-busting). La source reste lisible ; seul le `dist/` livré est minifié.
- **Plugin maison `optimizeHtml`** (dans `vite.config.js`) :
  1. **inline le CSS** dans le `<head>` (supprime une requête bloquant le rendu) ;
  2. **précharge les polices** utilisées au-dessus de la ligne de flottaison (LCP) ;
  3. révèle le bandeau cookies tôt pour éviter un LCP tardif.
- **Code-splitting** : React est chargé par **import dynamique**, donc seulement
  sur l'accueil. Les pages SEO restent à ~3 Ko de JS.
- **Déploiement** : un push sur `main` déclenche le build Vercel et la mise en
  ligne. `dist/` est gitignored — Vercel build depuis la source.

## 4. CSS — Sass 7-1 + BEM

Architecture **7-1** (un dossier par rôle) :

- `abstracts/` — `variables` (couleurs de marque, typo, breakpoints, transitions)
  et `mixins` (ex. `until()` pour les media queries).
- `base/` — `reset`, `fonts` (`@font-face`), styles de base, utilitaires (`.sr-only`).
- `layout/` — `navbar`, `footer`, `modal`, `consent` (bandeau cookies).
- `sections/` — `hero`, `projets`, `about`, `contact`, `murmure`, `landing`
  (pages SEO), `sections`.
- `main.scss` — orchestre les `@use` dans l'ordre.

**Nommage BEM** : `bloc__element--modificateur` (ex. `.card__btn`,
`.about__photo-reveal`, `.hero__cta--ghost`). Les couleurs et dimensions passent
par des **variables** centralisées — aucune valeur magique dispersée.

## 5. JavaScript

**Vanilla, modulaire** — chaque fichier a une seule responsabilité :

| Module | Rôle |
|---|---|
| `modal.js` | Ouverture/fermeture accessible des fiches projet (délégation d'événement, piège à focus, deep-links `#projet-…`) |
| `nav-toggle.js`, `scroll-nav.js`, `site-logo.js`, `footer-nav.js` | Navigation et comportements au défilement |
| `consent.js` | Bandeau cookies RGPD + chargement conditionnel de Google Analytics |
| `contact-form.js` | Envoi du formulaire (Web3Forms) + états de réponse |
| `about-photo.js` | Révélation des compétences au survol de la photo (clavier + tactile) |
| `murmure.js` | Section application Murmure |

**React** (`src/projects/`) — le composant significatif : la **grille de projets
filtrable**.

- `Projects.jsx` — `useState` (filtre actif), `useMemo` (liste filtrée), rendu des cartes.
- `projects.data.js` — **source unique** des projets (données).
- `mount.jsx` — montage via `createRoot`, en **import dynamique** (code-splitting).
- **Enrichissement progressif** : une grille HTML statique sert de **repli sans
  JavaScript** et de contenu indexable ; React la remplace quand il se charge.

## 6. Accessibilité

Navigation clavier avec **focus visible**, HTML **sémantique**
(`main`/`section`/`nav`/`footer`), **contrastes AA**, `alt` pertinents, formulaires
**labellisés**, ARIA avec modération, `prefers-reduced-motion` respecté. Testé avec
WAVE (0 erreur).

## 7. SEO & performance

- Par page : `<title>`, meta description, Open Graph / Twitter, `canonical`.
- **Données structurées** (JSON-LD) : `ProfessionalService`, `Person`, `FAQPage`,
  `Article`, `Service`/`Offer`.
- `sitemap.xml` + `robots.txt`.
- Perf : images **webp** + `loading="lazy"`, CSS inliné, polices préchargées,
  code-splitting.

## 8. Lancer le projet

```bash
npm install      # installe les dépendances
npm run dev      # serveur de développement
npm run build    # build de production → dist/
npm run preview  # prévisualise le build de production
```
