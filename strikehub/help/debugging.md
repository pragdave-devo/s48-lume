---
title: "StrikeHub: Debug Logging"
description: Setting up RUST_LOG, per-crate targeting, log analysis, and collecting logs for bug reports.
nav_order: 7
parent: "StrikeHub"
---

StrikeHub is a Rust application and uses the `tracing` ecosystem for structured logging. All log output is controlled via the `RUST_LOG` environment variable.

## Enabling debug logs

Set `RUST_LOG` before launching StrikeHub:

```bash
RUST_LOG=debug cargo run --features desktop
```

For more granular output:

```bash
RUST_LOG=trace cargo run --features desktop
```

## Per-crate log targeting

StrikeHub is split into several crates. Target specific crates to reduce noise:

```bash
# Core logic only
RUST_LOG=sh_core=debug cargo run --features desktop

# UI layer only
RUST_LOG=sh_ui=debug cargo run --features desktop

# Multiple crates
RUST_LOG=sh_core=debug,sh_ui=info cargo run --features desktop
```

Common crate targets:

| Crate | What it covers |
|-------|---------------|
| `sh_core` | Config loading, IPC runner, auth, proxy, WebSocket relay |
| `sh_ui` | Dioxus desktop UI components, sidebar, content area |
| `hyper` | HTTP-level request/response details |
| `tungstenite` | WebSocket frame-level details |

## Analyzing log output

### Connector lifecycle events

Look for these key log lines when debugging connector issues:

```
# Connector discovery
sh_core::runner: discovering connectors from config

# Health check results
sh_core::runner: health check connector="kubestudio" status=online
sh_core::runner: health check connector="pick" status=offline

# IPC connection
sh_core::ipc: connecting to socket path="/tmp/strikehub-kubestudio.sock"
```

### Authentication events

```
# OIDC flow
sh_core::auth: starting OIDC flow
sh_core::auth: token received, injecting into connector HTML

# Failures
sh_core::auth: OIDC callback error err="..."
```

### WebSocket relay

```
# WsRelay bridge events
sh_core::ws_relay: relay started port=9090
sh_core::ws_relay: client connected
sh_core::ws_relay: client disconnected reason="..."
```

## Collecting logs for bug reports

1. Run StrikeHub with debug logging and redirect output to a file:

```bash
RUST_LOG=debug cargo run --features desktop 2>&1 | tee strikehub-debug.log
```

2. Reproduce the issue.

3. Stop StrikeHub and attach `strikehub-debug.log` to your bug report.

> **Tip:** Strip any sensitive data (tokens, passwords, internal hostnames) from log files before sharing.
> **Note:** For connector-specific logging, see the debug logging guides for [KubeStudio](/kubestudio/help/debugging/) and [Pick](/pick/help/debugging/).