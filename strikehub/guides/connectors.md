---
title: Connectors
description: How StrikeHub's connector system works — IPC and the content delivery pipeline.
nav_order: 6
parent: "StrikeHub"
---

StrikeHub uses a connector architecture where each tool runs as an independent process. This page explains the IPC transport and the content delivery pipeline.

<video autoplay loop muted playsinline style="width:100%; margin-top:0.75rem; border-radius:0.75rem; box-shadow:0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.10);">
  <source src="/assets/img/strikehub/videos/overview.mp4" type="video/mp4" />
</video>

## IPC Transport

Connectors run as child processes communicating over **Unix domain sockets**.

**How it works:**

1. StrikeHub spawns the connector binary as a child process
2. The connector binds an Axum HTTP server to a Unix socket at `/tmp/strikehub-{id}.sock`
3. StrikeHub polls the socket until it exists, then sends a health check
4. Content is served through the `connector://` custom protocol — no TCP ports needed

**Advantages:**
- No port allocation or conflicts
- No network exposure — Unix sockets are local-only
- Process isolation — a connector crash doesn't affect the shell
- No StrikeHub dependency on connector crates

**Environment variables passed to child processes:**

| Variable | Value | Purpose |
|----------|-------|---------|
| `STRIKEHUB_SOCKET` | `/tmp/strikehub-{id}.sock` | Tells the connector to bind a Unix socket |
| `STRIKE48_API_URL` | From StrikeHub config | API access if needed |

## Content Delivery Pipeline

Content is served through Wry's custom protocol handler:

```
connector://kubestudio/liveview
```

The request flow:

1. Iframe loads `connector://kubestudio/liveview`
2. Wry's custom protocol handler intercepts the request
3. HTTP request is forwarded to the connector's Unix socket
4. HTML response is rewritten — auth token, API URL, and WebSocket URL are injected
5. Response is returned to the webview

## WebSocket Bridge

WebSocket connections can't go through custom protocol handlers, so StrikeHub runs a **WsRelay** — a single TCP listener that bridges WebSocket traffic:

| Path | Destination |
|------|-------------|
| `/ws/{connector_id}` | Connector's Unix socket (Dioxus liveview WS) |
| `/ws/graphql` | Prospector Studio (GraphQL subscriptions) |

This is the only TCP port StrikeHub opens, regardless of how many connectors are active.

## Building a Connector

A connector is any Axum HTTP server that serves the required endpoints over a Unix socket:

```rust
let sock_path = std::env::var("STRIKEHUB_SOCKET")
    .expect("STRIKEHUB_SOCKET must be set");
let path = PathBuf::from(&sock_path);
if path.exists() {
    std::fs::remove_file(&path)?;
}
let listener = tokio::net::UnixListener::bind(&path)?;

axum::serve(listener, router).await?;
```

### Required Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Health check — return 200 OK |
| `/connector/info` | GET | JSON metadata (name, icon) |
| `/liveview` | GET | Main UI page (HTML) |
| `/ws` | GET | WebSocket upgrade (Dioxus liveview) |
| `/assets/*` | GET | Static assets (CSS, JS, WASM) |

The connector doesn't need to know about custom protocols, WS bridges, or auth injection. It just serves HTTP on whatever listener it's given.

## Health Monitoring

StrikeHub checks connector health at regular intervals:

- **Interval:** Every 3–5 seconds
- **Timeout:** 2 seconds per check
- **Endpoint:** `GET /health` over the connector's Unix socket
- **Status indicators:** Green (online), yellow (checking), red (offline)

When a connector goes offline:
1. Sidebar indicator turns red
2. Content panel shows a "Connector offline" overlay
3. If `auto_start` is enabled, StrikeHub can attempt a restart
