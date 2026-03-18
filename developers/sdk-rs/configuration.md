---
title: Configuration
description: Configure the Strike48 SDK with environment variables and programmatic options
nav_order: 5
parent: "For Developers"
---

# Configuration

The Strike48 SDK provides flexible configuration options through environment variables and programmatic configuration. This guide covers all available configuration options and best practices.

## Configuration Methods

### Method 1: Environment Variables (Recommended)

The simplest way to configure your connector:

```rust
use strike48_connector_sdk::*;

#[tokio::main]
async fn main() -> Result<()> {
    init_logger();

    // Load all configuration from environment
    let config = ConnectorConfig::from_env();

    let connector = Arc::new(MyConnector);
    let runner = ConnectorRunner::new(config, connector);
    runner.run().await
}
```

Set environment variables:

```bash
export MATRIX_HOST=localhost:50061
export TENANT_ID=default
export CONNECTOR_TYPE=my-connector
export INSTANCE_ID=my-connector-prod
```

### Method 2: Programmatic Configuration

For more control, configure programmatically:

```rust
let config = ConnectorConfig {
    matrix_host: "matrix.example.com:50061".to_string(),
    tenant_id: "my-tenant".to_string(),
    connector_type: "my-connector".to_string(),
    instance_id: "my-instance".to_string(),
    version: "1.0.0".to_string(),
    auth_token: "".to_string(),
    use_tls: true,
    ..ConnectorConfig::default()
};
```

### Method 3: Hybrid Approach

Combine environment variables with programmatic overrides:

```rust
let config = ConnectorConfig::from_env()
    .display_name("Production Server 1")
    .tag("prod")
    .tag("us-east-1")
    .with_metadata("location", "AWS US-East-1");
```

## Core Configuration Options

### Essential Settings

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MATRIX_HOST` or `MATRIX_URL` | Prospector Studio server URL | `localhost:50061` | Yes |
| `TENANT_ID` | Tenant identifier | - | Yes |
| `CONNECTOR_TYPE` | Connector type identifier | - | Yes |
| `INSTANCE_ID` | Unique instance identifier | Auto-generated | No |
| `AUTH_TOKEN` | JWT authentication token | Empty | No |
| `USE_TLS` | Enable TLS/SSL | `false` | No |

### Instance Metadata

| Variable | Description | Default |
|----------|-------------|---------|
| `CONNECTOR_DISPLAY_NAME` | Human-readable name | `instance_id` |
| `CONNECTOR_TAGS` | Comma-separated tags | Empty |

## Instance ID

The `INSTANCE_ID` uniquely identifies your connector instance. This is **critical** for:

- **Credential persistence** - Saved credentials are keyed by instance ID
- **Session management** - Prospector Studio tracks sessions by instance
- **Reconnection** - Same instance ID allows seamless reconnection

### Auto-Generated Instance ID

If not provided, the SDK generates a random instance ID:

```
{connector_type}-{timestamp_millis}
```

Example: `echo-1709478901234`

### Best Practices

**For production:**
```bash
# Use a stable instance ID for auto-reconnection
export INSTANCE_ID=echo-prod-us-east-1
```

**For development:**
```bash
# Let it auto-generate for testing
# (omit INSTANCE_ID)
```

**For Kubernetes:**
```bash
# Use pod name or deployment name
export INSTANCE_ID=$HOSTNAME
# or
export INSTANCE_ID=my-connector-deployment
```

## Authentication & Credentials

The SDK uses asymmetric authentication (`private_key_jwt`) with RSA key pairs.

### First Connection Flow

1. Connector starts without credentials
2. Admin approves connector in Prospector Studio
3. SDK generates RSA key pair automatically
4. Private key saved for future use
5. Connector receives session token

### Reconnection Flow

When restarting with the same `INSTANCE_ID`:

1. SDK loads saved credentials
2. Fetches fresh JWT using saved private key
3. Reconnects without requiring re-approval

### Storage Locations

**Default paths:**

| Item | Location |
|------|----------|
| Private Keys | `~/.matrix/keys/{connector_type}_{instance_id}.pem` |
| Credentials | `~/.matrix/credentials/matrix_{tenant}_{type}_{instance}.json` |

**Override paths:**

```bash
# Custom keys directory
export MATRIX_KEYS_DIR=/custom/path/to/keys

# Direct private key path (for cert-manager/K8s)
export MATRIX_PRIVATE_KEY_PATH=/var/run/secrets/matrix/tls.key
export MATRIX_CLIENT_ID=my-connector-client
export MATRIX_KEYCLOAK_URL=https://keycloak.example.com/realms/matrix
```

### Kubernetes Secret Example

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: connector-credentials
type: Opaque
data:
  tls.key: <base64-encoded-private-key>
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-connector
spec:
  template:
    spec:
      containers:
      - name: connector
        env:
        - name: MATRIX_PRIVATE_KEY_PATH
          value: /var/run/secrets/matrix/tls.key
        - name: INSTANCE_ID
          value: my-connector-prod
        volumeMounts:
        - name: credentials
          mountPath: /var/run/secrets/matrix
          readOnly: true
      volumes:
      - name: credentials
        secret:
          secretName: connector-credentials
```

## Instance Metadata & Routing

Instance metadata enables multi-instance routing and better UI display in Prospector Studio.

### Display Name

```rust
let config = ConnectorConfig::from_env()
    .display_name("Production Server 1");
```

Or via environment:
```bash
export CONNECTOR_DISPLAY_NAME="Production Server 1"
```

### Tags

Tags enable grouping and routing to multiple instances:

```rust
let config = ConnectorConfig::from_env()
    .tag("prod")
    .tag("us-east-1")
    .tag("high-priority");
```

Or via environment:
```bash
export CONNECTOR_TAGS=prod,us-east-1,high-priority
```

### Custom Metadata

Add arbitrary key-value metadata:

```rust
let config = ConnectorConfig::from_env()
    .with_metadata("location", "AWS US-East-1")
    .with_metadata("owner", "platform-team")
    .with_metadata("cost-center", "engineering");
```

### Load Metadata from Environment

```rust
// Reads CONNECTOR_LOCATION, CONNECTOR_OWNER, etc.
let config = ConnectorConfig::from_env()
    .metadata_from_env("CONNECTOR_");
```

```bash
export CONNECTOR_LOCATION="AWS US-East-1"
export CONNECTOR_OWNER="platform-team"
export CONNECTOR_COST_CENTER="engineering"
```

## Agent Routing Behavior

Prospector Studio uses instance metadata for intelligent routing:

| Command | Routing Behavior |
|---------|------------------|
| "run command" | Round-robin across all instances |
| "run command on prod-1" | Route to specific `instance_id` |
| "run command on Production Server 1" | Route via `display_name` |
| "run command on all prod servers" | Broadcast to instances tagged "prod" |
| "run command on us-east-1 servers" | Broadcast to instances tagged "us-east-1" |

### Example: Multi-Region Deployment

```rust
// US-East-1 instance
let config = ConnectorConfig::from_env()
    .display_name("US East 1 Server")
    .tags(["prod", "us-east-1", "high-capacity"])
    .with_metadata("region", "us-east-1")
    .with_metadata("capacity", "high");

// EU-West-1 instance
let config = ConnectorConfig::from_env()
    .display_name("EU West 1 Server")
    .tags(["prod", "eu-west-1", "standard-capacity"])
    .with_metadata("region", "eu-west-1")
    .with_metadata("capacity", "standard");
```

Routing examples:
- "run on US East 1 Server" → Routes to US instance
- "run on all prod servers" → Broadcasts to both instances
- "run on us-east-1 servers" → Routes to US instance only

## TLS/SSL Configuration

### Enable TLS

```bash
export USE_TLS=true
export MATRIX_HOST=matrix.example.com:443
```

Or programmatically:

```rust
let config = ConnectorConfig {
    use_tls: true,
    matrix_host: "matrix.example.com:443".to_string(),
    ..ConnectorConfig::default()
};
```

### Custom TLS Certificates

For self-signed certificates or custom CAs:

```bash
export MATRIX_TLS_CA_CERT=/path/to/ca.crt
```

## Logging Configuration

The SDK uses the `tracing` crate. Control log level via `RUST_LOG`:

```bash
# Show all logs
export RUST_LOG=debug

# Show only errors and warnings
export RUST_LOG=warn

# Show logs for specific modules
export RUST_LOG=strike48_connector_sdk=debug,my_connector=info

# Complex filtering
export RUST_LOG=warn,strike48_connector_sdk::runner=debug
```

### Initialize Logging

```rust
use strike48_connector_sdk::*;

#[tokio::main]
async fn main() -> Result<()> {
    // Initialize with default settings
    init_logger();

    // ... rest of your code
}
```

### Custom Log Format

```rust
use tracing_subscriber::{fmt, EnvFilter};

fn main() {
    // Custom logging configuration
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .with_target(true)
        .with_thread_ids(true)
        .with_file(true)
        .with_line_number(true)
        .json() // JSON format for structured logging
        .init();

    // ... rest of your code
}
```

## Reconnection Settings

The SDK automatically reconnects on connection failures with exponential backoff.

Default behavior:
- **Initial delay:** 1 second
- **Max delay:** 60 seconds
- **Backoff multiplier:** 2x
- **Max retries:** Unlimited

These settings are currently not configurable but will be in a future release.

## Complete Configuration Example

```rust
use strike48_connector_sdk::*;
use std::sync::Arc;

#[tokio::main]
async fn main() -> Result<()> {
    // Initialize logging
    init_logger();

    // Load base configuration from environment
    let config = ConnectorConfig::from_env()
        // Override or add metadata
        .display_name("Production Database Connector")
        .tags(["prod", "us-east-1", "database"])
        .with_metadata("location", "AWS US-East-1")
        .with_metadata("owner", "platform-team")
        .with_metadata("priority", "high")
        // Load additional metadata from environment
        .metadata_from_env("CONNECTOR_");

    // Create and run connector
    let connector = Arc::new(MyConnector::new());
    let runner = ConnectorRunner::new(config, connector);

    runner.run().await
}
```

Environment variables:

```bash
# Core settings
export MATRIX_HOST=matrix.example.com:50061
export TENANT_ID=production
export CONNECTOR_TYPE=database
export INSTANCE_ID=database-prod-us-east-1
export USE_TLS=true

# Metadata (loaded via metadata_from_env)
export CONNECTOR_COST_CENTER=engineering
export CONNECTOR_VERSION=2.1.0

# Logging
export RUST_LOG=info,strike48_connector_sdk=debug
```

## Environment Variables Reference

### Complete List

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `MATRIX_HOST` | String | `localhost:50061` | Prospector Studio host:port |
| `MATRIX_URL` | String | - | Alias for MATRIX_HOST |
| `TENANT_ID` | String | **required** | Tenant identifier |
| `CONNECTOR_TYPE` | String | **required** | Connector type |
| `INSTANCE_ID` | String | Auto-generated | Unique instance ID |
| `AUTH_TOKEN` | String | Empty | JWT token (optional) |
| `USE_TLS` | Boolean | `false` | Enable TLS |
| `CONNECTOR_DISPLAY_NAME` | String | `instance_id` | Human-readable name |
| `CONNECTOR_TAGS` | String | Empty | Comma-separated tags |
| `MATRIX_KEYS_DIR` | String | `~/.matrix/keys` | Keys directory |
| `MATRIX_PRIVATE_KEY_PATH` | String | - | Direct key path |
| `MATRIX_CLIENT_ID` | String | - | Keycloak client ID |
| `MATRIX_KEYCLOAK_URL` | String | - | Keycloak URL |
| `MATRIX_TLS_CA_CERT` | String | - | Custom CA certificate |
| `RUST_LOG` | String | `info` | Log level filter |

## Best Practices

### 1. Use Stable Instance IDs in Production

```bash
# Good - enables auto-reconnection
export INSTANCE_ID=my-connector-prod

# Bad - generates new ID on each restart
# (omit INSTANCE_ID)
```

### 2. Use Environment Variables for Secrets

```bash
# Never hardcode tokens
export AUTH_TOKEN=$SECRET_TOKEN
```

### 3. Tag Your Instances

```bash
export CONNECTOR_TAGS=prod,us-east-1,high-priority
```

### 4. Set Display Names

```bash
export CONNECTOR_DISPLAY_NAME="Production Server (US-East-1)"
```

### 5. Use Appropriate Log Levels

```bash
# Development
export RUST_LOG=debug

# Production
export RUST_LOG=info
```

## Troubleshooting

### Configuration Not Loading

**Problem:** Environment variables not being read.

**Solution:** Ensure you're calling `ConnectorConfig::from_env()`:

```rust
let config = ConnectorConfig::from_env(); // ✓ Correct
// Not: ConnectorConfig::default() // ✗ Won't read env vars
```

### Credentials Not Persisting

**Problem:** Connector requires re-approval on every restart.

**Solution:** Use a stable `INSTANCE_ID`:

```bash
export INSTANCE_ID=my-connector-prod
```

### TLS Certificate Errors

**Problem:** "certificate verify failed" errors.

**Solution:** For self-signed certificates:

```bash
export MATRIX_TLS_CA_CERT=/path/to/ca.crt
```

## Next Steps

Now that you understand configuration, explore these topics:

- **Capabilities** - Define specific capabilities your connector supports
- **WebSocket Handling** - Build real-time streaming connectors
- **Process Execution** - Execute external commands and processes
- **Error Handling** - Implement robust error handling

## Resources

- [Quick Start Guide](./quick-start.md) - Build your first connector
- [SDK Examples](https://github.com/Strike48/sdk-rs/tree/main/examples) - Example configurations
- [API Documentation](https://github.com/Strike48/sdk-rs) - Full API reference
