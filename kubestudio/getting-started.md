---
title: Getting Started with KubeStudio
description: Build and run KubeStudio as a StrikeHub connector.
nav_order: 2
parent: "KubeStudio"
---

## Quick Start

```bash
git clone https://github.com/Strike48-public/kubestudio.git
cd kubestudio
cargo build --release
```

---

## Prerequisites

- **Rust 1.91.1+**
- **A Kubernetes cluster** (or kubeconfig pointing to one)
- **macOS or Linux**
- **StrikeHub** or **Prospector Studio**

## Running as a StrikeHub Connector

Configure KubeStudio in `~/.config/strikehub/connectors.toml`:

```toml
[connectors.kubestudio]
display_name = "KubeStudio"
binary = "/path/to/studio-kube-desktop/target/release/ks-connector"
icon = "kubernetes"
auto_start = true
transport = "ipc"
```

StrikeHub will spawn the binary and pass `STRIKEHUB_SOCKET` as an environment variable. KubeStudio detects this and binds a Unix socket instead of a TCP port.

## Kubeconfig

KubeStudio reads your default kubeconfig (`~/.kube/config`) or the path specified by the `KUBECONFIG` environment variable. Make sure you have at least one cluster context configured.

```bash
kubectl config get-contexts
```

## Next Steps

- [Cluster Management](/kubestudio/guides/cluster-management/) — Navigate namespaces and workloads
- [Deployments](/kubestudio/guides/deployments/) — Manage deployments, scaling, and rollouts
