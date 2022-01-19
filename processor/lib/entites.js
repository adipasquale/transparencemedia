import fs from 'fs'
import slugify from "slugify"
import matter from 'gray-matter'
import yaml from "js-yaml"

import rootPath from "./rootPath.js"

let actionnaires = yaml.load(fs.readFileSync(`${rootPath}/data/actionnaires.yaml`))
let journaux = fs.readdirSync(`${rootPath}/www/journaux/`)
  .map(fn => matter(fs.readFileSync(`${rootPath}/www/journaux/${fn}`)))
  .map(gm => gm.data)
let entites = actionnaires.concat(journaux)

const unslugify = slug => slug
  .replace(/^w:/, "")
  .replace(/_/g, " ")
  .replace(/ \(.*\)$/, "")

const getEntiteSlug = entite => slugify(unslugify(entite.id), { strict: true }).toLowerCase()
const getEntiteName = entite => unslugify(entite.id)

function reformatEntite(entite) {
  return {
    ...entite,
    name: getEntiteName(entite),
    slug: getEntiteSlug(entite)
  }
}

entites = entites.map(reformatEntite)
console.log(entites)

export { entites, reformatEntite, unslugify }
