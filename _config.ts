import lume from "lume/mod.ts";
import relativeUrls from "lume/plugins/relative_urls.ts";
import nunjucks from "lume/plugins/nunjucks.ts";
import codeHighlight from "lume/plugins/code_highlight.ts";
import pagefind from "lume/plugins/pagefind.ts";
import feed from "lume/plugins/feed.ts";
import anchor from "npm:markdown-it-anchor@9";
import mermaidPlugin from "./_plugins/mermaid.ts";
import picjsPlugin from "./_plugins/picjs.ts";

const site = lume({
  src: ".",
  dest: "_site",
  location: new URL("https://docs.strike48.com"),
});

site.use(relativeUrls());
site.use(nunjucks());
site.hooks.addMarkdownItPlugin(anchor, {
  permalink: anchor.permalink.headerLink({ class: "header-anchor" }),
});
site.use(codeHighlight({
  languages: {
    "no-highlight": () => ({ name: "no-highlight", contains: [] }),
    "mermaid": () => ({ name: "mermaid", contains: [] }),
    "tape": () => ({ name: "tape", contains: [] }),
    "mdx": () => ({ name: "mdx", contains: [] }),
    "csv": () => ({ name: "csv", contains: [] }),
  },
}));
site.use(mermaidPlugin());
site.use(picjsPlugin());
site.use(pagefind());
site.use(feed({
  output: ["/feed.xml", "/feed.json"],
  query: "type=blog",
  info: {
    title: "Strike48 Lab Notes",
    description: "Product updates, engineering insights, and guides from the Strike48 team.",
  },
  items: {
    title: "=title",
    description: "=excerpt",
    published: "=date",
  },
}));

// Extract h2/h3 headings and inject TOC into rendered pages
site.process([".md", ".njk"], (pages) => {
  for (const page of pages) {
    const content = page.content as string;
    if (!content || !content.includes("data-toc")) continue;

    const headingRe = /<h([23])\s+id="([^"]+)"[^>]*>.*?<a[^>]*>([^<]+)<\/a><\/h[23]>/g;
    const headings: { level: number; id: string; text: string }[] = [];
    let m;
    while ((m = headingRe.exec(content)) !== null) {
      headings.push({ level: parseInt(m[1]), id: m[2], text: m[3] });
    }

    if (headings.length >= 2) {
      let tocHtml = `<nav class="toc-nav"><h4>On This Page</h4><ul>`;
      for (const h of headings) {
        const cls = h.level === 3 ? ` class="toc-level-3"` : "";
        tocHtml += `<li${cls}><a href="#${h.id}">${h.text}</a></li>`;
      }
      tocHtml += `</ul></nav>`;
      page.content = content.replace(
        /<nav class="toc-nav" data-toc[^>]*><\/nav>/,
        tocHtml,
      );
    }
  }
});

// Copy static assets
site.copy("assets");
site.copy("favicon.svg");

// Ignore non-content directories
site.ignore("node_modules");
site.ignore("README.md");
site.ignore("serve.ts");
site.ignore("migrate.ts");
site.ignore("_plugins");

export default site;
