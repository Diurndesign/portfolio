# Diurn Studio — Portfolio

Portfolio de **Diurn Studio**, développeur créatif & designer graphique à Nice.
Site single-page en **HTML + SCSS**, servi par **Vite**.

## Démarrage

```bash
npm install      # installe les dépendances (Vite + Sass)
npm run dev      # serveur de dev → http://localhost:5173
npm run build    # build de production dans dist/
npm run preview  # prévisualise le build
```

## Structure

```
portfolio/
├── index.html              # markup (navbar + hero + sections)
├── vite.config.js
├── public/
│   └── img/
│       └── portrait.svg    # ⚠️ placeholder — remplace par ta vraie photo
└── src/
    ├── main.js             # point d'entrée (importe le SCSS)
    ├── fonts/              # Hello Paris (woff2)
    └── scss/               # architecture 7-1 simplifiée
        ├── main.scss       # point d'entrée SCSS
        ├── abstracts/      # _variables, _mixins
        ├── base/           # _fonts, _reset, _base
        ├── layout/         # _navbar
        └── sections/       # _hero, _sections
```

## À faire ensuite

- **Portrait** : remplacer `public/img/portrait.svg` par ta photo
  (mets à jour le `src` de `<img>` dans `index.html` si tu utilises un `.jpg`).
- Développer les sections **Projets**, **Créations**, **À propos**, **Contact**
  (actuellement des placeholders).
- Ajouter les vrais liens Instagram / Github dans la navbar.

## Personnalisation rapide

- Couleur de fond, polices, largeurs : `src/scss/abstracts/_variables.scss`.
