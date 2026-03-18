---
title: "KubeStudio: Debug Logging"
description: RUST_LOG for KubeStudio crates, kube-rs tracing, and API request inspection.
nav_order: 7
parent: "KubeStudio"
---

KubeStudio uses the Rust `tracing` ecosystem for structured logging. All log output is controlled via the `RUST_LOG` environment variable.

## Enabling debug logs

```bash
# General debug output
RUST_LOG=debug cargo run -p ks-connector

# Trace-level output (very verbose)
RUST_LOG=trace cargo run -p ks-connector
```

## Per-crate log targeting

Target specific crates to reduce noise:

```bash
# KubeStudio connector logic
RUST_LOG=ks_connector=debug cargo run -p ks-connector

# Kubernetes API client (kube-rs)
RUST_LOG=kube=debug cargo run -p ks-connector

# HTTP layer (hyper/tower)
RUST_LOG=hyper=debug,tower=debug cargo run -p ks-connector

# Multiple targets
RUST_LOG=ks_connector=debug,kube=info cargo run -p ks-connector
```

Common crate targets:

| Crate | What it covers |
|-------|---------------|
| `ks_connector` | KubeStudio connector logic, UI components |
| `kube` | Kubernetes API client (kube-rs) |
| `kube_client` | HTTP requests to the Kubernetes API |
| `tower` | HTTP middleware, retry, timeout |
| `hyper` | Low-level HTTP request/response |

## kube-rs tracing

The `kube-rs` library emits structured tracing spans for every API request. Enable `kube=debug` to see:

```
kube::client: requesting method=GET url="https://10.0.0.1:6443/api/v1/namespaces"
kube::client: response status=200 latency_ms=42
```

For even more detail, including request/response bodies:

```bash
RUST_LOG=kube_client=trace cargo run -p ks-connector
```

> **Caution:** Trace-level kube-rs logging includes full response bodies, which can be very large for list operations. Use this only for targeted debugging.
## Inspecting API requests

### Using kubectl as a proxy

Route KubeStudio through a `kubectl proxy` to inspect requests:

```bash
# Start the proxy
kubectl proxy --port=8001

# Point KubeStudio at the proxy (if supported)
KUBE_API_URL=http://localhost:8001 cargo run -p ks-connector
```

### Checking API connectivity

```bash
# Verify your kubeconfig works
kubectl cluster-info

# Test a specific API call
kubectl get namespaces -v=6
```

The `-v=6` flag shows the HTTP requests `kubectl` makes, which mirrors what KubeStudio does internally.

## Collecting logs for bug reports

```bash
RUST_LOG=ks_connector=debug,kube=debug cargo run -p ks-connector 2>&1 | tee kubestudio-debug.log
```

> **Tip:** Strip any sensitive data (bearer tokens, cluster addresses, secret values) from log files before sharing.