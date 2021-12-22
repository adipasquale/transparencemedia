function reformatEntite(rawEntite) {
  if (!rawEntite.actionnariat) return null
  const actionnaires = rawEntite.actionnariat.actionnaires || rawEntite.actionnariat
  if (!Array.isArray(actionnaires)) return null
  return [
    rawEntite.id,
    Object.fromEntries(actionnaires.map(a => [a.id, a.part]))
  ]
}

function reformatActionnaires(rawEntites) {
  return Object.fromEntries(rawEntites.map(reformatEntite).filter(a => a))
}

function fillMissingParts(actionnaires) {
  const undefinedCount = Object.entries(actionnaires).filter(([_id, part]) => part === undefined).length
  const attributedPartPct = undefinedCount > 0 && Object.values(actionnaires).filter(i => i).reduce((a, b) => a + b, 0)
  return Object.fromEntries(
    Object.entries(actionnaires)
      .map(([id, part]) => {
        if (part === undefined) return [id, Math.round((100 - attributedPartPct) / undefinedCount)]
        else if (typeof (part) == "string") return [id, eval(part)]
        else return [id, part]
      })
  )
}

function computeActionnairesFinaux(data, id) {
  if (!id) throw Error("please pass id")
  const entite = data[id];
  if (!entite) return null;

  return Object.entries(entite).map(([actionnaireId, part]) => {
    const subActionnairesFinaux = computeActionnairesFinaux(data, actionnaireId);
    if (!subActionnairesFinaux) return [[actionnaireId, Math.round(part)]]
    return Object.entries(subActionnairesFinaux).map(([sousActionnaireId, sousPart]) => {
      return [sousActionnaireId, Math.round(((part / 100) * (sousPart / 100)) * 100)]
    })
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

module.exports = { reformatActionnaires, fillMissingParts, computeActionnairesFinaux }
