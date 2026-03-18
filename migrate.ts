#!/usr/bin/env -S deno run -A
/**
 * Migrate MDX content from Astro/Starlight to Lume/lumocs.
 *
 * Transformations:
 * - Strip Astro import lines
 * - Convert <Aside type="X">...</Aside> → blockquote with emoji prefix
 * - Convert <Tabs>/<TabItem> → headings with content
 * - Convert <InstallButton> → markdown link
 * - Convert <GitHubReleaseButton> → markdown link
 * - Convert <MediaCard> → simple card markup
 * - Convert :::note/:::tip/:::caution → blockquotes
 * - Fix image paths: /img/ → /assets/img/
 * - Add lumocs frontmatter (nav_order, parent)
 * - Rename .mdx → .md
 */

import { walk } from "https://deno.land/std@0.224.0/fs/walk.ts";
import { dirname, join, relative } from "https://deno.land/std@0.224.0/path/mod.ts";
import { ensureDir } from "https://deno.land/std@0.224.0/fs/ensure_dir.ts";

const SRC = "/Users/dave.thomas/code/s48/src/content/docs";
const DEST = "/Users/dave.thomas/code/s48-luma";

// Map from Astro sidebar slug to { parent, nav_order }
// Built from the sidebar.ts structure
interface NavInfo {
  parent?: string;
  nav_order: number;
}

const navMap: Record<string, NavInfo> = {
  // Top level
  "overview": { nav_order: 1 },
  "architecture": { nav_order: 2 },

  // Prospector Studio
  "prospector-studio/index": { nav_order: 1, parent: "Prospector Studio" },
  "prospector-studio/getting-started": { nav_order: 2, parent: "Prospector Studio" },
  "prospector-studio/guides/chat-interface": { nav_order: 3, parent: "Prospector Studio" },
  "prospector-studio/guides/agents": { nav_order: 4, parent: "Prospector Studio" },
  "prospector-studio/guides/knowledge-bases": { nav_order: 5, parent: "Prospector Studio" },
  "prospector-studio/guides/workflows": { nav_order: 6, parent: "Prospector Studio" },
  "prospector-studio/guides/mcp-servers": { nav_order: 7, parent: "Prospector Studio" },
  "prospector-studio/guides/connectors": { nav_order: 8, parent: "Prospector Studio" },

  // StrikeHub
  "strikehub/index": { nav_order: 1, parent: "StrikeHub" },
  "strikehub/getting-started": { nav_order: 2, parent: "StrikeHub" },
  "strikehub/guides/installation": { nav_order: 3, parent: "StrikeHub" },
  "strikehub/guides/configuration": { nav_order: 4, parent: "StrikeHub" },
  "strikehub/guides/custom-site-url": { nav_order: 5, parent: "StrikeHub" },
  "strikehub/guides/connectors": { nav_order: 6, parent: "StrikeHub" },
  "strikehub/help/debugging": { nav_order: 7, parent: "StrikeHub" },
  "strikehub/help/connectivity": { nav_order: 8, parent: "StrikeHub" },
  "strikehub/help/authentication": { nav_order: 9, parent: "StrikeHub" },
  "strikehub/help/ui-rendering": { nav_order: 10, parent: "StrikeHub" },

  // KubeStudio
  "kubestudio/index": { nav_order: 1, parent: "KubeStudio" },
  "kubestudio/getting-started": { nav_order: 2, parent: "KubeStudio" },
  "kubestudio/guides/installation": { nav_order: 3, parent: "KubeStudio" },
  "kubestudio/guides/helm": { nav_order: 4, parent: "KubeStudio" },
  "kubestudio/guides/cluster-management": { nav_order: 5, parent: "KubeStudio" },
  "kubestudio/guides/deployments": { nav_order: 6, parent: "KubeStudio" },
  "kubestudio/help/debugging": { nav_order: 7, parent: "KubeStudio" },
  "kubestudio/help/cluster-connectivity": { nav_order: 8, parent: "KubeStudio" },
  "kubestudio/help/permissions": { nav_order: 9, parent: "KubeStudio" },
  "kubestudio/help/workload-issues": { nav_order: 10, parent: "KubeStudio" },

  // Pick
  "pick/index": { nav_order: 1, parent: "Pick" },
  "pick/getting-started": { nav_order: 2, parent: "Pick" },
  "pick/architecture": { nav_order: 3, parent: "Pick" },
  "pick/getting-started/installation": { nav_order: 4, parent: "Pick" },
  "pick/getting-started/helm": { nav_order: 5, parent: "Pick" },
  "pick/getting-started/configuration": { nav_order: 6, parent: "Pick" },
  "pick/guides/marketplace": { nav_order: 7, parent: "Pick" },
  "pick/help/debugging": { nav_order: 8, parent: "Pick" },
  "pick/help/privileges": { nav_order: 9, parent: "Pick" },
  "pick/help/network-tools": { nav_order: 10, parent: "Pick" },
  "pick/help/remote-execution": { nav_order: 11, parent: "Pick" },

  // StrikeKit
  "developers/strikekit/index": { nav_order: 1, parent: "StrikeKit" },
  "developers/strikekit/user-guide/getting-started": { nav_order: 2, parent: "StrikeKit" },
  "developers/strikekit/user-guide/quick-start": { nav_order: 3, parent: "StrikeKit" },
  "developers/strikekit/user-guide/interface-overview": { nav_order: 4, parent: "StrikeKit" },
  "developers/strikekit/user-guide/workflow": { nav_order: 5, parent: "StrikeKit" },
  "developers/strikekit/features/engagements": { nav_order: 6, parent: "StrikeKit" },
  "developers/strikekit/features/planning": { nav_order: 7, parent: "StrikeKit" },
  "developers/strikekit/features/execution": { nav_order: 8, parent: "StrikeKit" },
  "developers/strikekit/features/objectives": { nav_order: 9, parent: "StrikeKit" },
  "developers/strikekit/features/targets": { nav_order: 10, parent: "StrikeKit" },
  "developers/strikekit/features/credentials": { nav_order: 11, parent: "StrikeKit" },
  "developers/strikekit/features/evidence": { nav_order: 12, parent: "StrikeKit" },
  "developers/strikekit/features/findings": { nav_order: 13, parent: "StrikeKit" },
  "developers/strikekit/features/kill-chain": { nav_order: 14, parent: "StrikeKit" },
  "developers/strikekit/features/mitre-attack": { nav_order: 15, parent: "StrikeKit" },
  "developers/strikekit/features/timeline": { nav_order: 16, parent: "StrikeKit" },
  "developers/strikekit/features/network-topology": { nav_order: 17, parent: "StrikeKit" },
  "developers/strikekit/features/c2": { nav_order: 18, parent: "StrikeKit" },
  "developers/strikekit/features/reports": { nav_order: 19, parent: "StrikeKit" },
  "developers/strikekit/features/notes": { nav_order: 20, parent: "StrikeKit" },
  "developers/strikekit/features/checklists": { nav_order: 21, parent: "StrikeKit" },
  "developers/strikekit/features/assistant": { nav_order: 22, parent: "StrikeKit" },
  "developers/strikekit/tutorials/index": { nav_order: 23, parent: "StrikeKit" },
  "developers/strikekit/tutorials/creating-your-first-engagement": { nav_order: 24, parent: "StrikeKit" },

  // For Developers
  "developers/prospector-studio/graphql-api": { nav_order: 1, parent: "For Developers" },
  "developers/sdk-rs/index": { nav_order: 2, parent: "For Developers" },
  "developers/sdk-rs/installation": { nav_order: 3, parent: "For Developers" },
  "developers/sdk-rs/quick-start": { nav_order: 4, parent: "For Developers" },
  "developers/sdk-rs/configuration": { nav_order: 5, parent: "For Developers" },
  "developers/sdk-rs/guides/building-your-first-connector": { nav_order: 6, parent: "For Developers" },
  "developers/sdk-rs/guides/testing-connectors": { nav_order: 7, parent: "For Developers" },
  "developers/sdk-rs/guides/error-handling": { nav_order: 8, parent: "For Developers" },
  "developers/sdk-rs/guides/async-patterns": { nav_order: 9, parent: "For Developers" },
  "developers/sdk-rs/guides/deployment": { nav_order: 10, parent: "For Developers" },

  // Contributing
  "contributing/gif-guidelines": { nav_order: 1, parent: "Contributing" },
  "contributing/gif-workflow": { nav_order: 2, parent: "Contributing" },
  "contributing/vhs-examples": { nav_order: 3, parent: "Contributing" },

  // Legal
  "legal/developing-with-us": { nav_order: 1, parent: "Legal" },
  "legal/privacy-policy": { nav_order: 2, parent: "Legal" },
  "legal/terms-of-use": { nav_order: 3, parent: "Legal" },

  // Blog
  "blog/welcome": { nav_order: 1, parent: "Blog" },
  "blog/2026-03-20_picjs": { nav_order: 2, parent: "Blog" },

  // Shared
  "shared/faq": { nav_order: 1, parent: "Shared" },
  "shared/troubleshooting": { nav_order: 2, parent: "Shared" },

  // Media
  "media/index": { nav_order: 1, parent: "Media" },
  "media/kubestudio": { nav_order: 2, parent: "Media" },
  "media/pick": { nav_order: 3, parent: "Media" },
  "media/sdk-rs": { nav_order: 4, parent: "Media" },
  "media/strikehub": { nav_order: 5, parent: "Media" },
  "media/strikekit": { nav_order: 6, parent: "Media" },

  // Misc
  "guides/example": { nav_order: 99 },
  "reference/example": { nav_order: 99 },
};

function convertContent(content: string, slug: string): string {
  // Split frontmatter and body
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) return content;

  let frontmatter = fmMatch[1];
  let body = fmMatch[2];

  // Add lumocs nav fields to frontmatter
  const nav = navMap[slug];
  if (nav) {
    frontmatter += `\nnav_order: ${nav.nav_order}`;
    if (nav.parent) {
      frontmatter += `\nparent: "${nav.parent}"`;
    }
  }

  // Strip import lines
  body = body.replace(/^import\s+.*?;\s*\n?/gm, "");
  body = body.replace(/^import\s+.*?(?:from\s+)?['"].*?['"]\s*\n?/gm, "");

  // Convert <Aside type="X">...</Aside> → blockquote
  body = body.replace(/<Aside\s+type="(\w+)">\s*\n?([\s\S]*?)\n?<\/Aside>/g,
    (_match, type: string, inner: string) => {
      const prefix = type === "tip" ? "**Tip:** " :
                     type === "caution" ? "**Caution:** " :
                     type === "danger" ? "**Danger:** " :
                     type === "note" ? "**Note:** " : "";
      const lines = inner.trim().split("\n").map((l: string) => `> ${l}`).join("\n");
      return `${lines.replace(/^> /, `> ${prefix}`)}`;
    }
  );

  // Convert <Tabs>/<TabItem> → headers with content
  body = body.replace(/<Tabs>\s*\n?/g, "");
  body = body.replace(/<\/Tabs>\s*\n?/g, "");
  body = body.replace(/<TabItem\s+label="([^"]*)">\s*\n?/g, "**$1:**\n\n");
  body = body.replace(/<\/TabItem>\s*\n?/g, "\n");

  // Convert <Steps>...</Steps> → just the content
  body = body.replace(/<Steps>\s*\n?/g, "");
  body = body.replace(/<\/Steps>\s*\n?/g, "");

  // Convert <InstallButton href="X" /> → link
  body = body.replace(/<InstallButton\s+href="([^"]*)"[^/]*\/>/g,
    "[**Install →**]($1)");

  // Convert <GitHubReleaseButton repo="X" /> → link
  body = body.replace(/<GitHubReleaseButton\s+repo="([^"]*)"[^/]*\/>/g,
    "[**Download latest release from GitHub →**](https://github.com/strike48-public/$1/releases)");

  // Convert <MediaCard> components → simple div
  body = body.replace(/<MediaCard\s*\n?\s*title="([^"]*)"\s*\n?\s*description="([^"]*)"\s*\n?\s*(?:iconName="[^"]*"\s*\n?\s*)?(?:video="([^"]*)"\s*\n?\s*)?\/>/g,
    (_match, title: string, desc: string, video: string) => {
      let result = `**${title}**\n\n${desc}`;
      if (video) result += `\n\n<video src="${video}" controls></video>`;
      return result;
    }
  );

  // Convert :::note/:::tip/:::caution → blockquotes
  body = body.replace(/^:::(note|tip|caution|danger)\s*\n([\s\S]*?)^:::\s*$/gm,
    (_match, type: string, inner: string) => {
      const prefix = type === "tip" ? "**Tip:** " :
                     type === "caution" ? "**Caution:** " :
                     type === "danger" ? "**Danger:** " : "**Note:** ";
      const lines = inner.trim().split("\n").map((l: string) => `> ${l}`).join("\n");
      return `${lines.replace(/^> /, `> ${prefix}`)}`;
    }
  );

  // Fix image paths: (/img/ → /assets/img/, relative paths too)
  body = body.replace(/\(\/img\//g, "(/assets/img/");
  body = body.replace(/src="\/img\//g, 'src="/assets/img/');

  // Fix gif paths
  body = body.replace(/\(\/gifs\//g, "(/assets/gifs/");
  body = body.replace(/src="\/gifs\//g, 'src="/assets/gifs/');

  // Clean up excess blank lines
  body = body.replace(/\n{4,}/g, "\n\n\n");

  return `---\n${frontmatter}\n---\n${body}`;
}

// Main migration
let count = 0;
for await (const entry of walk(SRC, { exts: [".mdx", ".md"] })) {
  const rel = relative(SRC, entry.path);
  // Convert .mdx → .md and index.mdx → index.md
  const destRel = rel.replace(/\.mdx$/, ".md");
  const destPath = join(DEST, destRel);

  // Compute slug (for nav lookup)
  const slug = destRel.replace(/\.md$/, "").replace(/\\/g, "/");

  const content = await Deno.readTextFile(entry.path);
  const converted = convertContent(content, slug);

  await ensureDir(dirname(destPath));
  await Deno.writeTextFile(destPath, converted);
  count++;
  console.log(`✓ ${slug}`);
}

console.log(`\nMigrated ${count} files.`);
