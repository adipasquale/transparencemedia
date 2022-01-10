const { computeAllActionnairesFinaux } = require("../lib/actionnaires")

module.exports = {
  actionnairesFinaux: data => computeAllActionnairesFinaux(data.entites)
};
