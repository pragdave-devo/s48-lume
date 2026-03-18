import lume from "lume/mod.ts";
import lumocs from "https://deno.land/x/lumocs@0.2.0/mod.ts";
import pagefind from "lume/plugins/pagefind.ts";
import feed from "lume/plugins/feed.ts";
import mermaidPlugin from "./_plugins/mermaid.ts";
import picjsPlugin from "./_plugins/picjs.ts";

const site = lume({
  src: ".",
  dest: "_site",
  location: new URL("https://docs.strike48.com"),
});

site.use(lumocs());
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

// Inject author/date byline with avatars into blog posts
site.process([".md", ".njk"], (pages) => {
  for (const page of pages) {
    if (page.data.type !== "blog") continue;
    const content = page.content as string;
    if (!content) continue;

    const date = page.data.date;
    const authorIds = page.data.authors as string[] | undefined;
    const allAuthors = page.data.author_info as Record<
      string,
      { name: string; title?: string; picture?: string; url?: string }
    > | undefined;

    let dateHtml = "";
    if (date) {
      const d = new Date(date);
      const formatted = d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      dateHtml = `<time datetime="${d.toISOString().split("T")[0]}">${formatted}</time>`;
    }

    let authorsHtml = "";
    if (authorIds && allAuthors) {
      const chips = authorIds.map((id) => {
        const a = allAuthors[id];
        if (!a) return id;
        const name = a.title || a.name;
        const avatar = a.picture
          ? `<img src="${a.picture}" alt="${name}" style="width:1.5rem;height:1.5rem;border-radius:50%;vertical-align:middle;margin-right:0.35rem;">`
          : "";
        return `${avatar}${name}`;
      });
      authorsHtml = chips.join(", ");
    }

    const parts = [dateHtml, authorsHtml].filter(Boolean);
    if (parts.length > 0) {
      const byline = `<p style="opacity:0.7;font-size:0.9em;margin-bottom:1.5rem;display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap">${parts.join('<span style="opacity:0.5"> · </span>')}</p>`;
      page.content = content.replace(/<article>\s*/, `<article>\n${byline}\n`);
    }
  }
});

// Inject cookie consent banner into docs pages (pages using lumocs layout)
const cookieBannerHtml = `
<div id="cookie-banner" class="cookie-banner" role="dialog" aria-label="Cookie consent">
  <div class="cookie-inner">
    <p class="cookie-text">
      This website stores cookies on your computer to collect information about how you interact with our website. We use this information to customize content and analyze traffic. See our <a href="/legal/privacy-policy/">Cookie Policy</a>.
    </p>
    <p class="cookie-text cookie-text-small">
      If you decline, your information won't be tracked. A single cookie will remember your preference.
    </p>
    <div class="cookie-actions">
      <button id="cookie-accept" class="cookie-btn cookie-btn-accept">Accept</button>
      <button id="cookie-decline" class="cookie-btn cookie-btn-decline">Decline</button>
    </div>
  </div>
</div>
<style>
.cookie-banner{position:fixed;bottom:0;left:0;right:0;z-index:9999;background:#1e293b;border-top:1px solid #334155;box-shadow:0 -4px 20px rgba(0,0,0,0.3);padding:1.25rem 1.5rem;animation:cookie-slide-up .4s ease}
.cookie-banner[data-hidden]{display:none}
@keyframes cookie-slide-up{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
.cookie-inner{max-width:960px;margin:0 auto}
.cookie-text{color:#cbd5e1;font-size:.8125rem;line-height:1.6;margin-bottom:.5rem}
.cookie-text a{color:#60a5fa;text-decoration:underline}
.cookie-text-small{color:#94a3b8;font-size:.75rem;margin-bottom:1rem}
.cookie-actions{display:flex;gap:.75rem}
.cookie-btn{padding:.5rem 1.5rem;border-radius:.375rem;font-size:.8125rem;font-weight:600;border:none;cursor:pointer}
.cookie-btn-accept{background:#2563eb;color:#fff}
.cookie-btn-accept:hover{background:#1d4ed8}
.cookie-btn-decline{background:transparent;color:#cbd5e1;border:1px solid #475569}
.cookie-btn-decline:hover{border-color:#64748b;color:#f1f5f9}
</style>
<script src="/assets/js/cookie-consent.js"></script>`;

site.process([".md", ".njk"], (pages) => {
  for (const page of pages) {
    const content = page.content as string;
    if (!content || !content.includes("</body>")) continue;
    // Skip landing page (it already has its own cookie consent)
    if (page.data.url === "/") continue;
    page.content = content.replace("</body>", `${cookieBannerHtml}\n</body>`);
  }
});

// Activate Pagefind search UI in lumocs sidebar
site.process([".md", ".njk"], (pages) => {
  for (const page of pages) {
    const content = page.content as string;
    if (!content || !content.includes("<!--<div id=\"search\"></div>-->")) continue;
    page.content = content
      .replace(
        "<!--<div id=\"search\"></div>-->",
        `<div id="search"></div>`
      )
      .replace(
        "</head>",
        `<link href="/pagefind/pagefind-ui.css" rel="stylesheet">\n<script src="/pagefind/pagefind-ui.js"></script>\n</head>`
      )
      .replace(
        "</body>",
        `<script>new PagefindUI({element:"#search",showSubResults:true,showImages:false});</script>\n</body>`
      );
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
