import fs from 'fs'

import rootPath from "./rootPath.js"
import {
  computeActionnairesFinaux,
  convertEntitesToEntitesMap
} from './actionnaires.js'


function computeAllActionnairesFinaux(entites) {
  const entitesMap = convertEntitesToEntitesMap(entites)
  return Object.fromEntries(
    entites
      .filter(e => e.isMedia)
      .map(entite => ([entite.slug, Object.values(computeActionnairesFinaux(entitesMap, entite.slug) || {})]))
  )
}


async function generateActionnairesFinauxDataFile(entites) {
  const data = computeAllActionnairesFinaux(entites)
  const filename = `actionnairesFinaux.json`
  console.log(`writing data file ${filename}`)
  const path = `${rootPath}/www/_data/${filename}`;
  await fs.writeFileSync(path, JSON.stringify(data, null, 2))
}

export { generateActionnairesFinauxDataFile }
