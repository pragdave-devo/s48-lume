---
title: GIF Workflow
description: Step-by-step guide to creating demo GIFs with VHS for Strike48 documentation.
nav_order: 2
parent: "Contributing"
---

This guide walks you through creating a demo GIF from start to finish using VHS.

## Prerequisites

Before starting, ensure you have:

- ✅ [VHS installed and configured](/contributing/gif-guidelines/#installation)
- ✅ ffmpeg and ttyd dependencies installed
- ✅ Local clone of `strike48-labs` repository
- ✅ Familiarity with the feature you're demoing

## Workflow Overview

```mermaid
flowchart LR
    A["1. Plan"] --> B["2. Write Script"] --> C["3. Generate"] --> D["4. Optimize"] --> E["5. Embed"] --> F["6. Commit"]
```

**Estimated time:** 20-40 minutes for a simple demo

## Step 1: Plan Your Demo

Before writing any VHS script, plan what you want to show.

### Identify the Feature

Pick a MediaCard from the documentation that currently shows "Coming Soon":

- [StrikeHub Media](/media/strikehub/)
- [KubeStudio Media](/media/kubestudio/)
- [Pick Media](/media/pick/)
- [SDK-rs Media](/media/sdk-rs/)
- [StrikeKit Media](/media/strikekit/)
- [Dioxus Connector Media](/media/dioxus-connector/)

### Define the Story

Answer these questions:

1. **What does this demo show?** (One sentence)
2. **Who is the audience?** (End user? Developer?)
3. **What commands will be run?** (List them)
4. **What output is important?** (What should viewers notice?)
5. **How long should it be?** (10-30 seconds target)

**Example:**
```
Feature: SDK-rs Quick Start
Audience: Developers new to Strike48 SDK
Commands: cargo new, add dependency, cargo build
Key Output: Successful build message
Duration: ~15 seconds
```

### Prepare Your Environment

If the demo requires:
- **Real commands**: Set up a clean test environment
- **Simulated output**: Prepare the text you'll type
- **Specific state**: Document what needs to exist beforehand

## Step 2: Write the VHS Tape Script

Create a new file in `vhs-scripts/`:

```bash
cd strike48-labs/vhs-scripts
touch your-product-feature.tape
```

### Basic Template

```tape
# Product Name - Feature Name
# Brief description of what this demo shows

Output ../public/gifs/your-product-feature.gif

Require echo

Set FontSize 14
Set Width 1200
Set Height 600
Set Padding 20
Set Theme "Dracula"
Set TypingSpeed 50ms
Set PlaybackSpeed 1.0

# Title card
Type "# Strike48 Product - Feature Name"
Sleep 1s
Enter
Enter

# Demo commands here
Type "your-command"
Sleep 300ms
Enter
Sleep 1.5s

# End card
Type "# ✨ Done!"
Sleep 2s
```

### VHS Command Reference

| Command | Purpose | Example |
|---------|---------|---------|
| `Type "text"` | Type text into terminal | `Type "cargo build"` |
| `Enter` | Press Enter key | `Enter` |
| `Sleep <duration>` | Pause for duration | `Sleep 1s`, `Sleep 500ms` |
| `Set <setting> <value>` | Configure VHS | `Set Width 1200` |
| `Output <path>` | Specify output file | `Output ../public/gifs/demo.gif` |
| `Require <cmd>` | Ensure command exists | `Require cargo` |

**Full reference:** [VHS documentation](https://github.com/charmbracelet/vhs#vhs-command-reference)

### Timing Guidelines

Use these timing patterns for natural flow:

```tape
# After typing a command (before Enter)
Type "command"
Sleep 300ms    # Brief pause (user thinking)
Enter

# After Enter (let output render)
Enter
Sleep 1.5s     # Short output
Sleep 2s       # Medium output
Sleep 3s       # Long output or multiple lines

# Between unrelated commands
Type "first command"
Enter
Sleep 1.5s
Type "second command"  # Natural transition

# Title/end cards
Type "# Title"
Sleep 1s       # Reading time
Enter
```

### Quoting Rules

VHS has specific quoting requirements:

**Single quotes** for strings with double quotes inside:
```tape
Type 'echo "Hello World"'
Type 'strike48-sdk = "0.1.0"'
```

**Double quotes** for simple strings:
```tape
Type "cargo build"
Type "cd my-project"
```

**Escape sequences** - avoid if possible; use single quotes instead:
```tape
# ❌ Problematic
Type "echo \"quoted\""

# ✅ Better
Type 'echo "quoted"'
```

## Step 3: Generate the GIF

Run VHS to generate your GIF:

```bash
cd strike48-labs/vhs-scripts
vhs your-product-feature.tape
```

**What VHS does:**
1. Launches a terminal emulator (ttyd)
2. Executes your commands in sequence
3. Records the terminal output
4. Encodes to GIF using ffmpeg
5. Saves to `../public/gifs/your-product-feature.gif`

**First run takes longer** (~30-60 seconds) as VHS initializes.

### Troubleshooting Generation

**Error: "command not found"**
```
# Your script tries to run a command that doesn't exist
# Either install the tool or simulate the output
```

**Error: "Invalid command"**
```
# Usually a quoting issue
# Check your Type statements for proper quotes
```

**Error: "ffmpeg failed"**
```
# ffmpeg isn't installed or isn't in PATH
sudo apt install ffmpeg  # Ubuntu/Debian
brew install ffmpeg      # macOS
```

**Script hangs:**
```
# A command is waiting for input or not exiting
# Use Ctrl+C and review your tape script
# May need to add timeouts or simulate output instead
```

## Step 4: Optimize the GIF

Check the file size:

```bash
ls -lh ../public/gifs/your-product-feature.gif
```

**Target:** Under 500KB
**Maximum:** 1MB

### If Size is Too Large

Try these optimizations in order:

**1. Reduce timing**
```tape
# Before
Sleep 2s

# After
Sleep 1s
```

**2. Reduce dimensions**
```tape
# Before
Set Width 1200
Set Height 600

# After
Set Width 1000
Set Height 500
```

**3. Simplify the demo**
- Fewer commands
- Less output
- Shorter duration

**4. Use gifsicle (external tool)**
```bash
# Install
sudo apt install gifsicle  # Ubuntu/Debian
brew install gifsicle       # macOS

# Optimize (lossy)
gifsicle -O3 --lossy=80 -o optimized.gif original.gif

# Check savings
ls -lh original.gif optimized.gif
```

### Validate Quality

Watch your GIF to ensure:
- [ ] Commands are readable (not too fast)
- [ ] Output is visible (not cut off)
- [ ] Timing feels natural
- [ ] No flickering or glitches
- [ ] Loops smoothly

**View in browser:**
```bash
open ../public/gifs/your-product-feature.gif  # macOS
xdg-open ../public/gifs/your-product-feature.gif  # Linux
```

## Step 5: Embed in Documentation

Update the relevant MediaCard to display your GIF.

### Find the MediaCard

Locate the placeholder in the appropriate media page:

- `/src/content/docs/media/strikehub.mdx`
- `/src/content/docs/media/kubestudio.mdx`
- `/src/content/docs/media/pick.mdx`
- `/src/content/docs/media/sdk-rs.mdx`
- `/src/content/docs/media/strikekit.mdx`
- `/src/content/docs/media/dioxus-connector.mdx`

### Update the MediaCard

**Before:**
```mdx
**Your Feature**

Brief description of the feature.
```

**After:**
```mdx
<MediaCard
  title="Your Feature"
  description="Detailed step-by-step description: command 1, command 2, expected output."
  iconName="some-icon"
  status="available"
  mediaSrc="/gifs/your-product-feature.gif"
  mediaType="image"
/>
```

**Key changes:**
1. Add `status="available"` - removes "Coming Soon" badge
2. Add `mediaSrc="/gifs/your-product-feature.gif"` - path to your GIF
3. Add `mediaType="image"` - tells component it's an image (GIF)
4. **Enhance description** - make it descriptive for accessibility

### Test Locally

Build and run the dev server:

```bash
cd strike48-labs
npm run build
npm run dev
```

Navigate to the media page and verify:
- [ ] GIF displays correctly
- [ ] GIF auto-plays
- [ ] GIF loops smoothly
- [ ] Card layout looks good
- [ ] No console errors

## Step 6: Commit and Push

Once everything looks good, commit your changes:

```bash
cd strike48-labs

# Check what's changed
git status

# Stage your files
git add vhs-scripts/your-product-feature.tape
git add public/gifs/your-product-feature.gif
git add src/content/docs/media/product-name.mdx

# Commit
git commit -m "$(cat <<'EOF'
Add [Product] [Feature] demo GIF

Created demo GIF using VHS showing [brief description].

Changes:
- vhs-scripts/your-product-feature.tape - VHS recording script
- public/gifs/your-product-feature.gif - Generated GIF (XXX KB)
- src/content/docs/media/product-name.mdx - Updated MediaCard

Related: #92
EOF
)"

# Push
git push
```

**Build will run** on GitHub Actions to validate everything still builds.

## Quick Reference

### Common VHS Patterns

**Simple command with output:**
```tape
Type "command"
Sleep 300ms
Enter
Sleep 1.5s
```

**Multi-line command (using &&):**
```tape
Type "command1 && command2"
Sleep 300ms
Enter
Sleep 2s
```

**Simulated output:**
```tape
Type "long-running-command"
Enter
Sleep 500ms
Type "  Processing..."
Sleep 800ms
Type "  ✓ Done"
Sleep 1s
```

**Changing directories:**
```tape
Type "cd my-directory"
Enter
Sleep 500ms
Type "ls -la"
Enter
Sleep 1.5s
```

**Showing file contents (simulated):**
```tape
Type "cat config.toml"
Enter
Sleep 300ms
Type "[section]"
Type "key = \"value\""
Sleep 1.5s
```

### File Size Targets

| Duration | Target Size | Max Size |
|----------|-------------|----------|
| 10s | 150-250KB | 400KB |
| 15s | 200-350KB | 500KB |
| 20s | 300-450KB | 700KB |
| 30s | 400-600KB | 1MB |

## Troubleshooting

### GIF is Blurry

- Increase dimensions: `Set Width 1400` / `Set Height 700`
- Check if theme colors have good contrast

### GIF is Jerky/Choppy

- VHS may be running on slow hardware
- Try reducing terminal dimensions
- Simplify the demo (fewer commands)

### Commands Don't Execute

- Ensure commands are available in PATH
- Use `Require <command>` to verify availability
- Consider simulating output instead

### GIF Loops Awkwardly

- Add `Sleep 2s` at the end before loop restarts
- Ensure final state is stable (not mid-command)

### Build Artifacts in Git

- VHS creates real files when running commands
- Ensure `vhs-scripts/.gitignore` excludes working directories
- Only commit `.tape` scripts, not generated artifacts

## Tips and Tricks

### Speed Up Iteration

While developing your tape script:

```bash
# Edit tape
vim your-demo.tape

# Generate GIF
vhs your-demo.tape

# View immediately
xdg-open ../public/gifs/your-demo.gif

# Repeat until satisfied
```

### Reuse Common Patterns

Create a `templates/` directory with reusable snippets:

```bash
vhs-scripts/
├── templates/
│   ├── title-card.tape
│   ├── end-card.tape
│   └── settings.tape
└── your-demos.tape
```

Then copy-paste into your scripts as needed.

### Batch Generate GIFs

Create multiple tape scripts and generate all at once:

```bash
for tape in *.tape; do
  echo "Generating $tape..."
  vhs "$tape"
done
```

## Next Steps

- [GIF Guidelines →](/contributing/gif-guidelines/) - Technical specifications and standards
- [VHS Examples →](/contributing/vhs-examples/) - Reference tape scripts and patterns
- [Issue #92](https://github.com/Strike48/innovation_docs/issues/92) - Track progress on GIF pipeline
