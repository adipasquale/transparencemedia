import fs from 'fs'
import { exec } from 'child_process'

import rootPath from "./rootPath.js"
import { convertEntitesToEntitesMap } from "./actionnaires.js"

function edgeToDotLine(edge) {
  // ["La-voix", "Rousel", 10] => '  "La Voix" -> "Rousel" [label="10%"];'
  const [from, to, partPct] = edge
  const [fromNom, toNom] = [from, to].map(e => e.nom || e.id)
  return `  "${fromNom}" -> "${toNom}" [label="${Math.round(partPct)}%"];`
}

function edgesToDotFile(edges) {
  return `digraph G {\n${edges.map(edgeToDotLine).join("\n")}\n}`;
}

function getActionnairesGraphEdges(entitesMap, id) {
  if (!id) throw Error("please pass id")
  const rootEntite = entitesMap[id];
  if (!rootEntite || !rootEntite.actionnaires) return null;

  return rootEntite.actionnaires.map(actionnaire => {
    const { part, ...actionnaireWithoutPart } = actionnaire
    const actionnaireEntite = entitesMap[actionnaire.id] || actionnaireWithoutPart
    let lines = [[actionnaireEntite, rootEntite, part]]
    const subResult = getActionnairesGraphEdges(entitesMap, actionnaire.id);
    if (subResult)
      lines = lines.concat(subResult)
    return lines
  }).flat()
}

async function generateDotFile(entite, entitesMap) {
  const edges = getActionnairesGraphEdges(entitesMap, entite.slug)
  if (!edges) return
  const filename = `chart-graph-actionnaires-${entite.slug}.dot`
  const path = `${rootPath}/www/images/charts/${filename}`;
  console.log(`writing chart ${filename}`)
  await fs.writeFileSync(path, edgesToDotFile(edges))
}

async function generateAllDotFiles(entites) {
  const entitesMap = convertEntitesToEntitesMap(entites)

  for (const entite of entites.filter(e => e.isMedia))
    await generateDotFile(entite, entitesMap)
}

const convertDotChartsToSvg = () =>
  exec(`dot -Tsvg -O ${rootPath}/www/images/charts/*.dot`, (err) => {
    if (!err) return
    console.log(err)
    process.exit(1)
  })


export {
  edgesToDotFile,
  generateAllDotFiles,
  getActionnairesGraphEdges,
  convertDotChartsToSvg
}
