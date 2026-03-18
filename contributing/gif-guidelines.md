---
title: GIF Guidelines
description: Standards and specifications for creating demo GIFs using VHS for Strike48 documentation.
nav_order: 1
parent: "Contributing"
---

This guide covers the technical specifications, tooling setup, and quality standards for creating demo GIFs for Strike48 documentation.

## Overview

We use [VHS](https://github.com/charmbracelet/vhs) (by Charm) to create reproducible, scriptable terminal recordings as GIFs. VHS tape scripts are version controlled alongside documentation, making it easy to regenerate GIFs when products change.

**Why GIFs over videos?**

- Auto-play inline without user interaction
- No hosting costs (served as static assets)
- Lightweight for documentation pages
- Scriptable and reproducible with VHS
- Easy to update when UI changes

## Installation

### Prerequisites

You'll need the following tools installed:

**Go** (to install VHS):
```bash
# Using mise (recommended)
mise use go@latest

# Or download from https://go.dev/dl/
```

**VHS**:
```bash
go install github.com/charmbracelet/vhs@latest

# Verify installation
vhs --version
```

**ffmpeg** (video encoding):
```bash
# Ubuntu/Debian
sudo apt install -y ffmpeg

# macOS
brew install ffmpeg

# Verify
ffmpeg -version
```

**ttyd** (terminal emulation):
```bash
# Ubuntu/Debian
sudo apt install -y ttyd

# macOS
brew install ttyd

# Verify
which ttyd
```

### Verify Setup

After installation, verify everything works:

```bash
cd strike48-labs/vhs-scripts
vhs sdk-quickstart.tape
```

If successful, you'll see `../public/gifs/sdk-quickstart.gif` generated.

## Technical Specifications

### Dimensions

**Standard size**: `1200x600` pixels

```tape
Set Width 1200
Set Height 600
```

**Rationale:**
- Wide enough to show terminal content without horizontal scrolling
- 2:1 aspect ratio fits well in documentation cards
- Mobile-friendly (scales down nicely)

**Alternative sizes:**
- Small demos: `1000x500` (for simple commands)
- Detailed workflows: `1400x700` (when extra space needed)

### File Size Limits

**Target**: Under 500KB per GIF

**Maximum**: 1MB per GIF

**If your GIF exceeds 500KB:**
1. Reduce dimensions slightly
2. Decrease typing speed (less frames)
3. Reduce sleep times (shorter duration)
4. Use lower framerate (if VHS supports it in future)

**Check file size:**
```bash
ls -lh public/gifs/your-demo.gif
```

### Theme and Styling

**Standard theme**: `Dracula`

```tape
Set Theme "Dracula"
```

**Font size**: 14-16px

```tape
Set FontSize 14
```

**Padding**: 20px for visual breathing room

```tape
Set Padding 20
```

**Available themes** (see [VHS themes](https://github.com/charmbracelet/vhs/blob/main/themes.go)):
- Dracula (default)
- Monokai
- Nord
- Catppuccin
- GitHub Dark
- One Dark

**Use Dracula unless there's a specific reason** (consistency across all demos).

### Timing

**Typing speed**: `50ms` per character

```tape
Set TypingSpeed 50ms
```

**Playback speed**: `1.0` (real-time)

```tape
Set PlaybackSpeed 1.0
```

**Sleep recommendations:**
- After Enter: `1-2s` (let output render)
- Between commands: `500ms-1s` (thinking pause)
- Before title card ends: `1-1.5s` (reading time)
- End card: `2-3s` (let final state show)

**Total duration target**: 10-30 seconds

- Under 10s: May feel rushed
- 10-20s: Ideal for focused demos
- 20-30s: Good for multi-step workflows
- Over 30s: Consider splitting into multiple GIFs

## Branding Guidelines

### Title Cards

Start each GIF with a brief title card:

```tape
Type "# Strike48 [Product] - [Feature Name]"
Sleep 1s
Enter
Enter
```

Examples:
- `# Strike48 SDK for Rust - Quick Start`
- `# StrikeHub - Launching Connectors`
- `# KubeStudio - Pod Logs`

### End Cards

Finish with a completion indicator:

```tape
Type "# ✨ Done!"
Sleep 2s
```

Or context-specific:
```tape
Type "# Your connector is ready! 🚀"
Sleep 2s
```

### Emoji Usage

**Sparingly** - Use 1-2 emojis maximum per GIF:
- ✅ Start/end cards
- ❌ Not in every command

### Color Coding

Let the Dracula theme handle syntax highlighting. Avoid manual color codes unless absolutely necessary.

## Accessibility Considerations

### Alt Text

When embedding GIFs in MediaCard, **always provide descriptive alt text** in the `description` prop:

```tsx
<MediaCard
  title="Quick Start Tutorial"
  description="Terminal walkthrough showing: cargo new my-connector, adding SDK dependency to Cargo.toml, and running cargo build."
  iconName="play-circle"
  status="available"
  mediaSrc="/gifs/sdk-quickstart.gif"
  mediaType="image"
/>
```

**Good description:**
- Describes what happens step-by-step
- Mentions key commands run
- Notes expected output

**Bad description:**
- "Video showing quick start"
- "Demo of the feature"
- Generic, non-descriptive text

### Reduced Motion

GIFs auto-play and loop, which can be problematic for users with vestibular disorders. Consider:

- **Keep motion minimal** - Avoid rapid scrolling or flashy effects
- **Smooth transitions** - Use appropriate sleep times
- **Finite content** - Don't loop infinitely on content that constantly changes

:::note[Future Enhancement]
We may add a `prefers-reduced-motion` media query to show static screenshots instead of GIFs for users who prefer reduced motion.
:::

## Content Guidelines

### Show, Don't Tell

The GIF should demonstrate the feature visually. Minimize on-screen commentary.

**Good:**
```tape
Type "cargo new my-connector --bin"
Enter
Sleep 1s
Type "cd my-connector && cargo build"
Enter
Sleep 2s
```

**Avoid:**
```tape
Type "# First, we create a new Cargo project"
Type "# This will initialize the project structure"
Type "# Now we build it"
```

Let the commands speak for themselves.

### Focus on One Thing

Each GIF should demonstrate **one feature or workflow**. If you find yourself cramming multiple features, split into multiple GIFs.

**One GIF per MediaCard.**

### Real vs. Simulated

**Prefer real commands** where possible, but you can simulate output for:
- Long-running operations (compiling, downloading)
- External services that require authentication
- Flaky network-dependent commands

**When simulating:**
```tape
Type "cargo build"
Enter
Sleep 500ms
Type "   Compiling my-connector v0.1.0"
Sleep 800ms
Type "    Finished dev [unoptimized] target(s) in 1.2s"
Sleep 1s
```

This gives the impression without actually running the command.

## Quality Checklist

Before committing your GIF, verify:

- [ ] **File size** under 500KB (max 1MB)
- [ ] **Dimensions** are 1200x600 (or approved alternative)
- [ ] **Theme** is Dracula
- [ ] **Title card** present with product name
- [ ] **Timing** feels natural (not too fast or slow)
- [ ] **Alt text** in MediaCard description is descriptive
- [ ] **No typos** in typed commands
- [ ] **Clear output** - important results are visible
- [ ] **Ends cleanly** - 2s pause before loop
- [ ] **VHS tape script** committed to `vhs-scripts/`
- [ ] **GIF output** committed to `public/gifs/`

## File Organization

### VHS Scripts

Store in `vhs-scripts/`:

```
vhs-scripts/
├── .gitignore              # Excludes build artifacts
├── sdk-quickstart.tape
├── strikehub-launch.tape
└── kubestudio-logs.tape
```

**Naming convention:** `product-feature.tape`

### GIF Output

Store in `public/gifs/`:

```
public/gifs/
├── sdk-quickstart.gif
├── strikehub-launch.gif
└── kubestudio-logs.gif
```

**Naming matches VHS script** (but `.gif` extension).

**Future:** May organize by subdirectory (`public/gifs/sdk-rs/`, `public/gifs/strikehub/`) if count grows large.

## Testing Locally

After creating your GIF:

1. **Generate the GIF:**
   ```bash
   cd vhs-scripts
   vhs your-demo.tape
   ```

2. **Verify file size:**
   ```bash
   ls -lh ../public/gifs/your-demo.gif
   ```

3. **Update MediaCard:**
   ```mdx
   <MediaCard
     title="Your Feature"
     description="..."
     iconName="..."
     status="available"
     mediaSrc="/gifs/your-demo.gif"
     mediaType="image"
   />
   ```

4. **Build and test:**
   ```bash
   npm run build
   npm run dev
   ```

5. **View in browser:**
   Navigate to the media page with your demo.

## Next Steps

- [GIF Workflow →](/contributing/gif-workflow/) - Step-by-step guide to creating GIFs
- [VHS Examples →](/contributing/vhs-examples/) - Reference tape scripts and patterns
- [Issue #92](https://github.com/Strike48/innovation_docs/issues/92) - GIF Production Pipeline Epic
