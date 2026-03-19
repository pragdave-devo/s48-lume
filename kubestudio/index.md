---
title: KubeStudio
description: Kubernetes cluster browser and management tool for the Strike48 platform.
nav_order: 5
---

KubeStudio is a native desktop Kubernetes client built with Dioxus and Axum, providing a visual interface for browsing clusters, inspecting workloads, and managing deployments.

[**Install →**](/kubestudio/guides/installation/)

![KubeStudio](/assets/img/kubestudio/screenshots/overview.png)

## What is KubeStudio?

KubeStudio is a Kubernetes cluster management dashboard that runs as a connector within StrikeHub or Prospector Studio. It connects to your clusters via kubeconfig, providing a rich visual interface for navigating namespaces, inspecting pods, managing deployments, and monitoring workloads — all from a single native desktop window.

## Key Features

### Cluster Browsing
Navigate your Kubernetes infrastructure:
- Browse namespaces and resources
- View cluster-wide resource summaries
- Inspect node status and capacity

<video autoplay loop muted playsinline style="width:100%; margin-top:0.75rem; border-radius:0.75rem; box-shadow:0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.10);">
  <source src="/assets/img/kubestudio/videos/cluster-management.mp4" type="video/mp4" />
</video>

### Deployment Management
Full deployment lifecycle control:
- Scale replica counts
- View rollout history
- Trigger rolling restarts
- Monitor rollout progress

<video autoplay loop muted playsinline style="width:100%; margin-top:0.75rem; border-radius:0.75rem; box-shadow:0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.10);">
  <source src="/assets/img/kubestudio/videos/deployments.mp4" type="video/mp4" />
</video>

### Pod Inspection
Deep visibility into running workloads:
- Stream real-time container logs
- View resource usage and limits
- Inspect container status and events
- Debug failing pods

### Multi-Cluster Support
Work across multiple environments:
- Switch between kubeconfig contexts
- Manage development, staging, and production clusters
- Per-cluster configuration

### Flexible Deployment
Run where it fits your workflow:
- Embedded in StrikeHub as a managed connector over Unix domain sockets
- Hosted in Prospector Studio for team collaboration and remote access

## Architecture

KubeStudio is built as a Dioxus liveview application served by an Axum HTTP server:

```
ks-connector binary
├── Axum server (TCP or Unix socket)
│   ├── /liveview        (Dioxus liveview UI)
│   ├── /health          (health check endpoint)
│   ├── /connector/info  (metadata for StrikeHub)
│   ├── /assets/*        (CSS, JS, WASM)
│   └── /ws              (Dioxus liveview WebSocket)
└── Kubernetes API client (via kube-rs)
```

When running inside StrikeHub, KubeStudio communicates over a Unix domain socket for secure, isolated IPC.

## Technology Stack

- **Language**: Rust
- **UI Framework**: Dioxus (liveview mode)
- **HTTP Server**: Axum
- **Kubernetes Client**: kube-rs
- **Integration**: StrikeHub connector protocol
- **Build Tool**: Just command runner

## Use Cases

KubeStudio is designed for:

- **Cluster Management** - Browse and manage Kubernetes resources across multiple clusters
- **Deployment Operations** - Scale, restart, and monitor deployments visually
- **Debugging** - Inspect pod logs, events, and resource usage for troubleshooting
- **DevOps Workflows** - Integrate Kubernetes management into the Strike48 desktop workspace

## License

KubeStudio is licensed under the Mozilla Public License 2.0 (MPL-2.0). You can use, modify, and distribute the software. Modifications to MPL-licensed files must be shared under the same license.

## Next Steps

Ready to get started? Check out the following guides:

- [Getting Started](/kubestudio/getting-started/) — Build and run KubeStudio
- [Cluster Management](/kubestudio/guides/cluster-management/) — Navigate and manage your clusters
- [Deployments](/kubestudio/guides/deployments/) — Work with Kubernetes deployments
- [Debug Logging](/kubestudio/help/debugging/) — Troubleshooting and debug logging
