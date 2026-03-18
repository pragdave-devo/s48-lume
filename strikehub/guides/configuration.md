---
title: Configuration
description: Configure StrikeHub with environment variables and TOML connector config.
nav_order: 4
parent: "StrikeHub"
---

StrikeHub is configured through environment variables and a TOML config file for connectors.

## Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `STRIKE48_API_URL` | Strike48 API / Keycloak server URL | None |
| `MATRIX_TLS_INSECURE` | Skip TLS verification (`true` or `1`) | `false` |
| `RUST_LOG` | Log level filter (`error`, `warn`, `info`, `debug`, `trace`) | `info` |

Example:

```bash
RUST_LOG=debug \
STRIKE48_API_URL=https://studio.strike48.test \
cargo run --features desktop
```

## Connector Configuration

Connectors are defined in `~/.config/strikehub/connectors.toml`. This file is auto-created on first run with built-in defaults.

### Format

```toml
[connectors.kubestudio]
display_name = "KubeStudio"
binary = "/path/to/ks-connector"
icon = "hero-server-stack"
auto_start = false
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `display_name` | String | Name shown in the sidebar |
| `binary` | String | Path to the connector binary (required for IPC) |
| `icon` | String | Icon identifier for the sidebar |
| `auto_start` | Boolean | Start the connector automatically on launch |
| `socket_path` | String | Unix socket path (for external connectors) |
| `enabled` | Boolean | Whether the connector appears in the sidebar |

### Example: Full Configuration

```toml
[connectors.kubestudio]
display_name = "KubeStudio"
binary = "~/code/strike48/studio-kube-desktop/target/release/ks-connector"
icon = "hero-server-stack"
auto_start = true

[connectors.pick]
display_name = "Pick"
binary = "~/code/strike48/dioxus-connector/target/release/pentest-agent"
icon = "hero-shield-exclamation"
auto_start = false

[connectors.custom-external]
display_name = "External Service"
icon = "app"
enabled = true
socket_path = "/tmp/my-app.sock"
```

### Custom Connectors

You can register any HTTP server as a connector. Provide a `socket_path` pointing to an existing Unix domain socket.

The connector must serve:
- `GET /health` — Returns 200 OK when healthy
- `GET /connector/info` — Returns JSON with name and icon metadata
- `GET /liveview` — The main UI endpoint (HTML page)
