---
title: VHS Examples
description: Reference VHS tape scripts, common patterns, and troubleshooting guide for creating demo GIFs.
nav_order: 3
parent: "Contributing"
---

This guide provides reference VHS tape scripts and common patterns you can copy and adapt for your demos.

## Complete Example Scripts

### Minimal Template

The bare minimum for a valid VHS tape:

```tape
Output ../public/gifs/minimal-demo.gif

Set Width 1200
Set Height 600

Type "echo 'Hello Strike48'"
Enter
Sleep 2s
```

### Standard Template

Recommended starting point for most demos:

```tape
# Product - Feature Name
# Brief description

Output ../public/gifs/product-feature.gif

Require echo

Set FontSize 14
Set Width 1200
Set Height 600
Set Padding 20
Set Theme "Dracula"
Set TypingSpeed 50ms
Set PlaybackSpeed 1.0

# Title
Type "# Strike48 Product - Feature"
Sleep 1s
Enter
Enter

# Demo content
Type "your-command"
Sleep 300ms
Enter
Sleep 1.5s

# Closing
Type "# ✨ Done!"
Sleep 2s
```

### CLI Tool Demo

Showing a command-line tool with flags and output:

```tape
# StrikeKit - Engagement Creation
# Demonstrates creating a new penetration testing engagement

Output ../public/gifs/strikekit-engagement-create.gif

Require echo

Set FontSize 14
Set Width 1200
Set Height 600
Set Padding 20
Set Theme "Dracula"
Set TypingSpeed 50ms
Set PlaybackSpeed 1.0

Type "# StrikeKit - Create Engagement"
Sleep 1s
Enter
Enter

Type "strikekit engagement create 'Acme Corp Pentest'"
Sleep 300ms
Enter
Sleep 1s

Type "✓ Created engagement: acme-corp-pentest"
Type "  ID: eng-a3b7c9d2"
Type "  Status: Planning"
Sleep 2s

Type "strikekit engagement list"
Sleep 300ms
Enter
Sleep 500ms

Type "ID              NAME                 STATUS      CREATED"
Type "eng-a3b7c9d2    Acme Corp Pentest    Planning    2026-03-04"
Sleep 2s

Type "# Ready to start testing 🎯"
Sleep 2s
```

### Multi-Step Workflow

Showing a series of related commands:

```tape
# SDK-rs - Project Setup and First Build
# Creating a new connector and building it

Output ../public/gifs/sdk-project-setup.gif

Require echo

Set FontSize 14
Set Width 1200
Set Height 600
Set Padding 20
Set Theme "Dracula"
Set TypingSpeed 50ms
Set PlaybackSpeed 1.0

Type "# SDK for Rust - Project Setup"
Sleep 1s
Enter
Enter

# Step 1: Create project
Type "cargo new my-connector --bin"
Sleep 300ms
Enter
Sleep 800ms
Type "     Created binary (application) package"
Sleep 1s

# Step 2: Navigate
Type "cd my-connector"
Sleep 300ms
Enter
Sleep 500ms

# Step 3: Add dependency
Type 'echo "Adding SDK dependency..."'
Sleep 300ms
Enter
Sleep 800ms

# Step 4: Build
Type "cargo build"
Sleep 300ms
Enter
Sleep 1s
Type "   Compiling my-connector v0.1.0"
Sleep 800ms
Type "    Finished dev [unoptimized] target(s) in 1.2s"
Sleep 1.5s

Type "# Project ready! 🚀"
Sleep 2s
```

### File Inspection Demo

Showing file contents (simulated):

```tape
# StrikeHub - Configuration Overview
# Viewing connector configuration

Output ../public/gifs/strikehub-config.gif

Require echo

Set FontSize 14
Set Width 1200
Set Height 600
Set Padding 20
Set Theme "Dracula"
Set TypingSpeed 50ms
Set PlaybackSpeed 1.0

Type "# StrikeHub - Configuration"
Sleep 1s
Enter
Enter

Type "cat config/strikehub.toml"
Sleep 300ms
Enter
Sleep 500ms

Type "[server]"
Type 'host = "0.0.0.0"'
Type "port = 8080"
Type ""
Type "[connectors]"
Type "auto_discover = true"
Type 'search_paths = ["~/.strikehub/connectors"]'
Sleep 2s

Type "# Configuration loaded ✓"
Sleep 2s
```

## Common Patterns

### Pattern: Command with Confirmation Prompt

Simulating interactive prompts:

```tape
Type "strikekit engagement delete eng-123"
Sleep 300ms
Enter
Sleep 800ms

Type "Are you sure? (y/N): "
Sleep 1s
Type "y"
Enter
Sleep 500ms

Type "✓ Engagement deleted"
Sleep 1.5s
```

### Pattern: Progress Indicator

Showing long-running operations:

```tape
Type "pick scan --target 192.168.1.0/24"
Sleep 300ms
Enter
Sleep 500ms

Type "Scanning... [=====>    ] 50%"
Sleep 800ms
Type "Scanning... [=========>] 90%"
Sleep 800ms
Type "✓ Scan complete - 12 hosts found"
Sleep 1.5s
```

### Pattern: Error Handling

Demonstrating error messages and recovery:

```tape
Type "kubestudio connect --cluster missing-cluster"
Sleep 300ms
Enter
Sleep 800ms

Type "✗ Error: Cluster 'missing-cluster' not found"
Type "  Available clusters:"
Type "    - prod-us-east"
Type "    - staging-eu-west"
Sleep 2s

Type "kubestudio connect --cluster prod-us-east"
Sleep 300ms
Enter
Sleep 800ms
Type "✓ Connected to prod-us-east"
Sleep 1.5s
```

### Pattern: JSON Output Formatting

Showing structured output:

```tape
Type "pick scan --target example.com --format json"
Sleep 300ms
Enter
Sleep 1s

Type "{"
Type '  "target": "example.com",'
Type '  "ports": [80, 443],'
Type '  "services": {'
Type '    "80": "http",'
Type '    "443": "https"'
Type "  }"
Type "}"
Sleep 2s
```

### Pattern: Tab Completion (Simulated)

Showing command completion:

```tape
Type "strike<Tab>"
Sleep 500ms
Type "strike48-sdk"
Sleep 300ms
Enter
Sleep 1s
```

### Pattern: Multi-Line Command

Using backslash continuation:

```tape
Type "docker run -d \\"
Sleep 200ms
Enter
Type "  --name connector \\"
Sleep 200ms
Enter
Type "  -p 8080:8080 \\"
Sleep 200ms
Enter
Type "  strike48/connector:latest"
Sleep 300ms
Enter
Sleep 1.5s

Type "✓ Connector started on port 8080"
Sleep 1.5s
```

### Pattern: Environment Variables

Showing configuration via env vars:

```tape
Type "export MATRIX_HOST=connectors.strike48.com"
Sleep 300ms
Enter
Sleep 500ms

Type "export CONNECTOR_NAME=my-scanner"
Sleep 300ms
Enter
Sleep 500ms

Type "echo $CONNECTOR_NAME"
Sleep 300ms
Enter
Sleep 500ms
Type "my-scanner"
Sleep 1.5s
```

## VHS Configuration Snippets

### Settings: Small Demo

For simple, focused demos:

```tape
Set FontSize 16
Set Width 1000
Set Height 500
Set Padding 15
```

### Settings: Detailed Demo

For complex workflows needing more space:

```tape
Set FontSize 13
Set Width 1400
Set Height 700
Set Padding 20
```

### Settings: Fast Typing

For experienced user simulation:

```tape
Set TypingSpeed 30ms
```

### Settings: Slow Typing

For tutorial-style demos:

```tape
Set TypingSpeed 80ms
```

### Settings: Alternative Themes

```tape
# Light theme
Set Theme "GitHub Light"

# Warm theme
Set Theme "Monokai"

# Cool theme
Set Theme "Nord"

# Purple theme
Set Theme "Catppuccin"
```

## Troubleshooting

### Issue: VHS Executes Real Commands

**Problem:** VHS runs actual commands, creating unwanted files/directories.

**Solution:** Simulate output instead of running commands:

```tape
# ❌ Problem: Actually creates directory
Type "cargo new my-project"
Enter

# ✅ Solution: Simulate the output
Type "cargo new my-project"
Enter
Sleep 500ms
Type "     Created binary (application) package"
```

Add these artifacts to `vhs-scripts/.gitignore`:
```
my-project/
*/target/
**/Cargo.lock
```

### Issue: Command Not Found

**Problem:** VHS tries to run a command that doesn't exist on your system.

**Solution 1:** Install the command:
```bash
cargo install strike48-sdk  # Example
```

**Solution 2:** Simulate the entire interaction:
```tape
Type "strikekit --version"
Enter
Sleep 300ms
Type "strikekit 0.5.0"
```

**Solution 3:** Use `Require` to validate prerequisites:
```tape
Require cargo
Require rustc
```

### Issue: GIF Size Too Large

**Problem:** Generated GIF exceeds 1MB.

**Solutions (in order of preference):**

1. **Reduce timing:**
   ```tape
   # Before
   Sleep 2s

   # After
   Sleep 1s
   ```

2. **Reduce dimensions:**
   ```tape
   Set Width 1000
   Set Height 500
   ```

3. **Shorten demo duration:**
   - Remove less important steps
   - Combine related commands

4. **Post-process with gifsicle:**
   ```bash
   gifsicle -O3 --lossy=80 -o output.gif input.gif
   ```

### Issue: GIF Loops Awkwardly

**Problem:** GIF cuts abruptly when looping.

**Solution:** Add a pause at the end:

```tape
Type "# Done! ✨"
Sleep 3s    # Longer pause before loop restarts
```

### Issue: Text is Unreadable

**Problem:** Font is too small or colors have poor contrast.

**Solutions:**

```tape
# Increase font size
Set FontSize 16

# Try different theme
Set Theme "GitHub Light"  # Better contrast

# Increase dimensions
Set Width 1400
Set Height 700
```

### Issue: Commands Execute Too Fast

**Problem:** Viewer can't follow what's happening.

**Solution:** Slow down typing and add more sleep:

```tape
Set TypingSpeed 80ms    # Slower typing

Type "command"
Sleep 500ms             # Longer pause before Enter
Enter
Sleep 2s                # Longer pause after output
```

### Issue: VHS Hangs During Recording

**Problem:** VHS doesn't complete; process hangs.

**Common causes:**

1. **Interactive prompt without input:**
   ```tape
   # Problem: Waits for user input
   Type "strikekit delete"
   Enter
   # Hangs here waiting for confirmation

   # Solution: Simulate the prompt
   Type "strikekit delete"
   Enter
   Sleep 500ms
   Type "Are you sure? (y/N): y"
   Enter
   ```

2. **Long-running command:**
   ```tape
   # Problem: Actually runs 5-minute build
   Type "cargo build --release"
   Enter

   # Solution: Simulate output
   Type "cargo build --release"
   Enter
   Sleep 1s
   Type "   Compiling my-project v0.1.0"
   Sleep 800ms
   Type "    Finished release [optimized] target(s) in 45.2s"
   ```

3. **Background process:**
   ```tape
   # Problem: Process doesn't exit
   Type "strikekit server start"
   Enter

   # Solution: Use & or show startup only
   Type "strikekit server start &"
   Enter
   Sleep 1s
   Type "[1] 12345"
   Type "✓ Server started on port 8080"
   ```

### Issue: Special Characters Don't Display

**Problem:** Unicode characters or emojis don't render.

**Solution:** Ensure terminal supports UTF-8:

```tape
# Usually works fine with Dracula theme
Type "✓ Success"    # Checkmark
Type "✗ Error"      # Cross
Type "⚠ Warning"    # Warning
Type "🚀 Ready"     # Emoji
```

If issues persist, use ASCII alternatives:
```tape
Type "[OK] Success"
Type "[FAIL] Error"
Type "[WARN] Warning"
```

## Best Practices Summary

### Do's ✓

- **Keep it short** - 10-30 seconds ideal
- **Focus on one feature** - One demo per MediaCard
- **Add pauses** - Let viewers read output
- **Use title cards** - Context at start
- **Simulate long operations** - Don't wait for real builds
- **Test locally** - View GIF before committing
- **Write descriptive alt text** - Accessibility matters
- **Check file size** - Under 500KB target

### Don'ts ✗

- **Don't execute destructive commands** - Simulate instead
- **Don't skip timing** - Rushed demos are confusing
- **Don't make it too long** - Split into multiple GIFs
- **Don't use real credentials** - Use fake/example data
- **Don't commit build artifacts** - Only .tape scripts and .gif output
- **Don't skip testing** - Always verify locally first
- **Don't forget alt text** - MediaCard description must be descriptive

## Additional Resources

- [VHS GitHub Repository](https://github.com/charmbracelet/vhs) - Official documentation
- [VHS Examples Gallery](https://github.com/charmbracelet/vhs/tree/main/examples) - Community examples
- [GIF Guidelines](/contributing/gif-guidelines/) - Strike48-specific standards
- [GIF Workflow](/contributing/gif-workflow/) - Step-by-step creation guide
- [Issue #92](https://github.com/Strike48/innovation_docs/issues/92) - GIF Production Pipeline Epic

## Need Help?

If you encounter issues not covered here:

1. Check the [VHS GitHub Issues](https://github.com/charmbracelet/vhs/issues)
2. Review existing `.tape` scripts in `vhs-scripts/` for patterns
3. Ask in Strike48 team chat or open a GitHub discussion

Happy recording! 🎬
