import QuickChart from 'quickchart-js'

import rootPath from './rootPath.js'

function reformatEntite(rawEntite) {
  if (!rawEntite.actionnaires) return rawEntite
  const actionnaires = prepareActionnairesList(rawEntite.actionnaires)
  const id = rawEntite.id || rawEntite.slug
  return { ...rawEntite, id, actionnaires }
}

function prepareActionnairesList(actionnairesList) {
  // input: [{id: Jean, part: 10}, {id: Marc}]
  // output: [{id: Jean, part: 10}, {id: Marc, part: 90}]
  const undefinedCount = actionnairesList
    .filter(e => e.part === undefined)
    .length
  const attributedPartPct = undefinedCount > 0 &&
    actionnairesList
      .map(e => e.part)
      .filter(i => i)
      .reduce((a, b) => a + b, 0)
  return actionnairesList.map(actionnaire => {
    let part = actionnaire.part
    if (part === undefined)
      part = Math.round((100 - attributedPartPct) / undefinedCount)
    else if (typeof (part) == "string")
      part = eval(part)
    return { ...actionnaire, part }
  })
}

function convertEntitesToEntitesMap(rawEntites) {
  // input: [{id: "w:Le_Journal", actionnariat: ...}, {id: "w:Lautre", actionnaires: ...}]
  // output: {"w:Le_Journal": {"id": ..., actionnaires: [{..}, {...}], ...}, "w:Libe": {...}]
  return Object.fromEntries(
    rawEntites
      .map(reformatEntite)
      .map(e => [e.id, e])
  )
}

function computeActionnairesFinaux(entitesMap, id) {
  // fonction recursive pour aller chercher
  // les noeuds finaux et leurs parts dans le graphe
  if (!id) throw Error("please pass id")
  const entite = entitesMap[id];
  if (!entite || !entite.actionnaires) return null;

  return entite.actionnaires.map(({ id: actionnaireId, part }) => {
    const subresult = computeActionnairesFinaux(entitesMap, actionnaireId);
    if (!subresult) {
      const actionnaireEntite = entitesMap[actionnaireId] || { id: actionnaireId }
      return [{ ...actionnaireEntite, part: Math.round(part) }]
    }
    else {
      return Object.entries(subresult).map(([sousActionnaireId, sousActionnaire]) => {
        const { part: sousPart } = sousActionnaire
        const sousActionnaireEntite = entitesMap[sousActionnaireId] || { id: sousActionnaireId }
        const computedPart = Math.round(((part / 100) * (sousPart / 100)) * 100)
        return { ...sousActionnaireEntite, part: computedPart }
      })
    }
  }).flat()
    .reduce(
      function (acc, actionnaire) {
        const { id, part } = actionnaire
        if (!acc[id]) acc[id] = { ...actionnaire, part: 0 }
        acc[id].part += part
        return acc
      },
      {}
    )
}

async function generatePieChart(entite, entitesMap) {
  const { slug, nom } = entite
  const actionnairesFinaux = computeActionnairesFinaux(entitesMap, slug)
  if (!actionnairesFinaux) return
  const values = Object.values(actionnairesFinaux).map(a => a.part)
  const labels = Object.values(actionnairesFinaux).map(a => a.nom)
  const rest = 100 - values.reduce((a, b) => a + b, 0);
  if (rest > 0) {
    values.push(rest)
    labels.push("N/A")
  }
  const chart = new QuickChart();
  const title = `${nom} - Actionnaires finaux`
  chart.setDevicePixelRatio(2.0)
  chart.setConfig({
    type: "pie",
    data: { datasets: [{ data: values }], labels },
    options: {
      title: { display: true, text: title },
      plugins: {
        color: '#fff',
        backgroundColor: '#404040',
        datalabels: {
          formatter: (value) => {
            return value + '%';
          }
        }
      }
    }
  })
  const filename = `chart-actionnaires-finaux-${slug}.png`
  console.log(`  writing chart ${filename}`)
  await chart.toFile(`${rootPath}/www/images/charts/${filename}`);
}

async function generateAllActionnaireFinauxPieCharts(entites) {
  const entitesMap = convertEntitesToEntitesMap(entites)
  for (const entite of entites.filter(e => e.isMedia))
    await generatePieChart(entite, entitesMap)
}

export {
  convertEntitesToEntitesMap,
  prepareActionnairesList,
  computeActionnairesFinaux,
  generateAllActionnaireFinauxPieCharts
}
