# Transparence Media

## Développement

Installez le package graphviz avec yum, apt ou brew. Il contient l'outil CLI `dot` pour générer les graphiques.

```
npm install
npm run dev
```

ouvrez ensuite http://localhost:8080

## Tests

`npx jest`

## Scripts

**scripts/generateWikipedia.js**:
remplit le fichier `_data/wikipedia.json` avec des noms et des URLs d'images
wikipedia pour les entités.

**scripts/downloadImages.js**:
télécharge les images spécifiées dans `_data/wikipedia.json` vers `images/logos`

**scripts/generateCharts.js**:
Génère les diagrammes d'actionnaires finaux et détaillés dans `charts/` à partir
des entités
