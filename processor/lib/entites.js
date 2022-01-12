import yaml from 'js-yaml'
import fs from 'fs'
import slugify from "slugify"

import rootPath from "./rootPath.js"

let entites = yaml.load(fs.readFileSync(`${rootPath}/data/entites.yaml`, 'utf8'));

const unslugify = slug => slug
  .replace(/^w:/, "")
  .replace(/_/g, " ")
  .replace(/ \(.*\)$/, "")

const getEntiteSlug = entite => slugify(unslugify(entite.id), { strict: true })
const getEntiteName = entite => unslugify(entite.id)

function reformatEntite(entite) {
  return {
    ...entite,
    name: getEntiteName(entite),
    slug: getEntiteSlug(entite)
  }
}

entites = entites.map(reformatEntite)

export { entites, reformatEntite, unslugify }
