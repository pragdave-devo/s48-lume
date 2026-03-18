---
title: Configuration
description: Configure Pick for your environment
nav_order: 6
parent: "Pick"
---

# Configuration Guide

This guide covers how to configure Pick to connect to your Strike48 backend and customize its behavior.

## Overview

Pick requires configuration to connect to the Strike48 backend server. Configuration can be provided through:

1. **Environment variables** (recommended for development)
2. **Command-line arguments** (recommended for production)
3. **Configuration file** (optional, for complex setups)

## Required Configuration

### Strike48 Connection Settings

The connector needs three pieces of information to connect to Strike48:

| Setting | Description | Example |
|---------|-------------|---------|
| **Strike48 Host** | gRPC or WebSocket endpoint | `grpc://localhost:50061` or `ws://strike48.example.com` |
| **Tenant ID** | Your Strike48 tenant identifier | `tenant-123` |
| **Auth Token** | JWT or One-Time Token (OTT) | `eyJhbGciOiJIUzI1NiIs...` |

## Configuration Methods

### Method 1: Environment Variables

Set environment variables before running the application:

```bash
export STRIKE48_HOST="grpc://localhost:50061"
export TENANT_ID="your-tenant-id"
export AUTH_TOKEN="your-auth-token"

# Optional: Set logging level
export RUST_LOG="pentest=debug,info"

# Run the application
cargo run --package pentest-desktop
```

### Method 2: Command-Line Arguments

Pass configuration directly when running the application:

```bash
# Desktop
./target/release/pentest-desktop \
  --host grpc://localhost:50061 \
  --tenant-id your-tenant-id \
  --token your-auth-token

# Web
./target/release/pentest-web \
  --host grpc://localhost:50061 \
  --tenant-id your-tenant-id \
  --token your-auth-token \
  --port 3000

# TUI
./target/release/pentest-tui \
  --host grpc://localhost:50061 \
  --tenant-id your-tenant-id \
  --token your-auth-token
```

### Method 3: Configuration File

Create a configuration file at `~/.config/dioxus-connector/config.toml`:

```toml
[strike48]
host = "grpc://localhost:50061"
tenant_id = "your-tenant-id"
auth_token = "your-auth-token"

[logging]
level = "info"
# Available levels: trace, debug, info, warn, error

[network]
# Network request timeout in seconds
timeout = 30

# Maximum concurrent connections
max_connections = 100
```

Load the configuration file:

```bash
./target/release/pentest-desktop --config ~/.config/dioxus-connector/config.toml
```

## Connection Protocols

### gRPC Connection

For backends that support gRPC (recommended for performance):

```bash
STRIKE48_HOST="grpc://strike48.example.com:50061"
```

Features:
- HTTP/2 based
- Binary protocol (efficient)
- Native streaming support
- TLS encryption support

### WebSocket Connection

For backends that only support WebSocket:

```bash
STRIKE48_HOST="ws://strike48.example.com:8080/connector"
```

For secure WebSocket:
```bash
STRIKE48_HOST="wss://strike48.example.com/connector"
```

Features:
- Works through HTTP proxies
- Compatible with web browsers
- Text or binary framing

## Authentication

### JWT Token

Long-lived token for production deployments:

```bash
AUTH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### One-Time Token (OTT)

Short-lived token for temporary connections:

```bash
AUTH_TOKEN="ott_abc123def456"
```

OTTs expire after a single use or time limit.

## Platform-Specific Configuration

### Desktop

Additional desktop-specific options:

```bash
# Window configuration
--window-width 1200
--window-height 800
--window-title "Pentest Connector"

# Start minimized to system tray
--minimize-to-tray
```

### Web (LiveView)

Web server configuration:

```bash
# Server bind address and port
--bind 0.0.0.0
--port 3000

# TLS configuration
--tls-cert /path/to/cert.pem
--tls-key /path/to/key.pem

# Max concurrent sessions
--max-sessions 100
```

### Mobile

Mobile apps use the UI for configuration. Settings are stored in platform-specific locations:

- **Android**: `SharedPreferences`
- **iOS**: `UserDefaults`

### TUI

Terminal-specific options:

```bash
# Color scheme
--theme dark  # or 'light'

# Disable mouse support
--no-mouse
```

## Logging Configuration

Control log output verbosity:

### Using RUST_LOG

```bash
# Show all logs
export RUST_LOG=trace

# Show debug logs for pentest modules only
export RUST_LOG=pentest=debug

# Multiple modules
export RUST_LOG=pentest=debug,strike48_connector=info

# Quiet mode (errors only)
export RUST_LOG=error
```

### Log Levels

| Level | Description | Use Case |
|-------|-------------|----------|
| `trace` | Very verbose | Deep debugging |
| `debug` | Detailed info | Development |
| `info` | General info | Production default |
| `warn` | Warnings | Issues that don't prevent operation |
| `error` | Errors only | Critical issues |

## Network Configuration

### Timeouts

Set connection and request timeouts:

```bash
# Connection timeout (seconds)
--connect-timeout 10

# Request timeout (seconds)
--request-timeout 60
```

### Proxy Settings

Configure HTTP/HTTPS proxy:

```bash
export HTTP_PROXY="http://proxy.example.com:8080"
export HTTPS_PROXY="https://proxy.example.com:8443"

# No proxy for local addresses
export NO_PROXY="localhost,127.0.0.1"
```

### TLS/SSL Configuration

For self-signed certificates:

```bash
# Accept invalid certificates (development only!)
--accept-invalid-certs

# Specify CA certificate
--ca-cert /path/to/ca.pem
```

**Warning**: Only use `--accept-invalid-certs` in development environments.

## Tool-Specific Configuration

### Port Scanning

```bash
# Default port range for scans
--default-port-range 1-1024

# Scan timeout per port (milliseconds)
--scan-timeout 1000

# Concurrent connections
--scan-concurrency 100
```

### Network Capture

```bash
# Default capture interface
--capture-interface eth0

# Capture buffer size (MB)
--capture-buffer 10
```

Network capture requires elevated privileges:

```bash
# Linux/macOS
sudo ./target/release/pentest-desktop

# Or grant capabilities (Linux only)
sudo setcap cap_net_raw,cap_net_admin=eip ./target/release/pentest-desktop
```

## Example Configurations

### Development Setup

```bash
export STRIKE48_HOST="grpc://localhost:50061"
export TENANT_ID="dev-tenant"
export AUTH_TOKEN="dev-token-123"
export RUST_LOG="pentest=debug,info"

cargo run --package pentest-desktop
```

### Production Setup

```bash
./target/release/pentest-desktop \
  --host grpc://prod.strike48.com:50061 \
  --tenant-id prod-tenant-456 \
  --token "${STRIKE48_AUTH_TOKEN}" \
  --accept-invalid-certs false \
  --ca-cert /etc/ssl/certs/strike48-ca.pem \
  --connect-timeout 15 \
  --request-timeout 120
```

### Web Server (Production)

```bash
./target/release/pentest-web \
  --host grpc://prod.strike48.com:50061 \
  --tenant-id prod-tenant-456 \
  --token "${STRIKE48_AUTH_TOKEN}" \
  --bind 0.0.0.0 \
  --port 443 \
  --tls-cert /etc/ssl/certs/pentest-web.pem \
  --tls-key /etc/ssl/private/pentest-web.key \
  --max-sessions 50
```

## Verifying Configuration

Test your configuration:

```bash
# Desktop/TUI
./target/release/pentest-desktop --verify-config

# Check connectivity to Strike48
./target/release/pentest-desktop --health-check
```

Expected output:
```
✓ Configuration loaded successfully
✓ Connected to Strike48 backend
✓ Authenticated as connector: conn-abc123
✓ Registered 9 tools
```

## Troubleshooting

### Connection Issues

**Problem**: Cannot connect to Strike48 backend

**Solutions**:
1. Verify the host URL is correct and reachable
2. Check firewall rules
3. Ensure the backend is running
4. Test connectivity: `curl -v http://strike48.example.com/health`

### Authentication Failures

**Problem**: Authentication token rejected

**Solutions**:
1. Verify token hasn't expired
2. Check tenant ID matches the token
3. Regenerate token from Strike48 admin interface

### TLS/Certificate Errors

**Problem**: TLS handshake failures

**Solutions**:
1. Ensure CA certificate is correctly specified
2. Verify certificate chain is complete
3. Check certificate expiration date
4. Use `--accept-invalid-certs` for testing (development only)

## Next Steps

- [Architecture Documentation](../architecture.md) - Learn about the project structure
- Return to [Installation Guide](./installation.md) if you need to rebuild
