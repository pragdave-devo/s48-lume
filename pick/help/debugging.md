---
title: "Pick: Debug Logging"
description: RUST_LOG for Pick crates, tool execution tracing, gRPC logging, and headless vs StrikeHub logs.
nav_order: 8
parent: "Pick"
---

Pick uses the Rust `tracing` ecosystem for structured logging. This guide covers how to enable and target logging for different Pick subsystems.

## Enabling debug logs

```bash
# General debug output
RUST_LOG=debug cargo run -p pick-connector

# Trace-level (very verbose)
RUST_LOG=trace cargo run -p pick-connector
```

## Per-crate log targeting

```bash
# Pick connector logic
RUST_LOG=pick_connector=debug cargo run -p pick-connector

# Tool execution
RUST_LOG=pick_connector::tools=debug cargo run -p pick-connector

# gRPC communication with Prospector Studio
RUST_LOG=tonic=debug cargo run -p pick-connector

# Multiple targets
RUST_LOG=pick_connector=debug,tonic=info cargo run -p pick-connector
```

Common crate targets:

| Crate | What it covers |
|-------|---------------|
| `pick_connector` | Core Pick logic, tool registry, execution engine |
| `pick_connector::tools` | Individual tool implementations (port scan, ARP, etc.) |
| `tonic` | gRPC client/server communication |
| `hyper` | HTTP requests (Axum server, health endpoint) |
| `pcap` | Packet capture internals |

## Tool execution tracing

To trace a specific tool's execution:

```bash
# Watch all tool invocations
RUST_LOG=pick_connector::tools=debug cargo run -p pick-connector
```

Look for structured log output:

```
pick_connector::tools: tool invoked name="port_scan" params={"target":"10.0.0.1","ports":"1-1024"}
pick_connector::tools: tool completed name="port_scan" duration_ms=3200 results=42
pick_connector::tools: tool failed name="traffic_capture" err="permission denied"
```

## gRPC logging

When Pick communicates with Prospector Studio over gRPC:

```bash
RUST_LOG=tonic=debug,pick_connector=debug cargo run -p pick-connector
```

This shows:

```
tonic::transport: connecting to studio endpoint="https://studio.example.com:443"
pick_connector: registering tools with studio count=9
pick_connector: remote invocation received tool="port_scan"
```

## Headless vs StrikeHub logging

Pick runs in two modes, and log output differs:

### Headless mode (Prospector Studio)

When running as a hosted connector, logs go directly to stderr:

```bash
RUST_LOG=debug ./pick-connector 2>&1 | tee pick-debug.log
```

### StrikeHub IPC mode

Logs go to StrikeHub's combined output. To isolate Pick's logs:

```bash
RUST_LOG=pick_connector=debug cargo run --features desktop 2>&1 | grep pick_connector
```

## Collecting logs for bug reports

```bash
RUST_LOG=pick_connector=debug,tonic=debug cargo run -p pick-connector 2>&1 | tee pick-debug.log
```

> **Tip:** Strip any sensitive data (target IPs, network scan results, credentials) from log files before sharing.