import fs from 'fs'
import slugify from "slugify"

import rootPath from "./rootPath.js"
import matter from 'gray-matter'

let actionnaires = JSON.parse(fs.readFileSync(`${rootPath}/data/actionnaires.json`))
let journaux = fs.readdirSync(`${rootPath}/www/journaux/`)
  .map(fn => matter(fs.readFileSync(`${rootPath}/www/journaux/${fn}`)))
  .map(gm => gm.data)
// console.log("actionnaires", actionnaires)
// console.log("journaux", journaux)
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
