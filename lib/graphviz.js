const fs = require('fs');
const { convertEntitesToActionnairesData } = require("./actionnaires");

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
      const path = `${__dirname}/../charts/chart-graph-actionnaires-${entite.id}.dot`;
      fs.writeFileSync(path, dotLinesToFile(dotLines))
    })
}

module.exports = {
  dotLinesToFile,
  generateAllDotFiles,
  actionnairesToDotLines
}
