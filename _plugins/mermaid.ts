/**
 * Lume plugin: render ```mermaid code blocks to SVG at build time.
 * Uses beautiful-mermaid (npm) for light/dark themed rendering.
 */
import type { Site } from "lume/core/site.ts";
import { renderMermaidSVG, parseMermaid, THEMES } from "npm:beautiful-mermaid";

const colors = {
  light: THEMES["nord-light"],
  dark: THEMES["nord"],
};

const shared = {
  transparent: true,
  font: "Inter, sans-serif",
  padding: 48,
  nodeSpacing: 32,
  layerSpacing: 48,
};

export default function mermaidPlugin() {
  return (site: Site) => {
    site.process([".md"], (pages) => {
      for (const page of pages) {
        const content = page.content as string;
        if (!content || !content.includes("language-mermaid")) continue;

        // Match <pre><code class="...language-mermaid...">CONTENT</code></pre>
        page.content = content.replace(
          /<pre><code class="[^"]*language-mermaid[^"]*">([\s\S]*?)<\/code><\/pre>/g,
          (_match, encoded: string) => {
            const source = decodeHtmlEntities(encoded).trim();
            if (!source) return _match;

            try {
              const lightSvg = renderMermaidSVG(source, { ...colors.light, ...shared });
              const darkSvg = renderMermaidSVG(source, { ...colors.dark, ...shared });

              let direction = "TD";
              try { direction = parseMermaid(source).direction; } catch { /* default */ }

              return `<div class="mermaid-diagram" data-direction="${direction}">` +
                `<div class="mermaid-light">${lightSvg}</div>` +
                `<div class="mermaid-dark">${darkSvg}</div>` +
                `</div>`;
            } catch (err) {
              console.warn(`[mermaid] Failed to render: ${(err as Error).message}`);
              return _match;
            }
          }
        );
      }
    });
  };
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}
