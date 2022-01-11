const yaml = require('js-yaml');
const fs = require('fs');
const slugify = require("slugify")

let entites = yaml.load(fs.readFileSync(`${__dirname}/../_data/entites.yaml`, 'utf8'));

const unslugify = slug => slug
  .replace(/^w:/, "")
  .replace(/_/g, " ")
  .replace(/ \(.*\)$/, "")

const getEntiteSlug = entite => slugify(unslugify(entite.id), { strict: true })
const getEntiteName = entite => unslugify(entite.id)

function reformatEntite(entite) {
  return {
    ...entite,
    wikipediaTitleSlug: entite.id.replace(/^w:/, ""),
    name: getEntiteName(entite),
    slug: getEntiteSlug(entite)
  }
}

entites = entites.map(reformatEntite)

module.exports = { entites, reformatEntite, unslugify, getEntiteSlug, getEntiteName }
