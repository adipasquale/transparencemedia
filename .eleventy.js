const yaml = require("js-yaml");
const { unslugify } = require(`${__dirname}/lib/helpers`)

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("static");
  eleventyConfig.addPassthroughCopy("charts");
  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));
  eleventyConfig.addNunjucksFilter("unslugify", unslugify);
  eleventyConfig.addNunjucksFilter("stringify", o => JSON.stringify(o));
};
