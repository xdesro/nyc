const markdownIt = require("markdown-it");
const markdownItCheckbox = require("./_utils/markdown-it-checkbox");
/**
 *  @param {import("@11ty/eleventy/src/UserConfig")} eleventyConfig
 */
module.exports = (eleventyConfig) => {
  const md = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  }).use(markdownItCheckbox);

  eleventyConfig.setLibrary("md", md);

  // eleventyConfig.addAsyncShortcode("image", imageShortcode);

  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("js");
  // eleventyConfig.addPassthroughCopy({ imgProcessed: "img" });
  eleventyConfig.addPassthroughCopy("fonts");
};
