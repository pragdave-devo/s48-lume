---
title: "Pick: Privileges"
description: Which tools need root, sudo usage, Linux capabilities (setcap), and macOS permissions.
nav_order: 9
parent: "Pick"
---

Some of Pick's tools require elevated privileges to access raw network interfaces, ARP tables, or packet capture. This guide explains which tools need what and how to grant access safely.

## Tools requiring elevated privileges

| Tool | Root required | Why |
|------|:---:|-----|
| `port_scan` | No | Uses TCP connect (unprivileged) |
| `device_info` | No | Reads system info from `/proc` and sysctl |
| `wifi_scan` | Yes | Accesses wireless interface control |
| `arp_table` | No | Reads `/proc/net/arp` (Linux) or `arp -a` |
| `ssdp_discover` | No | Uses standard UDP multicast |
| `network_discover` | No | Uses mDNS multicast on port 5353 |
| `screenshot` | No | Uses display server APIs |
| `traffic_capture` | Yes | Opens raw sockets for packet capture |
| `execute_command` | Depends | Inherits the privilege level of the Pick process |

## Running with sudo

The simplest approach for development:

```bash
sudo RUST_LOG=debug cargo run -p pick-connector
```

> **Caution:** Running the entire application as root is acceptable for development but not recommended for production deployments. Use Linux capabilities or per-tool escalation instead.
## Linux capabilities (setcap)

Grant specific capabilities to the Pick binary instead of running as root:

```bash
# Allow raw socket access (for traffic_capture)
sudo setcap cap_net_raw=eip ./target/release/pick-connector

# Allow raw socket + WiFi control
sudo setcap cap_net_raw,cap_net_admin=eip ./target/release/pick-connector
```

Required capabilities by tool:

| Tool | Capability |
|------|-----------|
| `traffic_capture` | `cap_net_raw` |
| `wifi_scan` | `cap_net_admin` |

Verify the capabilities are set:

```bash
getcap ./target/release/pick-connector
```

> **Note:** `setcap` only works on the final binary, not via `cargo run`. Build a release binary first with `cargo build --release -p pick-connector`.
## macOS permissions

macOS uses a different privilege model. Some tools require explicit user consent:

### Screen recording (screenshot tool)

The `screenshot` tool requires **Screen Recording** permission:

1. Open **System Settings > Privacy & Security > Screen Recording**
2. Add the Pick binary or terminal application
3. Restart Pick

### Network access

macOS may prompt for network access permission on first run. Allow it to enable:
- Port scanning
- mDNS/SSDP discovery
- Traffic capture (also requires running as root or with BPF access)

### BPF access for packet capture

```bash
# Grant BPF device access (required for traffic_capture on macOS)
sudo chmod o+r /dev/bpf*
```

Or run Pick with sudo:

```bash
sudo ./target/release/pick-connector
```

## Verifying privileges

Run Pick with debug logging to check privilege-related errors:

```bash
RUST_LOG=pick_connector::tools=debug cargo run -p pick-connector
```

Look for:

```
pick_connector::tools: tool failed name="traffic_capture" err="permission denied (os error 1)"
pick_connector::tools: tool failed name="wifi_scan" err="operation not permitted"
```

These indicate the tool needs elevated privileges. Apply the appropriate fix from the sections above.
