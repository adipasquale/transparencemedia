const { reformatActionnaires, fillMissingParts, computeActionnairesFinaux } = require("../lib/actionnaires")

module.exports = {
  actionnairesFinaux: data => {
    const actionnaires = Object.fromEntries(
      Object.entries(reformatActionnaires(data.entites))
        .map(([id, actionnaires]) => [id, fillMissingParts(actionnaires)])
    )

    return Object.fromEntries(
      data.entites.filter(e => e.journal).map(e => e.id)
        .map(id => [id, computeActionnairesFinaux(actionnaires, id)])
    )
  }
};
