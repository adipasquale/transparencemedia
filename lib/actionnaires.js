const mapObject = (obj, fn) =>
  Object.fromEntries(Object.entries(obj).map(fn))

function entiteHasActionnaires(rawEntite) {
  // Les noeuds finaux des graphes n'ont pas d'actionnaires
  return (rawEntite.actionnariat && (
    Array.isArray(rawEntite.actionnariat.actionnaires)
    || Array.isArray(rawEntite.actionnariat)
  ))
}

function entiteToActionnairesPairs(rawEntite) {
  // input: {id: "w:Le_Journal", actionnariat: [{ id: "Jean", part: 10}, ...] }
  // output: ["w:Le_Journal", {"Jean": 10, ...}] ]
  const actionnaires = rawEntite.actionnariat.actionnaires || rawEntite.actionnariat
  return [
    rawEntite.id,
    Object.fromEntries(actionnaires.map(a => [a.id, a.part]))
  ]
}

function fillActionnairesMap(actionnairesMap) {
  // input: {Jean: 10, Marc: undefined, Tom: undefined}
  // output: {Jean: 10, Marc: 45, Tom: 45}
  // or
  // input: {Jean: "7 * 3"}
  // output: {Jean: 21}
  const undefinedCount = Object.values(actionnairesMap)
    .filter(part => part === undefined)
    .length
  const attributedPartPct = undefinedCount > 0 &&
    Object.values(actionnairesMap)
      .filter(i => i)
      .reduce((a, b) => a + b, 0)
  return mapObject(actionnairesMap, ([id, part]) => {
    if (part === undefined)
      return [id, Math.round((100 - attributedPartPct) / undefinedCount)]
    else if (typeof (part) == "string")
      return [id, eval(part)]
    else return [id, part]
  })
}

function convertEntitesToActionnairesData(rawEntites) {
  // input: [{id: "w:Le_Journal", actionnariat: ...}, {id: "w:Lautre", actionnariat: ...}]
  // output: {"w:Le_Journal": [["Jean", 10], ...]], "w:Lautre": [...]}
  return Object.fromEntries(
    rawEntites
      .filter(entiteHasActionnaires)
      .map(entiteToActionnairesPairs)
      .map(([id, actionnairesMap]) => [id, fillActionnairesMap(actionnairesMap)])
  )
}

function computeActionnairesFinaux(actionnairesData, id) {
  // fonction recursive pour aller chercher
  // les noeuds finaux et leurs parts dans le graphe
  if (!id) throw Error("please pass id")
  const entite = actionnairesData[id];
  if (!entite) return null;

  return Object.entries(entite).map(([actionnaireId, part]) => {
    const subActionnairesFinaux = computeActionnairesFinaux(actionnairesData, actionnaireId);
    if (!subActionnairesFinaux)
      return [[actionnaireId, Math.round(part)]]
    else
      return Object.entries(subActionnairesFinaux).map(([sousActionnaireId, sousPart]) =>
        ([sousActionnaireId, Math.round(((part / 100) * (sousPart / 100)) * 100)])
      )
  }).flat()
    .reduce(
      function (acc, val) {
        const [id, part] = val
        acc[id] = (acc[id] || 0) + part
        return acc
      },
      {}
    )
}

function computeAllActionnairesFinaux(rawEntites) {
  const actionnairesData = convertEntitesToActionnairesData(rawEntites)

  return Object.fromEntries(
    rawEntites.filter(e => e.journal).map(e => e.id)
      .map(id => [id, computeActionnairesFinaux(actionnairesData, id)])
  )
}

module.exports = {
  convertEntitesToActionnairesData,
  fillActionnairesMap,
  computeActionnairesFinaux,
  computeAllActionnairesFinaux
}
