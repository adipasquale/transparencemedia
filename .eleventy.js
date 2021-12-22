const yaml = require("js-yaml");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("static");
  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));
  eleventyConfig.addNunjucksFilter(
    "unslugify",
    slug => slug
      .replace(/^w:/, "")
      .replace(/_/g, " ")
      .replace(/ \(.*\)$/, "")
  );
  eleventyConfig.addNunjucksFilter("stringify", o => JSON.stringify(o));
};
