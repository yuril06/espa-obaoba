// Espaço Baobá: the home page, the blog and the /admin panel.
// Posts are Markdown files in blog/posts, written by the school through Decap CMS.
export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.ignores.add("admin/**");
  eleventyConfig.ignores.add(".taste-skill/**");
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("LEIA-ME.md");

  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("blog/posts/*.md").sort((a, b) => b.date - a.date)
  );

  const dateBR = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  eleventyConfig.addFilter("dataBR", (d) => dateBR.format(new Date(d)));
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("readingTime", (html = "") =>
    Math.max(1, Math.round(html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length / 200))
  );
  eleventyConfig.addFilter("waLink", (text, number) =>
    `https://wa.me/${number}?text=${encodeURIComponent(text)}`
  );
  eleventyConfig.addFilter("head", (list, n) => list.slice(0, n));
  eleventyConfig.addFilter("exclude", (list, url) => list.filter((p) => p.url !== url));

  return {
    dir: { input: ".", includes: "_includes", data: "_data", output: "_site" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["html", "njk", "md"],
  };
}
