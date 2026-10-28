# Gestion de projet — Kanban du portfolio

`kanban-portfolio.csv` contient les tâches du projet, prêtes à importer dans Notion.

## Importer dans Notion

1. Notion → **Importer** → **CSV** → choisir `kanban-portfolio.csv`.
2. Dans la base créée, régler le type des propriétés :
   - `Statut` → **Statut** (ou Sélection), options dans cet ordre :
     `À faire`, `En cours`, `À tester / Valider`, `Terminé`
   - `Priorité`, `Tag`, `Phase` → **Sélection**
   - `Estimation (h)`, `Temps réel (h)` → **Nombre**
3. **+ Ajouter une vue** → **Tableau (Board)**, groupé par `Statut`.
4. Pour cocher les sous-étapes : ouvrir une carte et transformer le texte de
   `Sous-étapes` en cases à cocher (`/todo`) dans le corps de la page.

## Propriétés

| Propriété | Rôle |
|---|---|
| Statut | Colonne du Kanban |
| Priorité | Haute / Moyenne / Basse |
| Tag | Contenu, Design, Dev, SEO, Test, Déploiement, Communication, Gestion de projet |
| Estimation (h) / Temps réel (h) | Charge prévue vs constatée |
| Phase | Ordre logique du projet (1. Cadrage → 7. Diffusion) |
| Dépend de | Tâche à terminer avant (ex. écrire le contenu avant de coder) |
