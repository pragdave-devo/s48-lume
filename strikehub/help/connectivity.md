---
title: "StrikeHub: Connectivity"
description: Troubleshooting connector offline status, socket mismatches, WebSocket drops, and stale sockets.
nav_order: 8
parent: "StrikeHub"
---

This guide covers common connectivity issues between StrikeHub and its connector applications.

## Connector shows "Offline" but it's running

**Symptom:** A connector process is running but StrikeHub shows it as offline.

**Possible causes:**

- **Socket path mismatch** — The Unix socket path in the connector doesn't match what's in `connectors.toml`.
- **Health endpoint not responding** — The connector must serve `GET /health` and return `200 OK`.

**Debugging:**

```bash
# Check if the Unix socket exists
ls -la /tmp/strikehub-kubestudio.sock

# Test health over Unix socket
curl --unix-socket /tmp/strikehub-kubestudio.sock http://localhost/health
```

> **Tip:** Check `~/.config/strikehub/connectors.toml` to verify the socket path for each connector.
## Socket path mismatch

**Symptom:** StrikeHub logs show `connection refused` for a specific connector.

**Possible causes:**

- The connector binary was started with a custom socket path that doesn't match the config.
- A typo in the socket filename.

**Debugging:**

```bash
# List all StrikeHub sockets
ls /tmp/strikehub-*.sock

# Check the configured path
grep socket ~/.config/strikehub/connectors.toml
```

Ensure the socket path in the config exactly matches the one the connector creates.

## WebSocket connection drops

**Symptom:** The connector UI loads but becomes unresponsive, or live updates stop.

**Possible causes:**

- **WsRelay crash** — The WebSocket relay bridge has exited. Check StrikeHub logs for `ws_relay` errors.
- **Network interruption** — Brief connectivity loss between the connector process and StrikeHub.
- **Connector crash** — The connector process itself has exited. Check the sidebar status indicator.

**Debugging:**

```bash
# Run with WebSocket tracing
RUST_LOG=sh_core::ws_relay=debug cargo run --features desktop

# Check if the relay port is still listening
lsof -i :9090
```

> **Caution:** If the WsRelay repeatedly crashes, check for port conflicts on the relay port (default `9090`).
## Stale socket files

**Symptom:** StrikeHub fails to start or connectors can't bind their socket.

**Possible causes:**

- StrikeHub or a connector exited uncleanly, leaving orphaned socket files in `/tmp/`.

**Debugging:**

```bash
# Remove stale sockets
rm /tmp/strikehub-*.sock

# Verify no process is using the socket
lsof /tmp/strikehub-kubestudio.sock
```

StrikeHub cleans up stale sockets on startup, but manual removal may be needed if the cleanup itself fails.

