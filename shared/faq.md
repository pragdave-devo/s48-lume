---
title: FAQ
description: Frequently asked questions about the Strike48 platform.
draft: true
nav_order: 1
parent: "Shared"
---

## General

### What is Strike48?

Strike48 builds native desktop tools and connectors for security and infrastructure operations. **Prospector Studio** is Strike48's main platform — a distributed AI orchestration system for building workflows, managing agents, and connecting external systems. StrikeHub is the desktop host shell, and the first two connector releases are KubeStudio (Kubernetes management) and Pick (penetration testing toolkit).

### What platforms are supported?

macOS is the primary platform. Linux is supported as a secondary target. Windows support is not currently available.

### Is Strike48 open source?

Strike48 is licensed under the Mozilla Public License 2.0 (MPL-2.0). You can use, modify, and distribute the software. Modifications to MPL-licensed files must be shared under the same license.

## StrikeHub

### How should I run connectors?

We recommend running connectors through the StrikeHub desktop app or hosted within Prospector Studio. StrikeHub provides the unified desktop shell experience, while Prospector Studio adds team collaboration and remote execution.

### How many connectors can I run simultaneously?

There's no hard limit. Each connector runs as a separate process, so the practical limit depends on your system's memory and CPU. StrikeHub itself uses under 100 MB of RAM (excluding connector webviews).

### Do connectors expose network ports?

In IPC mode (the default for new connectors), no TCP ports are exposed for connector traffic. The only TCP port is a single WebSocket bridge on localhost. In legacy TCP mode, each connector opens a localhost port.

### How does authentication work?

StrikeHub handles OIDC authentication with Keycloak via a system browser OAuth flow. Auth tokens are injected into connector HTML automatically — connectors don't manage their own authentication.

## KubeStudio

### Which Kubernetes versions are supported?

KubeStudio uses the `kube-rs` client library and supports Kubernetes API versions compatible with `kube-rs`. Generally this covers Kubernetes 1.24+.

### Can I connect to multiple clusters?

Yes. KubeStudio reads all contexts from your kubeconfig and lets you switch between them.

### Is KubeStudio read-only?

KubeStudio supports read operations (browsing, log viewing) and limited write operations (scaling deployments). Destructive operations are intentionally gated.

## Pick

### Does Pick require root privileges?

Some tools (traffic capture, WiFi scanning) require elevated privileges. Port scanning, device info, ARP table reading, and other tools work without root.

### Can Pick be controlled remotely?

Yes. When connected to Prospector Studio (via StrikeHub or hosted directly), all tools are registered and can be invoked remotely by users or AI agents through the Prospector Studio API.
