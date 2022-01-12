import fs from 'fs'
import { exec } from 'child_process'

import rootPath from "./rootPath.js"
import { convertEntitesToActionnairesData } from "./actionnaires.js"

function formatDotLine(dotLine) {
  // ["La-voix", "Rousel", 10] => '  "La Voix" -> "Rousel" [label="10%"];'
  const [from, to, partPct] = dotLine
  return `  "${from}" -> "${to}" [label="${Math.round(partPct)}%"];`
}

function dotLinesToFile(dotLines) {
  return `digraph G {\n${dotLines.map(formatDotLine).join("\n")}\n}`;
}

function actionnairesToDotLines(actionnairesData, id) {
  if (!id) throw Error("please pass id")
  const entite = actionnairesData[id];
  if (!entite) return null;

  return Object.entries(entite).map(([actionnaireId, part]) => {
    let lines = [[actionnaireId, id, part]]
    const subResult = actionnairesToDotLines(actionnairesData, actionnaireId);
    if (subResult)
      lines = lines.concat(subResult)
    return lines
  }).flat()
}

function generateAllDotFiles(rawEntites) {
  const actionnairesData = convertEntitesToActionnairesData(rawEntites)

  rawEntites
    .filter(e => e.journal)
    .forEach(entite => {
      const dotLines = actionnairesToDotLines(actionnairesData, entite.id)
      if (!dotLines) return
      const path = `${rootPath}/images/charts/chart-graph-actionnaires-${entite.id}.dot`;
      fs.writeFileSync(path, dotLinesToFile(dotLines))
    })
}

const convertDotChartsToSvg = () =>
  exec(`dot -Tsvg -O ${rootPath}/images/charts/*.dot`, (err) => {
    if (!err) return
    console.log(err)
    process.exit(1)
  })


export {
  dotLinesToFile,
  generateAllDotFiles,
  actionnairesToDotLines,
  convertDotChartsToSvg
}
