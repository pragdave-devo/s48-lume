---
title: Pick
description: Headless penetration testing toolkit for the Strike48 platform.
nav_order: 6
---

Pick is a lightweight, headless penetration testing agent built with Dioxus, providing network reconnaissance, device discovery, and remote tool execution capabilities.

[**Install →**](/pick/getting-started/installation/)

![Pick](/assets/img/pick/screenshots/overview.png)

## What is Pick?

Pick is a droppable penetration testing toolkit designed to run hosted within Prospector Studio or the StrikeHub desktop app. It's a single binary that can be deployed on any system without requiring a GUI, windowing system, or desktop environment. Pick provides network scanning, device discovery, traffic capture, and remote command execution — controllable via the StrikeHub workspace UI or remotely via the Prospector Studio API.

## Key Features

### Network Scanning
TCP port scanning and service discovery:
- Concurrent connection scanning
- Configurable port ranges
- Service identification

### Device Discovery
Multiple discovery protocols:
- ARP table reading
- mDNS service discovery
- UPnP/SSDP enumeration

### Traffic Capture
Network packet analysis:
- Network packet capture (requires elevated privileges)
- WiFi network enumeration
- Real-time traffic monitoring

### System Reconnaissance
Host information gathering:
- Device and system information collection
- Screenshot capture as base64 PNG
- Environment enumeration

### Remote Execution
Bi-directional tool control:
- Shell command execution
- Tools triggered manually via UI or remotely via Prospector Studio API
- Bi-directional control between local and remote interfaces

### Built-in Tools
Comprehensive toolkit out of the box:

| Tool | Description |
|------|-------------|
| `port_scan` | TCP port scanning with concurrent connections |
| `device_info` | System/device information gathering |
| `wifi_scan` | WiFi network enumeration |
| `arp_table` | ARP cache reading |
| `ssdp_discover` | UPnP device discovery |
| `network_discover` | mDNS service discovery |
| `screenshot` | Screen capture (base64 PNG) |
| `traffic_capture` | Network packet capture |
| `execute_command` | Shell command execution |

### Cross-Platform Support
Deploy anywhere from a single codebase:

| Platform | Runtime |
|----------|---------|
| Linux | Desktop, headless |
| macOS | Desktop, headless |
| Windows | Desktop |
| Web | Dioxus LiveView |
| Mobile | Android, iOS |
| Terminal | TUI interface |

## Architecture

Pick is built with the [Dioxus](https://dioxuslabs.com/) framework, enabling true cross-platform deployment from a single codebase. It operates in two modes:
- **StrikeHub IPC mode** — Runs as a managed connector within StrikeHub, communicating over Unix domain sockets
- **Prospector Studio mode** — Connects directly to Prospector Studio over gRPC for remote orchestration

When running inside StrikeHub, Pick serves a full workspace UI (dashboard, tools, files, shell, logs, chat) via Dioxus LiveView.

## Technology Stack

- **Language**: Rust
- **UI Framework**: Dioxus (liveview mode)
- **HTTP Server**: Axum
- **Remote API**: gRPC (Prospector Studio)
- **Integration**: StrikeHub connector protocol
- **Build Tool**: Just command runner

## Use Cases

Pick is designed for:

- **Red Team Operations** - Deploy as a droppable agent for network reconnaissance and lateral movement
- **Penetration Testing** - Scan networks, discover devices, and execute remote commands
- **Security Research** - Develop and test new reconnaissance tools
- **Training & Education** - Learn network scanning and discovery techniques in a controlled environment

## License

Pick is licensed under the Mozilla Public License 2.0 (MPL-2.0). You can use, modify, and distribute the software. Modifications to MPL-licensed files must be shared under the same license.

## Disclaimer

**IMPORTANT**: Pick is intended for authorized security testing, penetration testing engagements, and educational purposes only. Users are responsible for ensuring they have proper authorization before using this tool against any systems. Unauthorized access to computer systems is illegal.

## Next Steps

Ready to get started? Check out the following guides:

- [Getting Started](/pick/getting-started/) — Deploy Pick and run your first scan
- [Architecture](/pick/architecture/) — Technical architecture and design
- [Installation](/pick/getting-started/installation/) — Set up your development environment
- [Configuration](/pick/getting-started/configuration/) — Configure for your needs
- [Tools](/pick/guides/marketplace/) — Tool usage and configuration
- [Debug Logging](/pick/help/debugging/) — Troubleshooting and debug logging
