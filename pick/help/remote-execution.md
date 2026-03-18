---
title: "Pick: Remote Execution"
description: Troubleshooting tool registration failures, remote invocation issues, Studio connection drops, and timeouts.
nav_order: 11
parent: "Pick"
---

Pick integrates with Prospector Studio for remote tool invocation over gRPC. This guide covers issues with the remote execution pipeline.

## Tool registration fails

**Symptom:** Pick starts but doesn't appear in Prospector Studio's tool list.

**Possible causes:**

- **Studio unreachable** — The gRPC endpoint for Prospector Studio is down or misconfigured.
- **Authentication failure** — Pick's credentials are invalid or expired.
- **Network issues** — Firewall or DNS preventing the gRPC connection.

**Debugging:**

```bash
# Run with gRPC tracing
RUST_LOG=tonic=debug,pick_connector=debug cargo run -p pick-connector
```

Look for:

```
tonic::transport: connecting to studio endpoint="https://studio.example.com:443"
tonic::transport: connection failed err="dns resolution failed"
# or
pick_connector: tool registration failed err="unauthenticated"
```

Verify the Studio endpoint:

```bash
# Test gRPC connectivity
grpcurl -plaintext studio.example.com:443 list
```

## Remote invocation doesn't execute

**Symptom:** A tool is invoked from Prospector Studio but Pick doesn't execute it.

**Possible causes:**

- **Stale registration** — Pick registered tools but the gRPC stream was interrupted.
- **Tool name mismatch** — The invocation uses a tool name that doesn't match Pick's registry.
- **Pick process restarted** — After a restart, tools must re-register.

**Debugging:**

```bash
RUST_LOG=pick_connector=debug cargo run -p pick-connector
```

Look for incoming invocation messages:

```
pick_connector: remote invocation received tool="port_scan" id="abc-123"
# If missing, the invocation never reached Pick
```

If no invocation log appears, the issue is on the Studio side or the gRPC stream is disconnected.

## Studio connection drops

**Symptom:** Pick connects to Studio initially but the connection drops after some time.

**Possible causes:**

- **Idle timeout** — The gRPC connection was terminated due to inactivity.
- **Network instability** — Intermittent connectivity between Pick and Studio.
- **Studio restart** — The Studio server was restarted, invalidating existing streams.

**Debugging:**

```bash
RUST_LOG=tonic=debug,pick_connector=debug cargo run -p pick-connector
```

Look for reconnection attempts:

```
tonic::transport: connection lost, reconnecting...
pick_connector: re-registering tools with studio
```

> **Tip:** Pick should automatically reconnect and re-register tools. If it doesn't, restart the Pick process.
## Tool execution timeouts

**Symptom:** A remotely invoked tool starts but never returns a result, or Studio shows a timeout error.

**Possible causes:**

- **Long-running tool** — Some tools (e.g., `port_scan` with large ranges, `traffic_capture`) take longer than the default timeout.
- **Tool hung** — The tool subprocess is stuck (e.g., waiting for network response that will never come).
- **Result too large** — The tool output exceeds the gRPC message size limit.

**Debugging:**

```bash
# Check if the tool is still running
RUST_LOG=pick_connector::tools=debug cargo run -p pick-connector
```

Look for:

```
pick_connector::tools: tool invoked name="port_scan" params=...
# ... long gap with no completion message ...
pick_connector::tools: tool timeout name="port_scan" elapsed_ms=30000
```

For large port scans, consider reducing the port range or increasing concurrency limits. For traffic capture, set a reasonable packet count or duration limit.

> **Note:** Timeouts are configured on the Studio side. If a tool legitimately needs more time, coordinate with your Studio administrator to adjust the invocation timeout.