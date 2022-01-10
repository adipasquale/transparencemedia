const unslugify = slug => slug
  .replace(/^w:/, "")
  .replace(/_/g, " ")
  .replace(/ \(.*\)$/, "")

module.exports = { unslugify }
