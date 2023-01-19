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

    eleventyConfig.addPassthroughCopy("css");
    eleventyConfig.addPassthroughCopy("fonts");
};
