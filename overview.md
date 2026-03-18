---
title: Welcome to Strike48
description: Documentation for the Strike48 desktop platform — StrikeHub, KubeStudio, and Pick.
nav_order: 1
---

Strike48 builds native desktop tools and connectors for security and infrastructure operations. **Prospector Studio** is Strike48's distributed AI orchestration platform for building workflows, managing agents, and connecting external systems. Strike48 connectors extend the platform to the desktop — bringing native tools for Kubernetes management, penetration testing, and more into a unified shell.

## How It Fits Together

**Prospector Studio** is the backend platform — workflow engine, agent runtime, GraphQL API, and web-based studio UI. **Strike48 connectors** are native desktop apps that integrate with Prospector Studio over gRPC, providing specialized tools that run locally on your machine while staying connected to the platform.

**StrikeHub** is the desktop shell that hosts all connectors in a single window. The first two connector releases are **KubeStudio** and **Pick**.

## Products

### StrikeHub

The unified desktop shell. StrikeHub discovers, launches, and manages connector apps — rendering each as an embeddable panel inside a single native window. It handles authentication, WebSocket bridging, and health monitoring so connectors can focus on their domain logic.

[Get started with StrikeHub →](/strikehub/)

### KubeStudio

Kubernetes cluster management dashboard. Browse namespaces, inspect workloads, view pod logs, and manage deployments from a native desktop interface. Best experienced hosted within Prospector Studio or the StrikeHub desktop app.

[Get started with KubeStudio →](/kubestudio/)

### Pick

Headless penetration testing toolkit. Network scanning, device discovery, traffic capture, and remote tool execution — deployed as a lightweight agent. Tools can be triggered locally or remotely via the Prospector Studio API.

[Get started with Pick →](/pick/)

## Architecture

Strike48 uses a **host + connector** model:

- **Prospector Studio** is the backend platform — AI orchestration, workflow execution, agent runtime, and connector registry.
- **StrikeHub** is the desktop host shell — a Dioxus app with a sidebar, content area, and status bar.
- **Connectors** (KubeStudio, Pick) are independent processes that serve their UI via HTTP and communicate with the host over Unix domain sockets. They register their tools with Prospector Studio over gRPC.

Each connector runs in its own process for isolation — a crash in one tool doesn't affect the shell or other connectors. Communication happens over Unix domain sockets, so no TCP ports are exposed to the network.

:::tip[Want to understand the full architecture?]
See the [Platform Architecture](/architecture/) page for comprehensive details on:
- How connectors run in StrikeHub vs. Prospector Studio
- How to access Prospector Studio
- Communication patterns and deployment models
- Security considerations and configuration options
:::

## Tech Stack

| Component | Technology |
|-----------|------------|
| Language | Rust (2024 edition) |
| UI Framework | Dioxus 0.6 |
| WebView | Wry |
| HTTP Server | Axum 0.7 |
| Async Runtime | Tokio |
| IPC Transport | Unix domain sockets |
| Platform Integration | gRPC (Prospector Studio) |
| Authentication | OIDC / OAuth (Keycloak) |
| Configuration | TOML |

## License

Strike48 is licensed under the [Mozilla Public License 2.0](https://www.mozilla.org/en-US/MPL/2.0/) (MPL-2.0).
