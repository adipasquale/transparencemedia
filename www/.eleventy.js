const yaml = require("js-yaml");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("static");
  eleventyConfig.addPassthroughCopy("charts");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));
  eleventyConfig.addNunjucksFilter("stringify", o => JSON.stringify(o));
  eleventyConfig.addNunjucksFilter("sortEntites", (entites) => {
    return entites.sort((a, b) => a.id < b.id ? -1 : 1)
  });
};
