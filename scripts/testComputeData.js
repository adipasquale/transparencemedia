const { reformatActionnaires, fillMissingParts, computeActionnairesFinaux } = require("../lib/actionnaires")

const yaml = require('js-yaml');
const fs = require('fs');
const entites = yaml.load(fs.readFileSync('_data/entites.yaml', 'utf8'));

const data = { entites }

// console.log(entites.filter(e => e.actionnariat))
const actionnaires = Object.fromEntries(
  Object.entries(reformatActionnaires(data.entites))
    .map(([id, actionnaires]) => [id, fillMissingParts(actionnaires)])
)


const actionnairesFinaux = Object.fromEntries(
  data.entites.filter(e => e.journal).map(e => e.id)
    .map(id => [id, computeActionnairesFinaux(actionnaires, id)])
)
console.log(actionnairesFinaux)
