---
title: "StrikeHub: UI & Rendering"
description: Troubleshooting blank windows, WebView dependencies, connector UI not loading, and CSS/freeze issues.
nav_order: 10
parent: "StrikeHub"
---

StrikeHub uses a native WebView for rendering its UI. This guide covers display and rendering problems.

## Blank window on launch

**Symptom:** StrikeHub starts but shows a completely blank or white window.

**Possible causes:**

- **Missing WebView dependencies (Linux)** — The system doesn't have the required WebKit2GTK libraries.
- **Corrupted config** — A malformed `connectors.toml` causes the UI to fail silently.
- **GPU driver issues** — Hardware-accelerated rendering may fail on certain GPU/driver combinations.

**Debugging:**

### Linux — Install WebView dependencies

```bash
# Debian/Ubuntu
sudo apt install libwebkit2gtk-4.1-dev libgtk-3-dev

# Fedora
sudo dnf install webkit2gtk4.1-devel gtk3-devel

# Arch
sudo pacman -S webkit2gtk-4.1 gtk3
```

### Reset config

```bash
# Back up and remove the config file
mv ~/.config/strikehub/connectors.toml ~/.config/strikehub/connectors.toml.bak

# Restart — a new default config will be created
cargo run --features desktop
```

### Disable GPU acceleration

```bash
# Try running with software rendering
WEBKIT_DISABLE_COMPOSITING_MODE=1 cargo run --features desktop
```

## Connector UI not loading

**Symptom:** The sidebar shows the connector as online, but the content area is blank or shows an error.

**Possible causes:**

- **`connector://` protocol not registered** — The custom protocol handler failed to initialize.
- **Connector's Axum server not serving assets** — CSS, JS, or WASM files are missing.
- **Port/socket mismatch** — The content area is trying to load from the wrong endpoint.

**Debugging:**

```bash
# Check that the connector serves its UI
curl --unix-socket /tmp/strikehub-kubestudio.sock http://localhost/liveview

# Run with proxy tracing
RUST_LOG=sh_core::proxy=debug cargo run --features desktop
```

Look for errors related to `connector://` URL resolution:

```
sh_core::proxy: custom protocol request url="connector://kubestudio/liveview"
sh_core::proxy: forwarding to connector addr="..."
```

## CSS not loading or UI looks broken

**Symptom:** The connector UI loads but styles are missing — raw HTML or broken layout.

**Possible causes:**

- **Asset path mismatch** — The connector's `/assets/*` route isn't serving files correctly.
- **Content Security Policy** — The WebView's CSP is blocking external stylesheets.

**Debugging:**

```bash
# Check that assets are served
curl --unix-socket /tmp/strikehub-kubestudio.sock http://localhost/assets/main.css
```

If the response is `404`, the connector's asset build may not have completed. Rebuild the connector.

## UI freezes

**Symptom:** The StrikeHub window becomes unresponsive — clicks and keyboard input don't work.

**Possible causes:**

- **Main thread blocked** — A long-running operation is running on the UI thread instead of being spawned as a task.
- **WebSocket flood** — Too many messages from the WsRelay overwhelming the WebView.
- **Memory exhaustion** — The application has run out of memory.

**Debugging:**

```bash
# Check memory usage
ps aux | grep strikehub

# Run with tracing to identify blocking operations
RUST_LOG=sh_ui=trace cargo run --features desktop
```

> **Tip:** If the UI freezes consistently during a specific operation, file a bug report with the `RUST_LOG=trace` output for that operation.