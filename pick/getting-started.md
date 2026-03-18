---
title: Getting Started with Pick
description: Deploy Pick and run your first penetration testing scan.
nav_order: 2
parent: "Pick"
---

Pick is a headless penetration testing agent best run hosted within Prospector Studio or the StrikeHub desktop app.

## Prerequisites

- **Rust 1.91.1+**
- **macOS or Linux** (Windows for desktop mode)
- **Elevated privileges** for traffic capture and WiFi scanning

## Build from Source

```bash
git clone https://github.com/Strike48-public/pick.git
cd pick
cargo build --release -p pentest-agent
```

The headless binary is produced at `./target/release/pentest-agent`.

## Running as a StrikeHub Connector

Configure Pick in `~/.config/strikehub/connectors.toml`:

```toml
[connectors.pick]
display_name = "Pick"
binary = "/path/to/pentest-agent"
icon = "hero-shield-exclamation"
auto_start = false
transport = "ipc"
```

StrikeHub will spawn the binary and communicate over a Unix domain socket. Pick serves its workspace UI via Dioxus LiveView at the socket path.

## Running a Port Scan

Once Pick is running inside StrikeHub, open it from the sidebar. The tools dashboard lists all available tools. Select **port_scan**, configure the target host and port range, and execute.

Tools can also be triggered remotely via the Prospector Studio API by AI agents or other users.

## Next Steps

- [Tool Guide](/pick/guides/marketplace/) — Detailed usage for each built-in tool
