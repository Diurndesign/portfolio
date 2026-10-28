# Architecture et design system

Support pour la soutenance : comment le site est organisé, et les règles
visuelles qui le rendent cohérent. Les valeurs viennent de
`src/scss/abstracts/_variables.scss`, la source unique des tokens.

---

## 1. Architecture

### Parcours visé

Le site s'adresse d'abord à des **clients** (TPE, commerçants, architectes de
la Côte d'Azur). Il est construit pour les mener vers le contact :

```
Hero (accroche + CTA) → Projets (preuves) → À propos (confiance) → FAQ (objections) → Contact
```

Chaque section se termine par un appel à l'action : « Discutons de votre
projet », « Audit gratuit » ou « Réserver un appel ».

### Arborescence

```
/                                   Accueil (une seule page, ancres)
├── #accueil                        Hero : accroche, CTA, portrait
├── #projets                        Grille filtrable (React) → fiches en modale
├── #a-propos                       Présentation, compétences (photo), approche
├── #faq                            Questions fréquentes + avis clients
└── #contact                        Formulaire, téléphone, Calendly, réseaux
/realisations/beauty-corner         Étude de cas détaillée
/parcours                           Pitch en 6 actes (lien dans le footer)
/guides                             Hub des guides
├── /combien-coute-site-internet-nice
├── /site-sur-mesure-ou-wix-squarespace
├── /site-avec-ia-ou-developpeur
└── /refonte-site-et-charte-graphique
/audit-site-web-gratuit             Offre d'appel
/creation-site-internet-{nice,cannes,antibes,monaco}   Pages SEO locales
/graphiste-nice, /studio-design-nice                   Pages SEO métier
```

### Correspondance avec la navigation suggérée par le brief

| Suggestion | Sur le site |
|---|---|
| Accueil / Hero | `#accueil` |
| À propos (pitch) | `#a-propos` + page `/parcours` |
| Compétences | Révélées au survol / au tap sur la photo de l'À propos |
| Projets avec filtres | `#projets` (composant React) |
| Parcours | Page `/parcours` |
| Blog / Veille | Section Guides (articles) |
| Contact | `#contact` + liens sociaux dans la barre latérale |

### Navigation

- **Desktop** : deux barres latérales fixes (liens à gauche, réseaux à droite)
  pour laisser toute la largeur au contenu. La nav passe en clair sur les
  sections crème.
- **Mobile** : menu burger (`aria-expanded`), réseaux regroupés dans le menu.
- **Footer** : maillage vers les pages locales, services, guides et parcours.

---

## 2. Palette

Une palette **bichrome** : le bleu roi pour l'identité, le crème pour les
sections de lecture. Pas de couleur d'accent supplémentaire : le CTA principal
est un bouton **blanc plein** sur le bleu, qui ressort par contraste.

| Rôle | Token | Valeur | Part | Usage |
|---|---|---|---|---|
| Dominante | `$color-blue` | `#010d94` | ~45 % | Fond du hero, À propos, FAQ, contact |
| Complémentaire | `$color-cream` | `#ebe6db` | ~30 % | Section Projets, études de cas, fiches |
| Texte sur crème | `$color-ink` | `#17193a` | ~15 % | Titres et textes sur fond clair |
| Accent / CTA | `$color-white` | `#ffffff` | ~10 % | Boutons pleins, titres sur bleu |
| Succès | `$color-success` | `#8ef0c0` | ponctuel | Message « envoyé » du formulaire |
| Erreur | `$color-error` | `#ffb3b3` | ponctuel | Message d'erreur du formulaire |
| Alerte | `$color-warning` | `#ffc65c` | ponctuel | Avertissements du formulaire |

Nuances de texte : `$color-text-soft` (blanc 82 %), `$color-text-muted`
(blanc 65 %), `$color-ink-muted` (encre 70 %).

### Contrastes (WCAG)

| Combinaison | Ratio | Niveau |
|---|---|---|
| Blanc sur bleu | 14,1 : 1 | AAA |
| Blanc 82 % sur bleu | 9,6 : 1 | AAA |
| Blanc 65 % sur bleu | 6,3 : 1 | AA |
| Encre sur crème | 13,6 : 1 | AAA |
| Encre 70 % sur crème | 5,7 : 1 | AA |
| Succès / erreur sur bleu | 10,3 / 8,3 : 1 | AAA |

---

## 3. Typographie

Option « pairing classique » du brief : un **serif de caractère** pour les
titres, un **sans-serif lisible** pour le texte.

| Rôle | Police | Usage |
|---|---|---|
| Titres | **Hello Paris Serif** (200 à 700, auto-hébergée en woff2) | Hero, titres de sections, titres de fiches |
| Texte | **Inter** si installée sur l'appareil, sinon polices système (Helvetica Neue, Segoe UI, Roboto) | Paragraphes, boutons, formulaires |

Hiérarchie principale :

| Niveau | Taille | Exemple |
|---|---|---|
| Titre hero | `clamp(4.5rem, 15vw, 13rem)` | DiUrN sTudio |
| Titre de fiche | `clamp(2.5rem, 6vw, 4rem)` | Nina Carducci |
| Sous-titre | `clamp(1.4rem, 2.4vw, 1.9rem)` | Accroches |
| Texte | `0.95rem` à `1rem`, interligne 1,75 | Paragraphes |
| Surtitre | `0.72rem`, majuscules, espacement 0,18 em | « PROJET DE FORMATION » |

Les tailles en `clamp()` s'adaptent à l'écran sans media query.

---

## 4. Mise en page et composants

- **Grille** : contenu centré, largeur max `$content-max` (1180 px), barres
  latérales de 64 px.
- **Breakpoints** : 480 / 768 / 1024 px (`$bp-sm`, `$bp-md`, `$bp-lg`),
  via le mixin `until()`.
- **Mouvement** : une seule courbe `$ease` et une durée `$transition` (0,35 s)
  pour tout le site ; animations coupées si `prefers-reduced-motion`.
- **Composants** : boutons pilule (plein / contour), cartes projet avec
  survol, filtres en pilules (`aria-pressed`), modale accessible (focus piégé,
  Échap), formulaire avec états, bandeau cookies.
- **Nommage** : BEM (`.project__title`, `.card__btn`), Sass en architecture 7-1.
