# Transparence Media

> Comment sont financés les médias français ?

🌎 [transparencemedia.netlify.app](https://transparencemedia.netlify.app/)

<img width="500" alt="Screenshot 2022-01-19 at 11 03 49" src="https://user-images.githubusercontent.com/883348/150108971-253f63a5-2d44-44d3-8c9f-5490ebb9e51a.png">

## Organisation du code

- `/www` contient le code du site statique utilisant [Eleventy](https://www.11ty.dev/docs/)
- `/data` contient les données sources brutes rentrées manuellement ou téléchargées
- `/processor` contient des scripts pour convertir les données brutes en données affichables (images téléchargées, graphiques et diagrammes générés ...)

## 1. `/www` Site statique

Installez eleventy et les dépendances avec `npm install`
Puis lancez le serveur de développement avec `npm run dev` et rendez-vous sur http://localhost:8080

## 2. `/data`

- `actionnaires.yaml` contient les liens et les infos entre les entreprises et individus investissant dans les médias
- `data/autresMedias.yaml` n'est pas utilisé pour l'instant

## 3. `/processor`

- Installez le package `graphviz` avec yum, apt ou brew. Il contient l'outil CLI `dot` pour générer les graphiques.
- `npm install`
- `npm run test` lance une batterie de tests. (attention ça fait des vraies requêtes à wikipedia)
- `npm run dev` lance l'ensemble des transformations :
  - récupération automatique des urls des images depuis wikipedia
  - téléchargement de ces images
  - génération des diagrammes en camembert des actionnaires finaux
  - génération des graphes détaillés des actionnaires en DOT et en SVG
