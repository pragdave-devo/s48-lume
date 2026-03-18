---
title: Troubleshooting
description: Common issues and solutions for the Strike48 platform.
draft: true
nav_order: 2
parent: "Shared"
---

This page is a quick-reference triage index. For detailed debugging guides, see the per-product help docs linked from each section.

## StrikeHub

### StrikeHub won't start

**Symptom:** The application crashes on launch or shows a blank window.

**Possible causes:**
- Missing WebView dependencies on Linux. Install `libwebkit2gtk-4.1-dev` and `libgtk-3-dev`.
- Corrupted config file. Delete `~/.config/strikehub/connectors.toml` and restart — it will be recreated with defaults.

For more detail, see the [UI & Rendering help guide](/strikehub/help/ui-rendering/).

### Connector shows "Offline" but it's running

**Symptom:** A connector process is running but StrikeHub shows it as offline.

**Possible causes:**
- **Wrong transport mode** — If the connector is running on TCP but configured as IPC (or vice versa), StrikeHub won't find it.
- **Socket path mismatch** — For IPC connectors, verify the socket path matches between the connector process and the config.
- **Health endpoint not responding** — The connector must serve `GET /health` and return 200 OK.

**Debugging:**

```bash
# Check if the Unix socket exists
ls -la /tmp/strikehub-kubestudio.sock

# Test the health endpoint over Unix socket
curl --unix-socket /tmp/strikehub-kubestudio.sock http://localhost/health

# Test the health endpoint over TCP
curl http://127.0.0.1:3030/health
```

For more detail, see the [Connectivity help guide](/strikehub/help/connectivity/).

### Authentication fails

**Symptom:** The sign-in flow opens the browser but never completes, or the token isn't injected.

**Possible causes:**
- `STRIKE48_API_URL` is not set or points to the wrong server.
- The Keycloak server is unreachable. Check network connectivity.
- TLS certificate issues. Try setting `MATRIX_TLS_INSECURE=true` for local development.

For more detail, see the [Authentication help guide](/strikehub/help/authentication/).

### WebSocket connection drops

**Symptom:** The connector UI loads but becomes unresponsive, or live updates stop.

**Possible causes:**
- The WsRelay bridge crashed. Check StrikeHub logs (`RUST_LOG=debug`).
- Network interruption between the connector process and StrikeHub.
- The connector process itself crashed. Check the sidebar status indicator.

For more detail, see the [Connectivity help guide](/strikehub/help/connectivity/).

## KubeStudio

### "Connection refused" for cluster

**Symptom:** KubeStudio can't connect to the Kubernetes cluster.

**Possible causes:**
- The cluster is down or unreachable.
- The kubeconfig context is stale. Refresh credentials with `kubectl config use-context <name>`.
- VPN or network issues blocking access to the API server.

For more detail, see the [Cluster Connectivity help guide](/kubestudio/help/cluster-connectivity/).

### No namespaces showing

**Symptom:** The namespace list is empty.

**Possible causes:**
- The current kubeconfig user doesn't have permission to list namespaces. Try with a cluster-admin context.
- The cluster is still initializing. Wait and refresh.

For more detail, see the [Permissions & RBAC help guide](/kubestudio/help/permissions/).

## General

### Enabling debug logging

Set the `RUST_LOG` environment variable for verbose output:

```bash
RUST_LOG=debug cargo run --features desktop
```

For even more detail:

```bash
RUST_LOG=trace cargo run --features desktop
```

See the per-product debug logging guides for crate-specific targeting:
- [StrikeHub Debug Logging](/strikehub/help/debugging/)
- [KubeStudio Debug Logging](/kubestudio/help/debugging/)
- [Pick Debug Logging](/pick/help/debugging/)

### Stale socket files

If StrikeHub exits uncleanly, socket files may be left behind in `/tmp/`. These are cleaned up on the next start, but you can also remove them manually:

```bash
rm /tmp/strikehub-*.sock
```

For more detail, see the [Connectivity help guide](/strikehub/help/connectivity/).

### Reporting issues

If you encounter a bug:

1. Reproduce with `RUST_LOG=debug`
2. Note the error messages in the terminal output
3. Report at [github.com/strike48](https://github.com/strike48) with steps to reproduce and log output
