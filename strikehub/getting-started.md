---
title: Getting Started with StrikeHub
description: Build and run StrikeHub from source.
nav_order: 2
parent: "StrikeHub"
---

This guide walks you through building and running StrikeHub on your local machine.

## Prerequisites

- **Rust 1.91.1+** (check with `rustup show`)
- **macOS or Linux** (macOS is the primary platform)
- **Prospector Studio** (for authentication and platform features)

## Clone and Build

```bash
git clone https://github.com/Strike48-public/strikehub.git
cd strikehub
cargo run --features desktop
```

For a release build:

```bash
cargo build --release --features desktop
./target/release/strikehub
```

## Environment Variables

Set these before running StrikeHub:

| Variable | Purpose | Required |
|----------|---------|----------|
| `STRIKE48_API_URL` | Strike48 API / Keycloak server URL | For auth |
| `MATRIX_TLS_INSECURE` | Skip TLS verification (`true` / `1`) | No |
| `RUST_LOG` | Logging level (`info`, `debug`) | No |

Example:

```bash
RUST_LOG=debug STRIKE48_API_URL=https://studio.strike48.test cargo run --features desktop
```

## First Launch

1. StrikeHub opens with a sidebar and a welcome screen.
2. Built-in connector manifests (KubeStudio, JiraStudio, etc.) appear in the sidebar with offline status.
3. Start a connector — either from the UI or by running the connector binary separately.
4. Once the connector is running, its status turns green and you can click to load its UI in the content panel.

## What's Next

- [Configuration](/strikehub/guides/configuration/) — Customize connectors.toml and environment variables
- [Connectors](/strikehub/guides/connectors/) — Understand the IPC transport and content delivery pipeline
- [Installation](/strikehub/guides/installation/) — Platform-specific build details
