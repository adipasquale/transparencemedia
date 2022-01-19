import fs from 'fs'
import slugify from "slugify"
import matter from 'gray-matter'
import yaml from "js-yaml"

import rootPath from "./rootPath.js"

let actionnaires = yaml.load(fs.readFileSync(`${rootPath}/data/actionnaires.yaml`))
let journaux = fs.readdirSync(`${rootPath}/www/journaux/`)
  .map(fn => matter(fs.readFileSync(`${rootPath}/www/journaux/${fn}`)))
  .map(gm => gm.data)
  .map(e => ({ ...e, isMedia: true }))
let entites = actionnaires.concat(journaux)

const unslugify = slug => slug
  .replace(/^w:/, "")
  .replace(/_/g, " ")
  .replace(/ \(.*\)$/, "")

const getEntiteSlug = entite => entite.slug || slugify(unslugify(entite.id), { strict: true }).toLowerCase()

function reformatEntite(entite) {
  return {
    slug: getEntiteSlug(entite),
    ...entite
  }
}

entites = entites.map(reformatEntite)

export { entites, reformatEntite, unslugify }
