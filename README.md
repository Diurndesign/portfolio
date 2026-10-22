# Diurn Studio — Portfolio

Site vitrine de **Diurn Studio** (Jérémy Bendenoun), designer et développeur web à Nice.
En production : **[diurnstudio.fr](https://www.diurnstudio.fr)**

Site **multi-pages statique**, codé à la main : **HTML sémantique**, **Sass** et
**JavaScript ES6+**, avec **un composant React ciblé** (la grille de projets
filtrable). Build avec **Vite**, déployé sur **Vercel**.

---

## Démarrage

```bash
npm install      # dépendances
npm run dev      # serveur de développement
npm run build    # build de production → dist/
npm run preview  # prévisualise le build
```

---

## Stack & partis pris

- **Multi-pages statique (MPA)** : chaque page est un fichier HTML servi tel quel
  → rapide, robuste et excellent pour le SEO.
- **React, mais ciblé** : uniquement la grille de projets filtrable, chargée en
  **import dynamique** (les autres pages n'embarquent pas React).
- **Sass en architecture 7-1** + nommage **BEM**, variables centralisées.
- **Vite** : build, minification, hachage des assets, + deux plugins maison
  (inclusion de partials HTML, et optimisation : CSS inliné, polices préchargées).
- **Vercel** : chaque `push` sur `main` déclenche le build et la mise en ligne.

---

## Structure

```
/                     Pages HTML (accueil + pages SEO locales), une par URL
partials/             Fragments partagés : nav, footer, head (inclus via <!--#include-->)
public/               Servi tel quel : img/, favicons, sitemap.xml, robots.txt
src/
  main.js             Point d'entrée : importe le CSS et les modules JS
  modules/            Modules JavaScript vanilla (une responsabilité par fichier)
  projects/           Grille React + projects.data.js (source unique des projets)
  scss/               Styles, architecture 7-1
vite.config.js        Entrées multi-pages + plugins (partials, optimisation)
vercel.json           cleanUrls + en-têtes de cache
```

---

## Ajouter un projet

Un projet (carte **et** fiche détaillée) est décrit dans **un seul objet** de
`src/projects/projects.data.js`. La fiche (modale) est générée depuis ces données.

1. Mettre les images dans `public/img/projets/`.
2. Ajouter un objet dans `projects.data.js` (copier un bloc existant) :

```js
{
  id: "mon-projet",
  kind: "modal",                 // "modal" = fiche ; "link" = lien vers une section
  title: "Mon projet",
  cat: "Site internet",
  tags: ["web"],                 // filtres : web · identite · edition
  img: { src: "/img/projets/mon-projet.webp", alt: "…", width: 1080, height: 1080 },
  detail: {
    bg: "#efe8df",
    stack: ["React", "Sass"],
    body: ["Premier paragraphe…", "Deuxième…"],
    links: [{ href: "https://…", label: "Voir le site" }],   // optionnel
    gallery: { screens: false, images: [
      { src: "/img/projets/mon-projet-1.webp", alt: "…", width: 1200, height: 800 }
    ]}
  }
}
```

3. `git push` → Vercel déploie. La carte et la fiche apparaissent automatiquement.

---

## Qualité

- **Accessibilité** : HTML sémantique, navigation clavier, focus visible, ARIA,
  contrastes AA. WAVE : score AIM 10/10.
- **Performance** : Lighthouse 100/100/100/100, CSS inliné, polices préchargées,
  code-splitting, images webp.
- **SEO** : balisage par page, données structurées (JSON-LD), sitemap, maillage
  interne, pages locales par ville.
- **RGPD** : Google Analytics chargé uniquement après consentement.
