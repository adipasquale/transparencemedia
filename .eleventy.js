const yaml = require("js-yaml");
const { unslugify, getEntiteName, getEntiteSlug } = require("./lib/entites");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("static");
  eleventyConfig.addPassthroughCopy("charts");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));
  eleventyConfig.addNunjucksFilter("unslugify", unslugify);
  eleventyConfig.addNunjucksFilter("stringify", o => JSON.stringify(o));
  eleventyConfig.addNunjucksFilter("getEntiteName", getEntiteName);
  eleventyConfig.addNunjucksFilter("getEntiteSlug", getEntiteSlug);
  eleventyConfig.addNunjucksFilter("getEntiteFilename", (entite, wikipedia) => {
    return wikipedia[entite.id]?.imageFilename
  });
  eleventyConfig.addNunjucksFilter("sortEntites", (entites) => {
    return entites.sort((a, b) => a.id < b.id ? -1 : 1)
  });
};
